import urllib.request
import json

# Read env
env = {}
with open('.env.local', 'r', encoding='utf-8') as f:
    for line in f:
        line = line.strip()
        if '=' in line and not line.startswith('#'):
            k, v = line.split('=', 1)
            env[k.strip()] = v.strip()

url = env.get('VITE_SUPABASE_URL')
key = env.get('SUPABASE_SERVICE_ROLE_KEY') or env.get('VITE_SUPABASE_ANON_KEY')

print(f"URL: {url}")

req = urllib.request.Request(
    f"{url}/rest/v1/products?select=id,name,image_url,category_id,stock_quantity,price&limit=10",
    headers={
        'apikey': key,
        'Authorization': f'Bearer {key}'
    }
)

try:
    with urllib.request.urlopen(req) as resp:
        data = json.loads(resp.read().decode('utf-8'))
        print(f"Total products returned in sample: {len(data)}")
        for p in data:
            print(f"Name: {p.get('name')} | Image: '{p.get('image_url')}' | Cat: {p.get('category_id')} | Stock: {p.get('stock_quantity')}")
except Exception as e:
    print("Error querying database:", e)
