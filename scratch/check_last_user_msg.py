import json

path = r"C:\Users\eu\.gemini\antigravity-ide\brain\b46bd5b1-68d8-4b04-bafc-9ab845580610\.system_generated\logs\transcript_full.jsonl"
with open(path, "r", encoding="utf-8") as f:
    lines = f.readlines()

print(f"Total entries in transcript: {len(lines)}")
last_user = None
for l in lines:
    obj = json.loads(l)
    if obj.get("type") == "USER_INPUT":
        last_user = obj

if last_user:
    txt = last_user.get("content", "")
    print(f"Last user input length: {len(txt)}")
    print("Beginning of text:")
    print(txt[:300])
    print("End of text:")
    print(txt[-300:])
    with open("user_pasted_data.txt", "w", encoding="utf-8") as out:
        out.write(txt)
