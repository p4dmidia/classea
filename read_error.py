import os

with open("c:\\Users\\eu\\Documents\\P4D\\Projetos\\Classe A\\build_error.txt", "rb") as f:
    content = f.read().decode("utf-16-le")
    print(content[:2000]) # Print first 2000 characters
