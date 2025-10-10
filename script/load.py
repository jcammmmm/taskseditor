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

filename = os.getenv("QUERY_STRING", "???")
with open(f"../tasks/{filename}.tks", "r") as file:
  content = file.read()
  print(content)