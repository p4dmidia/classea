import json

for enc in ['utf-8', 'utf-16le', 'utf-16', 'latin-1']:
    try:
        with open('actual_schema.json', 'r', encoding=enc) as f:
            data = json.load(f)
            break
    except Exception:
        pass

# Check parameters or definitions for constraints or unique keys
print("Checking schema info:")
defs = data.get('definitions', {})
for t in ['user_settings', 'affiliates', 'user_profiles', 'orders']:
    if t in defs:
        print(f"=== {t} ===")
        print("Required:", defs[t].get('required', []))
        props = defs[t].get('properties', {})
        for p, d in props.items():
            desc = d.get('description', '')
            if 'unique' in desc.lower() or 'primary' in desc.lower():
                print(f"  {p}: {desc}")
