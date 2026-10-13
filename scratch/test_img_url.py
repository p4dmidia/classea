import csv
import urllib.request

with open(r'C:\Users\eu\Downloads\produtos_prontos.csv', 'r', encoding='utf-8') as f:
    rows = list(csv.DictReader(f))

# Check samples
for i, r in enumerate(rows[:10]):
    print(r['name'] + ' -> ' + r['image_url'])

sample_url = [r['image_url'] for r in rows if r['image_url']][0]
print('\nTesting sample URL:', sample_url)
try:
    req = urllib.request.Request(sample_url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req, timeout=8) as resp:
        print('HTTP Status:', resp.status)
except Exception as e:
    print('Failed to fetch:', e)
