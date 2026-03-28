-- CONFIGURAÇÃO DE CHAVES DO MERCADO PAGO POR ORGANIZAÇÃO

-- 1. Garante que as colunas existem
ALTER TABLE public.organizations 
ADD COLUMN IF NOT EXISTS mercadopago_access_token TEXT,
ADD COLUMN IF NOT EXISTS mercadopago_public_key TEXT;

-- 2. Atualiza a organização "Classe A" com as chaves corretas
-- SUBSTITUA 'SEU_ACCESS_TOKEN_AQUI' e 'SUA_PUBLIC_KEY_AQUI' pelos valores corretos da Classe A
UPDATE public.organizations
SET 
    mercadopago_access_token = 'APP_USR-6519047848898101-112815-b0c58d19c97019eb4dd2943254c12e58-3013508460',
    mercadopago_public_key = 'APP_USR-e152f8ab-5122-4a75-bf98-fac1d3faca4b'
WHERE id = '5111af72-27a5-41fd-8ed9-8c51b78b4fdd';

-- 3. Verifica se a atualização foi bem sucedida (não mostrará os valores sensíveis aqui por segurança)
SELECT id, name, 
    (mercadopago_access_token IS NOT NULL) as tem_access_token,
    (mercadopago_public_key IS NOT NULL) as tem_public_key
FROM public.organizations
WHERE id = '5111af72-27a5-41fd-8ed9-8c51b78b4fdd';

-- IMPORTANTE: Após rodar este script, as Edge Functions passarão a usar estas chaves em vez da variável de ambiente global.
