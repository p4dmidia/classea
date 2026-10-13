import json

for enc in ['utf-8', 'utf-16le', 'utf-16', 'latin-1']:
    try:
        with open('actual_schema.json', 'r', encoding=enc) as f:
            data = json.load(f)
            break
    except Exception:
        pass

defs = data.get('definitions', {})

for tname in sorted(defs.keys()):
    props = defs[tname].get('properties', {})
    print(f"\n--- {tname} ({len(props)} cols) ---")
    for col, detail in props.items():
        ctype = detail.get('type', '')
        cformat = detail.get('format', '')
        cdesc = detail.get('description', '')
        print(f"  {col}: type={ctype}, format={cformat}")
