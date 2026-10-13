import csv

with open(r'C:\Users\eu\Downloads\produtos_prontos.csv', 'r', encoding='utf-8') as f:
    rows = list(csv.DictReader(f))

target_names = ['BOLSAS BAÚ', 'SAPATÊNIS CLASSE A 1208', 'SAPATÊNIS CLASSE A 1449', 'SAPATÊNIS CLASSE A 1454']

for r in rows:
    for t in target_names:
        if t in r['name']:
            print(f"{r['name']} -> URL: '{r['image_url']}'")
