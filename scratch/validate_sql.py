import re

with open('init_database.sql', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Count tables
tables = re.findall(r'CREATE TABLE IF NOT EXISTS public\.(\w+)', content)
print(f"Total tables: {len(tables)}")

# 2. Count functions
funcs = re.findall(r'CREATE (?:OR REPLACE )?FUNCTION public\.(\w+)', content)
print(f"Total functions: {len(funcs)}")
for fn in funcs:
    print(f" - {fn}")

# 3. Count triggers
triggers = re.findall(r'CREATE TRIGGER (\w+)', content)
print(f"Total triggers: {len(triggers)}")
for tr in triggers:
    print(f" - {tr}")

# 4. Count policies
policies = re.findall(r'CREATE POLICY "([^"]+)"', content)
print(f"Total policies: {len(policies)}")

# 5. Check admin creation block
if 'admin@classea.com.br' in content and 'admin123' in content:
    print("Admin creation block found and verified!")

# 6. Check encoding issues (non-ascii characters)
corrupted = [m.start() for m in re.finditer(r'', content)]
print(f"Corrupted characters count: {len(corrupted)}")
