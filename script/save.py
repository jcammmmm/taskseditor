#!/usr/bin/python3
import os
import sys

file = sys.stdout
if os.getenv("APP_MODE", "dev") == "dev":
  file = sys.stderr

print("Content-type: text/html\n")
print(os.getenv("QUERY_STRING", "???"), file=file)
print(os.getenv("SERVER_SOFTWARE", "???"), file=file)
print(os.getenv("REQUEST_METHOD", "???"), file=file)

content = ''
try:
  while True:
    content = content + input() + "\n"
except EOFError:
  print("EOF")
with open("../tasks/main.tks", "w") as file:
    file.write(content)
