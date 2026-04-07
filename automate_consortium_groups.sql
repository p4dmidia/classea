-- AUTOMATED CONSORTIUM GROUP ASSIGNMENT
-- This script creates a trigger to automatically assign users to consortium groups
-- or create new ones when a purchase is confirmed.

-- 0. CORREÇÃO PARA A TELA (Relacionamento de Perfis)
-- Isso permite que o frontend busque o e-mail do usuário de forma segura.
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_consortium_participants_user_profile') THEN
        ALTER TABLE public.consortium_participants
        ADD CONSTRAINT fk_consortium_participants_user_profile
        FOREIGN KEY (user_id) REFERENCES public.user_profiles(id)
        ON DELETE CASCADE;
    END IF;
END $$;

-- 1. FUNÇÃO DE PROCESAMENTO
CREATE OR REPLACE FUNCTION public.handle_consortium_purchase()
RETURNS trigger AS $$
DECLARE
    v_item RECORD;
    v_group_id uuid;
    v_max_p integer;
    v_group_type text;
    v_lucky_number integer;
    v_group_name text;
BEGIN
    -- Só processa se o status mudar para 'Pago'
    IF (OLD.status IS NULL OR OLD.status != 'Pago') AND NEW.status = 'Pago' THEN
        
        -- Loop pelos itens do pedido procurando por produtos de "Consórcio"
        FOR v_item IN 
            SELECT oi.*, p.name as p_name, pc.name as cat_name
            FROM public.order_items oi
            JOIN public.products p ON oi.product_id = p.id
            LEFT JOIN public.product_categories pc ON p.category_id = pc.id
            WHERE oi.order_id = NEW.id
            AND (pc.name ILIKE '%Consórcio%' OR p.name ILIKE '%Consórcio%')
        LOOP
            -- Determina o tamanho do grupo: 18 para 'Colchão', 12 para outros
            IF v_item.p_name ILIKE '%Colchão%' OR v_item.cat_name ILIKE '%Colchão%' THEN
                v_max_p := 18;
                v_group_type := 'colchao';
            ELSE
                v_max_p := 12;
                v_group_type := 'livre_escolha';
            END IF;

            -- Busca um grupo aberto para a organização e tipo correspondente
            SELECT g.id INTO v_group_id
            FROM public.consortium_groups g
            WHERE g.status = 'open'
            AND g.type = v_group_type
            AND g.max_participants = v_max_p
            AND g.organization_id = NEW.organization_id
            AND g.current_participants < v_max_p
            AND NOT EXISTS (
                SELECT 1 FROM public.consortium_participants cp 
                WHERE cp.group_id = g.id AND cp.user_id = NEW.user_id
            )
            ORDER BY g.created_at ASC
            LIMIT 1;

            -- Se não houver grupo aberto, cria um novo
            IF v_group_id IS NULL THEN
                v_group_name := 'Grupo ' || 
                    CASE WHEN v_group_type = 'colchao' THEN 'Premium 18' ELSE 'Master 12' END || 
                    ' - ' || (SELECT count(*) + 1 FROM public.consortium_groups WHERE organization_id = NEW.organization_id);

                INSERT INTO public.consortium_groups (
                    name,
                    type,
                    max_participants,
                    current_participants,
                    status,
                    organization_id
                ) VALUES (
                    v_group_name,
                    v_group_type,
                    v_max_p,
                    0,
                    'open',
                    NEW.organization_id
                ) RETURNING id INTO v_group_id;
            END IF;

            -- Determina o próximo Número da Sorte disponível no grupo (1 a N)
            SELECT next_num INTO v_lucky_number
            FROM generate_series(1, v_max_p) next_num
            WHERE next_num NOT IN (
                SELECT lucky_number FROM public.consortium_participants WHERE group_id = v_group_id
            )
            ORDER BY next_num ASC
            LIMIT 1;

            -- Adiciona o participante
            IF v_lucky_number IS NOT NULL AND NEW.user_id IS NOT NULL THEN
                INSERT INTO public.consortium_participants (
                    group_id,
                    user_id,
                    lucky_number,
                    status
                ) VALUES (
                    v_group_id,
                    NEW.user_id,
                    v_lucky_number,
                    'active'
                ) ON CONFLICT (group_id, user_id) DO NOTHING;

                -- Atualiza a contagem de participantes no grupo
                UPDATE public.consortium_groups
                SET current_participants = (
                    SELECT count(*) FROM public.consortium_participants WHERE group_id = v_group_id
                )
                WHERE id = v_group_id;

                -- Fecha o grupo se atingir a capacidade máxima
                UPDATE public.consortium_groups
                SET status = 'full'
                WHERE id = v_group_id AND current_participants >= max_participants;
            END IF;

        END LOOP;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. GATILHO (TRIGGER)
DROP TRIGGER IF EXISTS tr_on_order_paid_consortium ON public.orders;
CREATE TRIGGER tr_on_order_paid_consortium
    AFTER UPDATE ON public.orders
    FOR EACH ROW
    WHEN (NEW.status = 'Pago')
    EXECUTE FUNCTION public.handle_consortium_purchase();
