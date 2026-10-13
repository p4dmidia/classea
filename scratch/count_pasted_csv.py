import json

path = r"C:\Users\eu\.gemini\antigravity-ide\brain\b46bd5b1-68d8-4b04-bafc-9ab845580610\.system_generated\logs\transcript_full.jsonl"
with open(path, "r", encoding="utf-8") as f:
    for line in f:
        obj = json.loads(line)
        if obj.get("type") == "USER_INPUT":
            content = obj.get("content", "")
            if "Preview data to be imported" in content:
                lines = content.splitlines()
                print(f"Total lines in user message: {len(lines)}")
                # find CSV lines
                csv_lines = [l for l in lines if l.startswith('"') or l.startswith('Nome,') or l.startswith('﻿Nome,')]
                print(f"Total CSV rows pasted: {len(csv_lines)}")
