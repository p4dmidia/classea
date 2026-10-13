import os, re
for root, dirs, files in os.walk('.'):
    if any(x in root for x in ['node_modules', '.git', 'dist', 'scratch']): continue
    for f in files:
        if f.endswith(('.ts', '.tsx')):
            p = os.path.join(root, f)
            with open(p, 'r', encoding='utf-8', errors='ignore') as fl:
                c = fl.read()
                matches = re.findall(r"\.select\((['\"][^'\"]*['\"])\)", c)
                for m in matches:
                    if '!' in m or '(' in m:
                        print(f"{f}: {m}")
