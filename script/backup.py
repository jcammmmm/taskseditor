#!/usr/bin/python3
import os
import sys
from datetime import datetime

file = sys.stdout
if os.getenv("APP_MODE", "dev") == "dev":
  file = sys.stderr

print("Content-type: text/html\n")
print(os.getenv("QUERY_STRING", "???"), file=sys.stderr)
print(os.getenv("SERVER_SOFTWARE", "???"), file=file)
print(os.getenv("REQUEST_METHOD", "???"), file=file)

filenames = ["tasks", "food", "plans"]

for fn in filenames:
  print(f"backing up: ../tasks/{fn}.tks")
  content = ""
  with open(f"../tasks/{fn}.tks", "r") as file:
    content = file.read()
  time = datetime.now().strftime("%y%m%d.%H%M%S")
  with open(f"../tasks/{fn}-{time}.tks", "w") as file:
    file.write(content)