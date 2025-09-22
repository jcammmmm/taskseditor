#!/usr/bin/python3
import os
print("Content-type: text/html\n")
print(os.getenv("QUERY_STRING", "???"))
print(os.getenv("SERVER_SOFTWARE", "???"))
print(os.getenv("REQUEST_METHOD", "???"))
x = input()
with open("demo.tks", "w") as file:
    file.write(x)
print(x, x)

