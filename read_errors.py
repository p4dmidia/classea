import os

with open("c:\\Users\\eu\\Documents\\P4D\\Projetos\\Classe A\\ts_errors.txt", "rb") as f:
    # Try decoding as utf-16-le
    content = f.read().decode("utf-16-le")
    print(content)
