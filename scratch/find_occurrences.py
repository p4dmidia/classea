import os, re
for root, dirs, files in os.walk('.'):
    if any(x in root for x in ['node_modules', '.git', 'dist', 'scratch']): continue
    for f in files:
        if f.endswith(('.ts', '.tsx')):
            p = os.path.join(root, f)
            with open(p, 'r', encoding='utf-8', errors='ignore') as fl:
                c = fl.read()
                for b in ['avatars', 'payment-proofs', 'product-images', 'marketing-materials']:
                    if b in c:
                        print(f"Found {b} in {os.path.relpath(p)}")
