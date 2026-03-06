import csv
import os

# Mapping definitions based on screenshots
CAT_MAP = {
    'CAMA': 49,
    'ACESSÓRIOS': 1,
    'VESTUÁRIO MASCULINO': 5,
    'CALÇADO MASCULINO': 19,
    'FEMININO': 24,
    'PROMOÇÕES': 15
}

# Mapping for the new 3-level hierarchy
# We use a tuple (CategoryID, SubcategoryID)
# If it matches a sub-sub, we assign the parent/child accordingly.
HIERARCHY_MAP = {
    # ACESSÓRIOS
    'CARTEIRAS': (1, 2),
    'CINTOS': (1, 3),
    'PULSEIRAS': (1, 4),
    
    # VESTUÁRIO MASCULINO
    'BERMUDAS': (5, 6),
    'CAMISETAS': (5, 7),
    'CALÇAS': (5, 8),
    'CAMISA POLO': (5, 9),
    'CAMISA SOCIAL MANGA CURTA': (5, 10),
    'CAMISA SOCIAL MANGA LONGA': (5, 11),
    'TERNOS & BLAZERS': (5, 12),
    'MICROFIBRA': (5, 13),
    'FIO INDIANO': (5, 14),
    'POLIVISCOSE': (5, 15),
    'BLAZERS': (5, 16),
    'MARESIAS': (5, 17),
    'SARJA': (5, 18),
    
    # CALÇADO MASCULINO
    'SAPATÊNIS': (19, 20),
    'TÊNIS': (19, 21),
    'SAPATO SOCIAL': (19, 22),
    'CHINELOS': (19, 23),
    
    # FEMININO
    'ACESSÓRIOS FEMININOS': (24, 25),
    'BOLSAS': (24, 26),
    'CARTEIRAS FEMININAS': (24, 27),
    'CINTOS FEMININOS': (24, 28),
    'CALÇADOS': (24, 29),
    'BOTAS': (24, 30),
    'CHINELOS FEMININOS': (24, 31),
    'MOCASSIM': (24, 32),
    'MULES': (24, 33),
    'PANTUFAS': (24, 34),
    'RASTEIRAS': (24, 35),
    'SAPATILHAS': (24, 36),
    'SANDÁLIAS': (24, 37),
    'SCARPIN': (24, 38),
    'TAMANCOS': (24, 39),
    'TÊNIS CASUAL': (24, 40),
    'TÊNIS ESPORTIVO': (24, 41),
    'VESTUÁRIO FEMININOS': (24, 42),
    'CAMISETAS FEMININAS': (24, 43),
    'BERMUDAS FEMININAS': (24, 44),
    'CALÇAS FEMININAS': (24, 45),
    'SAIAS': (24, 46),
    'VESTIDOS': (24, 47),
    'LINGERIE': (24, 48),
    
    # CAMA
    'BASE BOX': (49, 50),
    'TRAVESSEIROS': (49, 51),
    'CABECEIRAS': (49, 52),
    'COLCHÕES ESTÁTICOS': (49, 53),
    'COLCHÕES TERAPÊUTICOS': (49, 54),
}

# SUB_MAP is now integrated into HIERARCHY_MAP for deep mapping

downloads_dir = r'c:\Users\eu\Downloads'
# Exact filenames from list_dir handles variations
# PRIMARY SOURCE only to avoid duplication
files = [
    "todos os produtos classe A.csv"
]

import re
def normalize_name(name):
    if not name: return ""
    name = name.strip().upper()
    name = re.sub(r'\s+', ' ', name)
    return name

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
                    name_key = normalize_name(name)
                    
                    if name_key not in products:
                        products[name_key] = {
                            'name': name.strip(),
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
                        # Update with better data if available
                        if row.get('Preço'): products[name_key]['price'] = row['Preço']
                        if row.get('Estoque'): products[name_key]['stock_quantity'] = row['Estoque']
                        if row.get('Categorias'): products[name_key]['categories'] = row['Categorias']
                        if row.get('Imagens'): products[name_key]['image_url'] = row['Imagens']
                    count += 1
                print(f"  Read {count} rows from {filename}")
            success = True
            break
        except Exception as e:
            print(f"  Error with {enc} on {filename}: {e}")
            continue

# Clean and Map
final_list = []

def clean_to_float(val, default='0'):
    if not val: return default
    # Handle R$ and whitespace
    s = str(val).replace('R$', '').replace('\xa0', '').replace(' ', '').strip()
    # Handle Brazilian format (1.234,56 -> 1234.56)
    if ',' in s and '.' in s:
        s = s.replace('.', '').replace(',', '.')
    elif ',' in s:
        s = s.replace(',', '.')
    
    try:
        return str(float(s))
    except:
        return default

def clean_to_int(val, default='0'):
    if not val: return default
    # Extract first sequence of digits if it's a complex string like "1,38 x 1,88"
    s = str(val).replace('\xa0', '').replace(' ', '').strip()
    # Replace comma with dot first in case it's a float like "1,38"
    s = s.replace(',', '.')
    
    try:
        # Try direct float to int (e.g. "1.0" -> 1)
        return str(int(float(s.split(' ')[0].split('x')[0])))
    except:
        # Try to find any digit
        import re
        match = re.search(r'\d+', s)
        if match:
            return match.group()
        return default

for p in products.values():
    clean_price = clean_to_float(p['price'], '0')
    clean_weight = clean_to_float(p['weight'], '0.5')
    clean_stock = clean_to_int(p['stock_quantity'], '0')
    clean_length = clean_to_int(p['length'], '16')
    clean_width = clean_to_int(p['width'], '11')
    clean_height = clean_to_int(p['height'], '2')
        
    # Map Category/Subcategory using the new hierarchy
    final_cat_id = ''
    
    cat_str = p['categories'].upper()
    
    # Sort hierarchy by specificity (length of keyword)
    sorted_hierarchy = sorted(HIERARCHY_MAP.items(), key=lambda x: len(x[0]), reverse=True)
    
    match_found = False
    for keyword, (cid, sid) in sorted_hierarchy:
        if keyword in cat_str or keyword in p['name'].upper():
            # If it's a sub-sub level or sub level, we assign the specific ID
            # In our new schema, everything IS a category (recursive)
            # So we assign to the most specific child ID
            final_cat_id = sid
            match_found = True
            break
            
    if not match_found:
        # Fallback to main categories
        sorted_cats = sorted(CAT_MAP.items(), key=lambda x: len(x[0]), reverse=True)
        for cat_name, cid in sorted_cats:
            if cat_name in cat_str:
                final_cat_id = cid
                break
            
    final_list.append({
        'name': p['name'],
        'description': 'Produtos Classe A',
        'price': clean_price,
        'stock_quantity': clean_stock,
        'image_url': p['image_url'],
        'weight': clean_weight,
        'length': clean_length,
        'width': clean_width,
        'height': clean_height,
        'origin_zip': '82820-160',
        'category_id': final_cat_id
    })

output_file = r'c:\Users\eu\Documents\P4D\Projetos\Classe A\final_import_1_29.csv'
with open(output_file, mode='w', encoding='utf-8', newline='') as f:
    fieldnames = ['name', 'description', 'price', 'stock_quantity', 'image_url', 'weight', 'length', 'width', 'height', 'origin_zip', 'category_id']
    writer = csv.DictWriter(f, fieldnames=fieldnames)
    writer.writeheader()
    writer.writerows(final_list)

print(f"Total unique products consolidated: {len(final_list)}")
print(f"File saved to: {output_file}")
