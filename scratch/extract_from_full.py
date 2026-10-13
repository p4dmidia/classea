import json

path = r"C:\Users\eu\.gemini\antigravity-ide\brain\b46bd5b1-68d8-4b04-bafc-9ab845580610\.system_generated\logs\transcript_full.jsonl"
with open(path, "r", encoding="utf-8") as f:
    for line in f:
        obj = json.loads(line)
        if obj.get("type") == "USER_INPUT":
            content = obj.get("content", "")
            if "Preview data to be imported" in content:
                print("Found in full transcript! Length:", len(content))
                idx = content.find("Nome,")
                if idx != -1:
                    csv_text = content[idx:]
                    with open("produtos_import_user.csv", "w", encoding="utf-8") as out:
                        out.write(csv_text)
                    print(f"Saved produtos_import_user.csv! Length: {len(csv_text)}")
