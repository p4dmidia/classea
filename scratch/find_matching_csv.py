import os

for root, dirs, files in os.walk('.'):
    if 'node_modules' in root or '.git' in root or 'dist' in root or 'scratch' in root:
        continue
    for f in files:
        p = os.path.join(root, f)
        try:
            with open(p, 'rb') as fl:
                header = fl.read(100)
                if b'Nome' in header and b'curta' in header:
                    print(f"Found matching file: {p} ({os.path.getsize(p)} bytes)")
        except Exception:
            pass
