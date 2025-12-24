from script.save import _get_insertion_points

tests = [
"""123456789
12345678#
###456789
423456789""",

"""12#456789
123456789
123456789
123456789""",

"""12#######
123456789
123456789
123456789""",

"""123456789
12345678#
#########
123456789""",

"""123456789
12345678#
#########
#########""",

"""123456789
123456789
#########
123456789
""",

"""123456789
123456789#
#23456789
""",

"""123456789
123456789
#""",

"""123456789
#
#""",

"""123456##9""",

"""##""",

"""
#""",

"""
1234567890
########
#######
####
#
1234567890
1234567890
""",

"""#
#######
##
#####6


""",

"""#
#
#
#






"""
]

def test_gen(text):
  i = 0         # curr char 1d pos
  r = c = 1     # curr char 2d pos
  a = b = -1    # hash tags 1d pos
  r0 = c0 = -1  # 1st hash tag 2d pos
  r1 = c1 = -1  # 2nd hash tag 2d pos
  for t in text:
    if t == '#' and a == -1:
      a = i
      r0 = r
      c0 = c
    elif t == '#':
      b = i
      r1 = r
      c1 = c

    if t == '\n':
      r += 1
      c = 1
    else:
      c += 1

    i += 1
  
  if b < 0:
    b = a
    r1 = r0
    c1 = c0
  else: # the end is exclusive, one column after
    b += 1
    c1 += 1
                                                                                                                                              
  return (a, b), (r0, c0), (r1, c1)

def test_test_gen(): 
  """
  Monaco editor gives the selection one char after the end in two dimentional
  coordinates (row, col). In other words the selection interval on the righ 
  end is inclusive and exclusive for the left.
  Our insertion interval (a, b) is also inclusive for 'a' but exclusive for 'b'.
  """
  
  #                  1          2          3          4          5
  # idx   0123456789 0123456789 0123456789 0123456789 0123456789 0123456789
  # row   1          2          3          4          5          6 
  # col   123456789A 123456789A 123456789A 123456789A 123456789A 123456789A
  text = "123######\n#########\n#########\n#########\n#########\n##########"
  exp = ((3, 60), (1, 4), (6, 11)) 
  res = test_gen(text)
  print(exp)
  print(res)
  assert exp == res

  # idx   0123456789 0123456789 0123456789 0123456789 0123456789 0123456789
  # row   1          2          3          4          5          6 
  # col   123456789A 123456789A 123456789A 123456789A 123456789A 123456789A
  text = "123#56789\n123456789\n123456789\n123456789\n123456789\n123456789\n"
  exp = ((3, 3), (1, 4), (1, 4)) 
  res = test_gen(text)
  print(exp)
  print(res)
  assert exp == res

  # idx   0123456789 0123456789 0123456789 0123456789 0123456789 0123456789
  # row   1          2          3          4          5          6 
  # col   123456789A 123456789A 123456789A 123456789A 123456789A 123456789A    -1
  text = "123456789\n123#56789\n123456789\n123456789\n#23456789\n123456789\n"
  exp = ((13, 41), (2, 4), (5, 2)) 
  res = test_gen(text)
  print(exp)
  print(res)
  assert exp == res

  text = """1234
123#
####"""
  exp = ((8, 14), (2, 4), (3, 5)) 
  res = test_gen(text)
  print(exp)
  print(res) 
  assert exp == res
  
  text = """123456789
123456789
1234#####
##########
123456789"""
  exp = ((24, 40), (3, 5), (4, 11)) 
  res = test_gen(text)
  print(exp)
  print(res) 
  assert exp == res
  
  text = """123456789
123456789
123456789
12345678#
#########"""
  exp = ((38, 49), (4, 9), (5, 10)) 
  res = test_gen(text)
  print(exp)
  print(res) 
  assert exp == res
  
  text = """#########
#########
#########"""
  exp = ((0, 29), (1, 1), (3, 10)) 
  res = test_gen(text)
  print(exp)
  print(res) 
  assert exp == res

  text = """123456789
12345678#
###456789
423456789"""
  exp = ((18, 23), (2, 9), (3, 4))
  res = test_gen(text)
  print(exp)
  print(res)
  assert exp == res


def test_get_insertion_points(i, e, sl, sc, el, ec, txt):
  update = {
    "range": {
      "startLineNumber": sl,
      "startColumn": sc,
      "endLineNumber": el,
      "endColumn": ec},
    "text":"<><>"}
  it, et = _get_insertion_points(update, txt)
  assert it == i 
  assert et == e

if __name__ == '__main__':
  print("Testing the test generator")
  print(test_test_gen())

  print("Testing insertion points")
  for t in tests:
    inp = ((a, b), (r0, c0), (r1, c1)) = test_gen(t)
    print(inp)
    print(t)
    test_get_insertion_points(a, b, r0, c0, r1, c1, t)

