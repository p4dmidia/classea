-- CLASSE A COMMISSION FIX MIGRATION
-- Applies only to organization_id = '5111af72-27a5-41fd-8ed9-8c51b78b4fdd'

-- 1. ADICIONAR COLUNA USER_ID EM ORDERS (SE NÃO EXISTIR)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='orders' AND column_name='user_id') THEN
        ALTER TABLE public.orders ADD COLUMN user_id uuid REFERENCES auth.users(id);
    END IF;
END $$;

-- 2. ADICIONAR ÍNDICES PARA PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_referral_code ON public.orders(referral_code);
CREATE INDEX IF NOT EXISTS idx_orders_organization_id ON public.orders(organization_id);

-- 3. ATUALIZAR FUNÇÃO DE DISTRIBUIÇÃO DE COMISSÃO
CREATE OR REPLACE FUNCTION public.distribute_commissions()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_affiliate RECORD;
    v_current_sponsor_id uuid;
    v_config RECORD;
    v_level_config jsonb;
    v_commission_amount numeric;
    v_gen_count integer := 0;
    v_active_gens integer;
BEGIN
    -- [SEGURANÇA MULTITENANT] - Aplica a lógica apenas para o Classe A
    IF NEW.organization_id != '5111af72-27a5-41fd-8ed9-8c51b78b4fdd' THEN
        -- Para outras organizações, mantém a lógica legada (ou retorna sem fazer nada se preferir)
        -- Aqui vamos apenas retornar para não interferir em outros sistemas
        RETURN NEW;
    END IF;

    -- [GATILHO DE STATUS] - Agora aceita 'Pago' ou 'completed'
    IF (OLD.status IS NULL OR OLD.status NOT IN ('Pago', 'completed')) AND NEW.status IN ('Pago', 'completed') THEN
        
        -- Evita processamento duplicado
        IF EXISTS (SELECT 1 FROM public.commissions WHERE order_id = NEW.id) THEN
            RETURN NEW;
        END IF;

        -- Busca configuração 'geral'
        SELECT * INTO v_config FROM public.commission_configs WHERE key = 'geral';
        IF v_config IS NULL THEN
            RETURN NEW;
        END IF;

        v_active_gens := v_config.active_generations;

        -- IDENTIFICA O AFILIADO INICIAL (Quem deve receber a comissão de Nível 1)
        
        -- Prioridade 1: referral_code no pedido (Case Insensitive)
        IF NEW.referral_code IS NOT NULL AND NEW.referral_code != '' THEN
            SELECT * INTO v_affiliate FROM public.affiliates 
            WHERE LOWER(referral_code) = LOWER(NEW.referral_code)
            AND organization_id = NEW.organization_id;
        END IF;

        -- Prioridade 2: affiliate_id no pedido (se populado via frontend)
        IF v_affiliate IS NULL AND (NEW.affiliate_id::text IS NOT NULL AND NEW.affiliate_id::text != '') THEN
             SELECT * INTO v_affiliate FROM public.affiliates 
             WHERE id = NEW.affiliate_id
             AND organization_id = NEW.organization_id;
        END IF;

        -- Prioridade 3: Sponsor do comprador (se user_id estiver populado)
        IF v_affiliate IS NULL AND NEW.user_id IS NOT NULL THEN
            SELECT a.* INTO v_affiliate 
            FROM public.affiliates a
            JOIN public.user_profiles p ON p.sponsor_id = a.id
            WHERE p.id = NEW.user_id
            AND a.organization_id = NEW.organization_id;
        END IF;

        -- Se nenhum afiliado foi encontrado, não há comissão para distribuir
        IF v_affiliate IS NULL THEN
            RETURN NEW;
        END IF;

        v_current_sponsor_id := v_affiliate.id;

        -- DISTRIBUIÇÃO PELOS NÍVEIS
        WHILE v_gen_count < v_active_gens AND v_current_sponsor_id IS NOT NULL LOOP
            v_gen_count := v_gen_count + 1;
            
            -- Busca valor da comissão para este nível
            SELECT (lvl->>'value')::numeric INTO v_commission_amount
            FROM jsonb_array_elements(v_config.levels) AS lvl
            WHERE (lvl->>'level')::integer = v_gen_count;

            IF v_commission_amount IS NOT NULL AND v_commission_amount > 0 THEN
                
                -- Cálculo do valor
                IF v_config.type = 'percent' THEN
                    v_commission_amount := NEW.total_amount * (v_commission_amount / 100);
                END IF;

                -- Pega o auth.user_id do patrocinador atual
                SELECT user_id INTO v_affiliate.user_id FROM public.affiliates WHERE id = v_current_sponsor_id;

                IF v_affiliate.user_id IS NOT NULL THEN
                    -- Atualiza saldos
                    UPDATE public.user_settings 
                    SET 
                        total_earnings = total_earnings + v_commission_amount,
                        available_balance = available_balance + v_commission_amount,
                        updated_at = now()
                    WHERE user_id = v_affiliate.user_id;

                    -- Registra a comissão
                    INSERT INTO public.commissions (
                        organization_id,
                        user_id,
                        order_id,
                        amount,
                        level,
                        commission_type,
                        description
                    ) VALUES (
                        NEW.organization_id,
                        v_affiliate.user_id,
                        NEW.id,
                        v_commission_amount,
                        v_gen_count,
                        v_config.type,
                        'Comissão de Geração ' || v_gen_count || ' - Pedido ' || NEW.id
                    );
                END IF;
            END IF;

            -- Próximo patrocinador na hierarquia
            SELECT sponsor_id INTO v_current_sponsor_id 
            FROM public.affiliates 
            WHERE id = v_current_sponsor_id;
            
            -- Check de segurança contra loop infinito
            IF v_gen_count > 20 THEN EXIT; END IF;
        END LOOP;
    END IF;

    RETURN NEW;
END;
$$;
