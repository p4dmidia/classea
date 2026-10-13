# -*- coding: utf-8 -*-
"""
Script corrigido para converter o CSV do WooCommerce para o formato do Supabase.
Lida com UTF-8 BOM (utf-8-sig), mescla linhas pai/filho (descrição + preço)
e preenche a organização correta.
"""

import csv
import sys

ORGANIZATION_ID = '5111af72-27a5-41fd-8ed9-8c51b78b4fdd'

def parse_price(val):
    if not val or not val.strip():
        return 0.0
    val = val.strip().replace('R$', '').replace(' ', '')
    if ',' in val:
        val = val.replace('.', '').replace(',', '.')
    try:
        return float(val)
    except Exception:
        return 0.0

def parse_num(val, default=0):
    if not val or not val.strip():
        return default
    try:
        return float(val.strip().replace(',', '.'))
    except Exception:
        return default

def converter_csv(input_csv, output_csv):
    with open(input_csv, 'r', encoding='utf-8-sig', errors='ignore') as f:
        reader = csv.DictReader(f)
        
        merged = {}
        for r in reader:
            def get_val(*keys):
                for k in keys:
                    for rk in r.keys():
                        if rk and rk.strip().lower() == k.strip().lower():
                            return r[rk]
                return ''

            name = get_val('Nome', 'name')
            if not name or not name.strip():
                continue
            name = name.strip()

            desc = get_val('Descrição curta', 'Descrição', 'description')
            stock = get_val('Estoque', 'stock_quantity')
            weight = get_val('Peso (kg)', 'Peso', 'weight')
            length = get_val('Comprimento (cm)', 'length')
            width = get_val('Largura (cm)', 'width')
            height = get_val('Altura (cm)', 'height')
            price = get_val('Preço', 'price')
            images = get_val('Imagens', 'image_url')

            if name not in merged:
                merged[name] = {
                    'name': name,
                    'description': desc,
                    'stock_quantity': stock,
                    'weight': weight,
                    'length': length,
                    'width': width,
                    'height': height,
                    'price': price,
                    'image_url': images
                }
            else:
                curr = merged[name]
                if not curr['description'] and desc: curr['description'] = desc
                if not curr['price'] and price: curr['price'] = price
                if not curr['image_url'] and images: curr['image_url'] = images
                if not curr['stock_quantity'] and stock: curr['stock_quantity'] = stock
                if not curr['weight'] and weight: curr['weight'] = weight
                if not curr['length'] and length: curr['length'] = length
                if not curr['width'] and width: curr['width'] = width
                if not curr['height'] and height: curr['height'] = height

        fieldnames = [
            'name',
            'description',
            'price',
            'stock_quantity',
            'weight',
            'length',
            'width',
            'height',
            'image_url',
            'organization_id',
            'is_active',
            'origin_zip'
        ]

        rows_converted = []
        for name, p in merged.items():
            first_img = ''
            if p['image_url']:
                first_img = [img.strip() for img in p['image_url'].split(',') if img.strip()][0]

            rows_converted.append({
                'name': name,
                'description': p['description'].strip(),
                'price': parse_price(p['price']),
                'stock_quantity': int(parse_num(p['stock_quantity'], 0)),
                'weight': parse_num(p['weight'], 0.5),
                'length': int(parse_num(p['length'], 16)),
                'width': int(parse_num(p['width'], 11)),
                'height': int(parse_num(p['height'], 2)),
                'image_url': first_img,
                'organization_id': ORGANIZATION_ID,
                'is_active': 'true',
                'origin_zip': '82820-160'
            })

    with open(output_csv, 'w', encoding='utf-8', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows_converted)

    print(f"Sucesso! {len(rows_converted)} produtos convertidos e salvos em: {output_csv}")

if __name__ == '__main__':
    in_file = sys.argv[1] if len(sys.argv) > 1 else r'C:\Users\eu\Downloads\todos os produtos classe A.csv'
    out_file = sys.argv[2] if len(sys.argv) > 2 else r'C:\Users\eu\Downloads\produtos_prontos.csv'
    converter_csv(in_file, out_file)
