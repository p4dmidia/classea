-- MIGRATION: Affiliate Enhancements
-- 1. Add CNPJ column to affiliates and user_profiles
ALTER TABLE public.affiliates ADD COLUMN IF NOT EXISTS cnpj text UNIQUE;
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS cnpj text UNIQUE;

-- 2. Prevent deletion of admin users
-- Function to check if user is admin before deletion
CREATE OR REPLACE FUNCTION public.check_admin_before_delete()
RETURNS TRIGGER AS $$
BEGIN
    -- Check if the user being deleted is an admin in user_profiles
    -- We use user_id for affiliates and id for user_profiles
    IF TG_TABLE_NAME = 'user_profiles' THEN
        IF OLD.role = 'admin' THEN
            RAISE EXCEPTION 'Não é permitido excluir usuários com nível de administrador pelo painel. A exclusão só pode ser feita via banco de dados.';
        END IF;
    ELSIF TG_TABLE_NAME = 'affiliates' THEN
        -- Link to user_profiles to check role
        IF EXISTS (SELECT 1 FROM public.user_profiles WHERE id = OLD.user_id AND role = 'admin') THEN
            RAISE EXCEPTION 'Não é permitido excluir usuários com nível de administrador pelo painel. A exclusão só pode ser feita via banco de dados.';
        END IF;
    END IF;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Triggers for protection
DROP TRIGGER IF EXISTS tr_protect_admin_profiles ON public.user_profiles;
CREATE TRIGGER tr_protect_admin_profiles
BEFORE DELETE ON public.user_profiles
FOR EACH ROW EXECUTE FUNCTION public.check_admin_before_delete();

DROP TRIGGER IF EXISTS tr_protect_admin_affiliates ON public.affiliates;
CREATE TRIGGER tr_protect_admin_affiliates
BEFORE DELETE ON public.affiliates
FOR EACH ROW EXECUTE FUNCTION public.check_admin_before_delete();

-- 3. Secure function to update password
-- Note: This requires pgcrypto for hashing
CREATE OR REPLACE FUNCTION public.admin_update_user_password(target_user_id uuid, new_password text)
RETURNS void AS $$
BEGIN
    -- Only allow if the executing user is an admin
    IF NOT EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin') THEN
        RAISE EXCEPTION 'Apenas administradores podem alterar senhas de outros usuários.';
    END IF;

    -- Update auth.users table
    -- We use crypt to hash the password
    UPDATE auth.users 
    SET encrypted_password = crypt(new_password, gen_salt('bf')),
        updated_at = now()
    WHERE id = target_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Update the trigger function to capture CPF and CNPJ
CREATE OR REPLACE FUNCTION public.handle_new_affiliate_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
 AS $function$
 DECLARE
   v_full_name text;
 BEGIN
   -- Build full name safely
   v_full_name := TRIM(CONCAT_WS(' ', 
     new.raw_user_meta_data ->> 'nome', 
     new.raw_user_meta_data ->> 'sobrenome'
   ));
   
   IF v_full_name = '' THEN
     v_full_name := 'Novo Afiliado';
   END IF;
 
   -- 1. Create Profile
   INSERT INTO public.user_profiles (id, email, role, cpf, cnpj, created_at, updated_at)
   VALUES (
     new.id, 
     new.email, 
     COALESCE(new.raw_user_meta_data ->> 'role', 'affiliate'),
     new.raw_user_meta_data ->> 'cpf',
     new.raw_user_meta_data ->> 'cnpj',
     new.created_at, 
     new.created_at
   );
 
   -- 2. Create Affiliate
   INSERT INTO public.affiliates (user_id, email, full_name, referral_code, cpf, cnpj, whatsapp, created_at, updated_at)
   VALUES (
     new.id,
     new.email,
     v_full_name,
     new.raw_user_meta_data ->> 'login',
     new.raw_user_meta_data ->> 'cpf',
     new.raw_user_meta_data ->> 'cnpj',
     new.raw_user_meta_data ->> 'whatsapp',
     new.created_at,
     new.updated_at
   );
 
   -- 3. Create Settings
   INSERT INTO public.user_settings (user_id, created_at, updated_at)
   VALUES (
     new.id,
     new.created_at,
     new.created_at
   );
   
   RETURN new;
 END;
 $function$;

-- Grant execute to authenticated users (the check inside handles security)
GRANT EXECUTE ON FUNCTION public.admin_update_user_password(uuid, text) TO authenticated;

-- 6. Add RLS Policies for Admin Updates
-- Allow admins to update any profile
DROP POLICY IF EXISTS "Admins can update any profile" ON public.user_profiles;
CREATE POLICY "Admins can update any profile" ON public.user_profiles
    FOR UPDATE USING (
        EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- Allow admins to update any affiliate
DROP POLICY IF EXISTS "Admins can update any affiliate" ON public.affiliates;
CREATE POLICY "Admins can update any affiliate" ON public.affiliates
    FOR UPDATE USING (
        EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin')
    );
