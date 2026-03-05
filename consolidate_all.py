import csv
import os

# Mapping definitions based on screenshots
CAT_MAP = {
    'COLCHÕES': 1,
    'ACESSÓRIOS': 2,
    'CONFORTO': 3,
    'CAMAS': 4,
    'ENXOVAL': 5,
    'CONSÓRCIO': 6,
    'CAMA': 9,
    'VESTUÁRIO MASCULINO': 11,
    'CALÇADO MASCULINO': 12,
    'CALÇADOS MASCULINO': 12, # Handle variations
    'FEMININO': 13,
    'PROMOÇÕES': 15
}

SUB_MAP = {
    'BASE BOX': 6,
    'TRAVESSEIROS': 7,
    'CABECEIRAS': 8,
    'COLCHÕES ESTÁTICOS': 9,
    'COLCHÕES TERAPÊUTICOS': 10,
    'CARTEIRAS': 11,
    'CINTOS': 12,
    'PULSEIRAS': 13,
    'BERMUDAS': 14,
    'CAMISETAS': 15,
    'CALÇAS': 16,
    'CAMISA POLO': 17,
    'CAMISA SOCIAL MANGA CURTA': 18,
    'CAMISA SOCIAL MANGA LONGA': 19,
    'TERNOS & BLAZERS': 20,
    'SAPATÊNIS': 21,
    'TÊNIS': 22,
    'SAPATO SOCIAL': 23,
    'CHINELOS': 24,
    'ACESSÓRIOS FEMININOS': 25,
    'CALÇADOS': 26, 
    'VESTUÁRIO FEMININO': 27
}

downloads_dir = r'c:\Users\eu\Downloads'
# Exact filenames from list_dir
files = [
    "pagina2 - classe a.csv",
    "pagina 3 - classe a.csv",
    "pagina 4 -classe a.csv",
    "página 5 classe a.csv",
    "página 6 - classe A.csv",
    "página 7 - classe A.csv",
    "página 8 - classe A.csv",
    "página 9 - classe A.csv",
    "página 10- classeA.csv",
    "pagina 11 - classe a.csv",
    "página 12.csv",
    "página 13.csv",
    "pagina 14.csv",
    "pagina 15.csv"
]

products = {}

for filename in files:
    filepath = os.path.join(downloads_dir, filename)
    if not os.path.exists(filepath):
        print(f"File not found: {filename}")
        continue
    
    print(f"Processing {filename}...")
    
    # Try different encodings
    success = False
    for enc in ['utf-8-sig', 'latin-1', 'cp1252']:
        try:
            with open(filepath, mode='r', encoding=enc) as f:
                first_line = f.readline()
                if not first_line: continue
                delimiter = ';' if ';' in first_line else ','
                f.seek(0)
                
                reader = csv.DictReader(f, delimiter=delimiter)
                count = 0
                for row in reader:
                    name = row.get('Nome')
                    if not name: 
                        # Try case insensitive
                        name = row.get('nome') or row.get('NOME')
                    
                    if not name: continue
                    name = name.strip()
                    
                    if name not in products:
                        products[name] = {
                            'name': name,
                            'stock_quantity': row.get('Estoque') or '0',
                            'weight': row.get('Peso (kg)') or '0.5',
                            'length': row.get('Comprimento (cm)') or '16',
                            'width': '11',
                            'height': row.get('Altura (cm)') or '2',
                            'price': row.get('Preço') or '0',
                            'categories': row.get('Categorias') or '',
                            'image_url': row.get('Imagens') or '',
                            'origin_zip': '82820-160'
                        }
                    else:
                        # Merge logic
                        if row.get('Preço'): products[name]['price'] = row['Preço']
                        if row.get('Estoque'): products[name]['stock_quantity'] = row['Estoque']
                        if row.get('Peso (kg)'): products[name]['weight'] = row['Peso (kg)']
                        if row.get('Comprimento (cm)'): products[name]['length'] = row['Comprimento (cm)']
                        if row.get('Altura (cm)'): products[name]['height'] = row['Altura (cm)']
                        if row.get('Categorias'): products[name]['categories'] = row['Categorias']
                        if row.get('Imagens'): products[name]['image_url'] = row['Imagens']
                    count += 1
                print(f"  Read {count} rows from {filename}")
            success = True
            break
        except Exception as e:
            print(f"  Error with {enc} on {filename}: {e}")
            continue

# Clean and Map
final_list = []
for p in products.values():
    # Clean price
    p_str = str(p['price']).replace('R$', '').replace('\xa0', '').replace(' ', '').strip()
    clean_price = p_str.replace('.', '').replace(',', '.') if p_str else '0'
    try:
        float(clean_price)
    except:
        clean_price = '0'
        
    # Map Category/Subcategory
    cat_id = ''
    sub_id = ''
    
    cat_str = p['categories'].upper()
    
    for cat_name, cid in CAT_MAP.items():
        # Use regex-like search to avoid partial word matches if needed, but here simple in is okay
        if cat_name in cat_str:
            cat_id = cid
            break
            
    for sub_name, sid in SUB_MAP.items():
        if sub_name in cat_str:
            sub_id = sid
            break
            
    final_list.append({
        'name': p['name'],
        'description': 'Produtos Classe A',
        'price': clean_price,
        'stock_quantity': p['stock_quantity'] or '0',
        'image_url': p['image_url'],
        'weight': p['weight'] or '0.5',
        'length': p['length'] or '16',
        'width': '11',
        'height': p['height'] or '2',
        'origin_zip': '82820-160',
        'category_id': cat_id,
        'subcategory_id': sub_id
    })

output_file = r'c:\Users\eu\Documents\P4D\Projetos\Classe A\final_import_full.csv'
with open(output_file, mode='w', encoding='utf-8', newline='') as f:
    fieldnames = ['name', 'description', 'price', 'stock_quantity', 'image_url', 'weight', 'length', 'width', 'height', 'origin_zip', 'category_id', 'subcategory_id']
    writer = csv.DictWriter(f, fieldnames=fieldnames)
    writer.writeheader()
    writer.writerows(final_list)

print(f"Total unique products consolidated: {len(final_list)}")
print(f"File saved to: {output_file}")
