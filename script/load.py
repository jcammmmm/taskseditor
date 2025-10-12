#!/usr/bin/python3
import os
import sys
from datetime import datetime

file = sys.stdout
if os.getenv("APP_MODE", "dev") == "dev":
  file = sys.stderr

print("Content-type: text/html\n")

filename = os.getenv("QUERY_STRING", "???")
with open(f"../tasks/{filename}.tks", "r") as file:
  content = file.read()
  print(content)