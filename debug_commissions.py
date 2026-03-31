import os
import json
import urllib.request
import sys

sys.stdout.reconfigure(encoding='utf-8')

SUPABASE_URL = "https://clnuievcdnbwqbyqhwys.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNsbnVpZXZjZG5id3FieXFod3lzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjExNDkzMCwiZXhwIjoyMDg3NjkwOTMwfQ.2c3qA3jew8xedEzEA_BvXKQgS2BqC1fN5Y0PKb1JKbk"

def fetch_orgs():
    url = f"{SUPABASE_URL}/rest/v1/organizations?select=*"
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json"
    }
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read().decode())

try:
    orgs = fetch_orgs()
    print("--- Organizations Schema Scan ---")
    for o in orgs:
        # Check for column existence and content
        cols = list(o.keys())
        has_direct = "mercadopago_access_token" in cols
        has_json = "mercadopago_config" in cols
        print(f"Org: {o['name']} | ID: {o['id']}")
        print(f"  Direct column exists: {has_direct}")
        print(f"  JSON column exists: {has_json}")
        if has_json and o["mercadopago_config"]:
            print(f"  JSON keys: {list(o['mercadopago_config'].keys())}")
except Exception as e:
    print(f"Error: {e}")
