#!/usr/bin/python3
import os
import sys
print("Content-type: text/html\n")
print(os.getenv("QUERY_STRING", "???"), file=sys.stderr)
print(os.getenv("SERVER_SOFTWARE", "???"), file=sys.stderr)
print(os.getenv("REQUEST_METHOD", "???"), file=sys.stderr)

content = ''
try:
  while True:
    content = content + input() + "\n"
except EOFError:
  print("EOF")
with open("../tasks/main.tks", "w") as file:
    file.write(content)
