import urllib.request
import json

env = {}
with open('.env.local', 'r', encoding='utf-8') as f:
    for line in f:
        line = line.strip()
        if '=' in line and not line.startswith('#'):
            k, v = line.split('=', 1)
            env[k.strip()] = v.strip()

url = env.get('VITE_SUPABASE_URL')
key = env.get('SUPABASE_SERVICE_ROLE_KEY') or env.get('VITE_SUPABASE_ANON_KEY')

names = ['BOLSAS BAÚ', 'SAPATÊNIS CLASSE A 1208', 'SAPATÊNIS CLASSE A 1449']

for n in names:
    encoded = urllib.parse.quote(n)
    req = urllib.request.Request(
        f"{url}/rest/v1/products?name=eq.{encoded}&select=id,name,image_url,category_id,stock_quantity,price",
        headers={
            'apikey': key,
            'Authorization': f'Bearer {key}'
        }
    )
    with urllib.request.urlopen(req) as resp:
        d = json.loads(resp.read().decode('utf-8'))
        print(f"Product '{n}' in DB: {d}")
