-- Script para sincronizar produtos com as novas subcategorias baseando-se no título
-- Execute no SQL Editor do Supabase

DO $$ 
DECLARE 
    terapeutico_id bigint;
    haiflex_id bigint;
    classic_id bigint;
    intense_id bigint;
BEGIN
    -- 1. Pega os IDs das categorias (ajustar nomes se necessário)
    SELECT id INTO terapeutico_id FROM product_categories WHERE name = 'Colchões Terapêutico' LIMIT 1;
    SELECT id INTO haiflex_id FROM product_categories WHERE name = 'HAIFLEX' AND parent_id = terapeutico_id LIMIT 1;
    SELECT id INTO classic_id FROM product_categories WHERE name = 'CLASSIC' AND parent_id = terapeutico_id LIMIT 1;
    SELECT id INTO intense_id FROM product_categories WHERE name = 'INTENSE' AND parent_id = terapeutico_id LIMIT 1;

    -- 2. Atualiza produtos HAIFLEX
    IF haiflex_id IS NOT NULL THEN
        UPDATE products 
        SET category_id = haiflex_id 
        WHERE name ILIKE '%HAIFLEX%' 
        AND (category_id = terapeutico_id OR category_id IS NULL);
    END IF;

    -- 3. Atualiza produtos CLASSIC
    IF classic_id IS NOT NULL THEN
        UPDATE products 
        SET category_id = classic_id 
        WHERE name ILIKE '%CLASSIC%' 
        AND (category_id = terapeutico_id OR category_id IS NULL);
    END IF;

    -- 4. Atualiza produtos INTENSE
    IF intense_id IS NOT NULL THEN
        UPDATE products 
        SET category_id = intense_id 
        WHERE name ILIKE '%INTENSE%' 
        AND (category_id = terapeutico_id OR category_id IS NULL);
    END IF;

    RAISE NOTICE 'Sincronização concluída.';
END $$;
