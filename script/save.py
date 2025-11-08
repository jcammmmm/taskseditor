#!/usr/bin/python3
import os
import sys

file = sys.stdout
if os.getenv("APP_MODE", "dev") == "dev":
  file = sys.stderr

print("Content-type: text/html\n")
print(os.getenv("QUERY_STRING", "???"), file=sys.stderr)
print(os.getenv("SERVER_SOFTWARE", "???"), file=file)
print(os.getenv("REQUEST_METHOD", "???"), file=file)

new_content = ''
filename = os.getenv("QUERY_STRING", "???")
try:
  while True:
    new_content = new_content + input() + "\n"
except EOFError:
  pass

# read previous contents to get size
with open(f"../tasks/{filename}.tks", "r") as file:
  curr_content = file.read()
  # print(f"curr_content: {curr_content}", file=sys.stderr)
  curr_content_size = len(curr_content)
  print(f"curr_content_size: {curr_content_size}", file=sys.stderr)
     
# write current content
with open(f"../tasks/{filename}.tks", "w") as file:
  new_content_size = len(new_content)
  print(f"new_content_size: {new_content_size}", file=sys.stderr)
  diff = new_content_size - curr_content_size 
  if (abs(diff) < 5):
    file.write(new_content)
  else:
    print(f"unable to save, difference is {diff} higher than 4 characters.")
