#!/usr/bin/python3
import os
import sys
print("Content-type: text/html\n")
print(os.getenv("QUERY_STRING", "???"))
print(os.getenv("SERVER_SOFTWARE", "???"))
print(os.getenv("REQUEST_METHOD", "???"))
content = ''
try:
  while True:
    content = content + input() + "\n"
except EOFError:
  print("EOF")
with open("../tasks/main.tks", "w") as file:
    file.write(content)
