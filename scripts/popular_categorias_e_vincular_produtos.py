import os
import json
import csv
import urllib.request
import re

ORGANIZATION_ID = '5111af72-27a5-41fd-8ed9-8c51b78b4fdd'
SUPABASE_URL = 'https://rizznjuehbgfvgeulxyh.supabase.co'
SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJpenpuanVlaGJnZnZnZXVseHloIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MTkyMTgxMCwiZXhwIjoyMDk3NDk3ODEwfQ.aRarZ2fosrLXfzRX9NefqbcngaGgomGF2UatOThO9Hc'

# 1. Carregar categorias de all_categories.json
with open('all_categories.json', 'r', encoding='utf-8') as f:
    categories = json.load(f)

# Ordenar por níveis de hierarquia (pais antes dos filhos)
levels = {None: 0}
changed = True
while changed:
    changed = False
    for c in categories:
        pid = c['parent_id']
        cid = c['id']
        if pid in levels and cid not in levels:
            levels[cid] = levels[pid] + 1
            changed = True

sorted_categories = sorted(categories, key=lambda c: levels.get(c['id'], 99))

print(f"1. Inserindo {len(sorted_categories)} categorias no Supabase...")

headers = {
    'apikey': SERVICE_ROLE_KEY,
    'Authorization': f'Bearer {SERVICE_ROLE_KEY}',
    'Content-Type': 'application/json',
    'Prefer': 'resolution=merge-duplicates'
}

# Inserir cada categoria
cat_payload = []
for c in sorted_categories:
    cat_payload.append({
        'id': c['id'],
        'name': c['name'],
        'parent_id': c['parent_id'],
        'organization_id': ORGANIZATION_ID
    })

# Inserir em lotes ordenados por nível de dependência
inserted_cats = 0
for level in sorted(set(levels.values())):
    if level == 0:
        continue # None parent level
    batch = [c for c in cat_payload if levels.get(c['id']) == level]
    if not batch:
        continue
    data = json.dumps(batch).encode('utf-8')
    req = urllib.request.Request(f"{SUPABASE_URL}/rest/v1/product_categories", data=data, headers=headers)
    try:
        with urllib.request.urlopen(req) as resp:
            inserted_cats += len(batch)
            print(f"  Nível {level}: {len(batch)} categorias inseridas.")
    except Exception as e:
        err = e.read().decode('utf-8') if hasattr(e, 'read') else str(e)
        print(f"  Erro ao inserir categorias nível {level}:", err)

print(f"Total de categorias inseridas/atualizadas: {inserted_cats}")

# 2. Mapeamento dos produtos de final_import_1_29.csv
UNMAPPED_FALLBACK = {
    'camisa manga longa slim fit button down xadrez': 11,
    'colchão classic': 55,
    'colcho classic': 55,
    'anabela cunha salto 4 cm em corda': 37,
    'rasteirinha confort': 35,
    'mule em couro confort': 33,
    'botas em couro petróleo': 30,
    'botas em couro petrleo': 30,
    'consórcio combo master classe a': 57,
    'consrcio combo master classe a': 57,
    'produto de exemplo 1': 58
}

product_cat_map = {}
with open('final_import_1_29.csv', 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for row in reader:
        name = row['name'].strip()
        cid = row.get('category_id', '').strip()
        name_key = name.lower()
        if not cid:
            # check fallback
            for fb_key, fb_id in UNMAPPED_FALLBACK.items():
                if fb_key in name_key:
                    cid = str(fb_id)
                    break
        if cid:
            product_cat_map[name_key] = int(cid)

print(f"\n2. Mapeados {len(product_cat_map)} produtos com category_id.")

# 3. Buscar produtos no Supabase
get_url = f"{SUPABASE_URL}/rest/v1/products?select=id,name&organization_id=eq.{ORGANIZATION_ID}&limit=1000"
get_req = urllib.request.Request(get_url, headers=headers)
with urllib.request.urlopen(get_req) as resp:
    db_products = json.loads(resp.read().decode('utf-8'))

print(f"3. Atualizando {len(db_products)} produtos no banco de dados...")
updated = 0
not_found = 0

for p in db_products:
    p_id = p['id']
    p_name = p['name'].strip().lower()
    cat_id = product_cat_map.get(p_name)
    if not cat_id:
        # Tentar correspondência parcial
        for k, cid in product_cat_map.items():
            if k in p_name or p_name in k:
                cat_id = cid
                break

    if cat_id:
        update_data = json.dumps({'category_id': cat_id}).encode('utf-8')
        patch_req = urllib.request.Request(
            f"{SUPABASE_URL}/rest/v1/products?id=eq.{p_id}",
            data=update_data,
            headers={**headers, 'Prefer': 'return=minimal'},
            method='PATCH'
        )
        try:
            with urllib.request.urlopen(patch_req) as patch_resp:
                updated += 1
        except Exception as e:
            err = e.read().decode('utf-8') if hasattr(e, 'read') else str(e)
            print(f"  Erro ao atualizar produto {p['name']}:", err)
    else:
        not_found += 1
        print(f"  Sem categoria para: {p['name']}")

print(f"\nSucesso! {updated} produtos atualizados com category_id! (Não encontrados: {not_found})")

# 4. Gerar também o arquivo SQL equivalente
sql_file = r'c:\Users\eu\Downloads\popular_categorias_e_vincular_produtos.sql'
with open(sql_file, 'w', encoding='utf-8') as f:
    f.write("-- ============================================================================\n")
    f.write("-- SCRIPT PARA POPULAR CATEGORIAS E VINCULAR PRODUTOS (CLASSE A)\n")
    f.write("-- ============================================================================\n\n")
    f.write("BEGIN;\n\n")
    f.write("-- 1. Inserir Categorias e Subcategorias\n")
    
    for c in sorted_categories:
        parent_val = str(c['parent_id']) if c['parent_id'] is not None else "NULL"
        cat_name_escaped = c['name'].replace("'", "''")
        f.write(f"INSERT INTO public.product_categories (id, name, parent_id, organization_id) ")
        f.write(f"OVERRIDING SYSTEM VALUE VALUES ({c['id']}, '{cat_name_escaped}', {parent_val}, '{ORGANIZATION_ID}') ")
        f.write(f"ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id, organization_id = EXCLUDED.organization_id;\n")
    
    f.write("\n-- Ajustar o sequenciador de categorias\n")
    f.write("SELECT setval('public.product_categories_id_seq', (SELECT COALESCE(MAX(id), 1) FROM public.product_categories));\n\n")
    
    f.write("-- 2. Vincular Produtos as Categorias\n")
    for p in db_products:
        p_name = p['name'].strip()
        p_name_lower = p_name.lower()
        cat_id = product_cat_map.get(p_name_lower)
        if not cat_id:
            for k, cid in product_cat_map.items():
                if k in p_name_lower or p_name_lower in k:
                    cat_id = cid
                    break
        if cat_id:
            name_escaped = p_name.replace("'", "''")
            f.write(f"UPDATE public.products SET category_id = {cat_id} WHERE organization_id = '{ORGANIZATION_ID}' AND name = '{name_escaped}';\n")
            
    f.write("\nCOMMIT;\n")

print(f"Arquivo SQL gerado com sucesso em: {sql_file}")
