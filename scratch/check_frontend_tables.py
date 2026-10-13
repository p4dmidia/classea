import os
import re

tables = set()
for root, dirs, files in os.walk('.'):
    if any(x in root for x in ['node_modules', '.git', 'dist', 'scratch']):
        continue
    for f in files:
        if f.endswith(('.ts', '.tsx')):
            p = os.path.join(root, f)
            with open(p, 'r', encoding='utf-8', errors='ignore') as fl:
                for m in re.findall(r"\.from\(['\"]([a-zA-Z0-9_-]+)['\"]\)", fl.read()):
                    tables.add(m)

print("Tables referenced in code:")
for t in sorted(tables):
    print(" -", t)
