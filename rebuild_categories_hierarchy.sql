-- 1. Limpeza Robusta (Garante que não haverá erros de chave estrangeira)
BEGIN;
  UPDATE public.products SET category_id = NULL, subcategory_id = NULL;
  TRUNCATE TABLE public.product_subcategories, public.product_categories RESTART IDENTITY CASCADE;
COMMIT;

-- 2. Criar Hierarquia
DO $$
DECLARE
    cat_acessorios_id bigint;
    cat_vest_masc_id bigint;
    cat_calc_masc_id bigint;
    cat_fem_id bigint;
    cat_cama_id bigint;
    
    sub_ternos_id bigint;
    sub_fem_acess_id bigint;
    sub_fem_calc_id bigint;
    sub_fem_vest_id bigint;
    
    sub_ternos_micro_id bigint;
BEGIN
    -- --- ACESSÓRIOS ---
    INSERT INTO public.product_categories (name) VALUES ('ACESSÓRIOS') RETURNING id INTO cat_acessorios_id;
    INSERT INTO public.product_categories (name, parent_id) VALUES 
        ('CARTEIRAS', cat_acessorios_id),
        ('CINTOS', cat_acessorios_id),
        ('PULSEIRAS', cat_acessorios_id);

    -- --- VESTUÁRIO MASCULINO ---
    INSERT INTO public.product_categories (name) VALUES ('VESTUÁRIO MASCULINO') RETURNING id INTO cat_vest_masc_id;
    INSERT INTO public.product_categories (name, parent_id) VALUES 
        ('BERMUDAS', cat_vest_masc_id),
        ('CAMISETAS', cat_vest_masc_id),
        ('CALÇAS', cat_vest_masc_id),
        ('CAMISA POLO', cat_vest_masc_id),
        ('CAMISA SOCIAL MANGA CURTA', cat_vest_masc_id),
        ('CAMISA SOCIAL MANGA LONGA', cat_vest_masc_id);
    
    INSERT INTO public.product_categories (name, parent_id) VALUES ('TERNOS & BLAZERS', cat_vest_masc_id) RETURNING id INTO sub_ternos_id;
    -- Sub-sub de Ternos
    INSERT INTO public.product_categories (name, parent_id) VALUES 
        ('MICROFIBRA', sub_ternos_id),
        ('FIO INDIANO', sub_ternos_id),
        ('POLIVISCOSE', sub_ternos_id);
    
    -- Sub-sub de Ternos -> BLAZERS
    INSERT INTO public.product_categories (name, parent_id) VALUES ('BLAZERS', sub_ternos_id) RETURNING id INTO sub_ternos_micro_id;
    INSERT INTO public.product_categories (name, parent_id) VALUES 
        ('MARESIAS', sub_ternos_micro_id),
        ('SARJA', sub_ternos_micro_id);

    -- --- CALÇADO MASCULINO ---
    INSERT INTO public.product_categories (name) VALUES ('CALÇADO MASCULINO') RETURNING id INTO cat_calc_masc_id;
    INSERT INTO public.product_categories (name, parent_id) VALUES 
        ('SAPATÊNIS', cat_calc_masc_id),
        ('TÊNIS', cat_calc_masc_id),
        ('SAPATO SOCIAL', cat_calc_masc_id),
        ('CHINELOS', cat_calc_masc_id);

    -- --- FEMININO ---
    INSERT INTO public.product_categories (name) VALUES ('FEMININO') RETURNING id INTO cat_fem_id;
    
    -- FEMININO -> ACESSÓRIOS FEMININOS
    INSERT INTO public.product_categories (name, parent_id) VALUES ('ACESSÓRIOS FEMININOS', cat_fem_id) RETURNING id INTO sub_fem_acess_id;
    INSERT INTO public.product_categories (name, parent_id) VALUES 
        ('BOLSAS', sub_fem_acess_id),
        ('CARTEIRAS FEMININAS', sub_fem_acess_id),
        ('CINTOS FEMININOS', sub_fem_acess_id);

    -- FEMININO -> CALÇADOS
    INSERT INTO public.product_categories (name, parent_id) VALUES ('CALÇADOS', cat_fem_id) RETURNING id INTO sub_fem_calc_id;
    INSERT INTO public.product_categories (name, parent_id) VALUES 
        ('BOTAS', sub_fem_calc_id),
        ('CHINELOS FEMININOS', sub_fem_calc_id),
        ('MOCASSIM', sub_fem_calc_id),
        ('MULES', sub_fem_calc_id),
        ('PANTUFAS', sub_fem_calc_id),
        ('RASTEIRAS', sub_fem_calc_id),
        ('SAPATILHAS', sub_fem_calc_id),
        ('SANDÁLIAS', sub_fem_calc_id),
        ('SCARPIN', sub_fem_calc_id),
        ('TAMANCOS', sub_fem_calc_id),
        ('TÊNIS CASUAL', sub_fem_calc_id),
        ('TÊNIS ESPORTIVO', sub_fem_calc_id);

    -- FEMININO -> VESTUÁRIO FEMININOS
    INSERT INTO public.product_categories (name, parent_id) VALUES ('VESTUÁRIO FEMININOS', cat_fem_id) RETURNING id INTO sub_fem_vest_id;
    INSERT INTO public.product_categories (name, parent_id) VALUES 
        ('CAMISETAS FEMININAS', sub_fem_vest_id),
        ('BERMUDAS FEMININAS', sub_fem_vest_id),
        ('CALÇAS FEMININAS', sub_fem_vest_id),
        ('SAIAS', sub_fem_vest_id),
        ('VESTIDOS', sub_fem_vest_id),
        ('LINGERIE', sub_fem_vest_id);

    -- --- CAMA ---
    INSERT INTO public.product_categories (name) VALUES ('CAMA') RETURNING id INTO cat_cama_id;
    INSERT INTO public.product_categories (name, parent_id) VALUES 
        ('BASE BOX', cat_cama_id),
        ('TRAVESSEIROS', cat_cama_id),
        ('CABECEIRAS', cat_cama_id),
        ('COLCHÕES ESTÁTICOS', cat_cama_id),
        ('COLCHÕES TERAPÊUTICOS', cat_cama_id);

END $$;
