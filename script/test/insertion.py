def read_test_case(id):
  testcase = {
    "input": "",
    "output": "",
    "updates": "",
  }
  with open(f"test/insertion{fs}.test", "r") as testfile:
    key = "input"
    for line in testfile:
      if line == "#input\n":
        key = "input"
      elif line == "#output\n":
        key = "output"
      elif line == "#updates\n":
        key = "updates"
      else:
        testcase[key] += line
  
  # the last new line character from input and output must be removed, since
  # is a blank character needed for our input test format
  testcase['input'] = testcase['input'][:-1]
  testcase['output'] = testcase['output'][:-1]
  return testcase

def test(testcase):
  from script.save import apply_updates
  from json import loads as decode_json
  output = apply_updates(testcase['input'], decode_json(testcase['updates']))
  try:
    assert output == testcase['output']
    print("TEST PASSED!")
  except AssertionError as ae:
    print("TEST FAILED!")
    print(f"expected: \n{testcase['output']}")
    print(f"current: \n{output}")
    raise ae



if __name__ == '__main__':
  """
  Each 'test' file has the following structure
    #input
    sampletext sampletext
    sampletext sampletext
    sampletext
    #output
    stxt
    #updates
    [
      ...
    ]
  """

  filename_suffix = ['00', '01', '02', '03', '04', '05', '06', '07']
  # filename_suffix = ['01'] #, '05', '06', '07']

  for fs in filename_suffix:
    print(f"Running test {fs} .. .")
    test(read_test_case(fs))
