# -*- coding: utf-8 -*-
"""
Script para ler o CSV de produtos e gerar um script SQL
com comandos INSERT compatíveis com o PostgreSQL do Supabase.
Lida com UTF-8 BOM (utf-8-sig) e mescla linhas pai/filho (descrição + preço).
"""

import csv
import sys

ORGANIZATION_ID = '5111af72-27a5-41fd-8ed9-8c51b78b4fdd'

def escape_sql(text):
    if not text:
        return 'NULL'
    clean = text.replace("'", "''")
    return f"'{clean}'"

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

def gerar_sql(input_csv, output_sql):
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

        sql_lines = [
            "-- SCRIPT DE IMPORTAÇÃO DE PRODUTOS CLASSE A",
            f"-- Organization ID: {ORGANIZATION_ID}\n",
            "BEGIN;\n"
        ]
        
        count = 0
        for name, p in merged.items():
            first_img = ''
            if p['image_url']:
                first_img = [img.strip() for img in p['image_url'].split(',') if img.strip()][0]

            stock = int(parse_num(p['stock_quantity'], 0))
            weight = parse_num(p['weight'], 0.5)
            length = int(parse_num(p['length'], 16))
            width = int(parse_num(p['width'], 11))
            height = int(parse_num(p['height'], 2))
            price = parse_price(p['price'])

            sql_lines.append(
                f"INSERT INTO public.products (name, description, stock_quantity, weight, length, width, height, price, image_url, organization_id, is_active, origin_zip) "
                f"VALUES ({escape_sql(name)}, {escape_sql(p['description'].strip())}, {stock}, {weight}, {length}, {width}, {height}, {price}, {escape_sql(first_img)}, '{ORGANIZATION_ID}'::uuid, true, '82820-160');"
            )
            count += 1

        sql_lines.append("\nCOMMIT;")

    with open(output_sql, 'w', encoding='utf-8') as f:
        f.write('\n'.join(sql_lines))

    print(f"Sucesso! {count} produtos convertidos para SQL em: {output_sql}")

if __name__ == '__main__':
    in_file = sys.argv[1] if len(sys.argv) > 1 else r'C:\Users\eu\Downloads\todos os produtos classe A.csv'
    out_file = sys.argv[2] if len(sys.argv) > 2 else r'C:\Users\eu\Downloads\importar_produtos.sql'
    gerar_sql(in_file, out_file)
