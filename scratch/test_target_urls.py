import urllib.request

urls = [
    'https://classeafaria.com.br/wp-content/uploads/sites/7538/2025/09/B-1208.jpg.jpg',
    'https://classeafaria.com.br/wp-content/uploads/sites/7538/2025/09/C-1449.jpg.jpg',
    'https://classeafaria.com.br/wp-content/uploads/sites/7538/2025/09/C-1454.jpg.jpg',
    'https://classeafaria.com.br/wp-content/uploads/sites/7538/2025/09/BOLSA-BAU-01.jpg'
]

for u in urls:
    try:
        req = urllib.request.Request(u, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=8) as resp:
            print(f"{u} -> Status: {resp.status}")
    except Exception as e:
        print(f"{u} -> ERROR: {e}")
