#!/usr/bin/python3
import os
import sys
import logging
from json import loads as decode_json, JSONDecodeError


logger = logging.getLogger(__name__)

SYS_OUTPUT = sys.stdout
LOG_LEVEL = logging.INFO
if __name__ == '__main__':
  SYS_OUTPUT = sys.stderr #  the easiest to log something with apache.
else:
  os.environ["QUERY_STRING"] = "tasks"
  os.environ["REQUEST_METHOD"] = "POST"
  logger.debug("Running in dev mode.")

logging.basicConfig(level=LOG_LEVEL)

print("Content-type: text/html\n")
logger.debug(os.getenv("QUERY_STRING", "???"))
logger.debug(os.getenv("SERVER_SOFTWARE", "???"))
logger.debug(os.getenv("REQUEST_METHOD", "???"))
response = ""


def get_updates_from_client():
  """
  Read the client HTTP request by calling `input`

  Return: list of dictionaries containing ranges and strings to replace
  """
  updates = {}
  client_request_body = ""
  try:
    while True: #  read message from client until EOF
      client_request_body = client_request_body + input() + "\n"
  except EOFError:
    pass

  logger.debug(f"client request: >{client_request_body}<")

  # client_request_body = r'{"range":{"startLineNumber":6,"startColumn":2,"endLineNumber":6,"endColumn":2},"text":"\nsdf\nsdf\nsdf\nsdfs\ndf\n\n"}'
  try: 
    updates = decode_json(client_request_body)
  except JSONDecodeError as jde:
    mssge = "Update not in JSON format."
    logger.error(mssge)
    print(mssge) # respond to the user with this message
    raise jde

  logger.debug(updates)

  return updates


def read_file_as_oneline_string(task_filename):
  curr_content = ""
  with open(f"../tasks/{task_filename}.tks", "r") as file:
    curr_content = file.read()
    logger.info(f"curr_content_size: {len(curr_content)}")

  return curr_content


def _get_insertion_points(update, oneline_string_content):
  """
  The editor guarrantees that 
    start_line_num <= end_line_num
    start_col <= end_col
  even you have selected the text from top to bottom
  """
  start_row = update.get('range').get('startLineNumber')
  start_col = update.get('range').get('startColumn')
  end_row = update.get('range').get('endLineNumber')
  end_col = update.get('range').get('endColumn')

  # insert update
  row_num = 1
  col_num = 1
  i = 0
  ini = -1
  end = -1
  resolve_ini = True
  both_resolved = False

  for c in oneline_string_content:
    logger.debug("------------------------------------------------")
    logger.debug(f"{i} {ini} {end}")
    logger.debug(f"> {resolve_ini} {row_num} | {col_num} | '{c}' ")
    logger.debug(f"s {resolve_ini} {start_row} | {start_col} ")
    logger.debug(f"e {resolve_ini} {end_row} | {end_col} ")
    if resolve_ini and (row_num == start_row) and (col_num == start_col):
      ini = i
      resolve_ini = False
      if start_row == end_row and start_col == end_col: # no selection
        end = ini
        both_resolved = True
    elif not resolve_ini and (row_num == end_row) and (col_num == end_col):
      end = i
      both_resolved = True
    
    if c == '\n':
      row_num += 1
      col_num = 1
    else:
      col_num += 1
    i += 1

    if both_resolved:
      break

  if end_col == col_num: # end_col == max_col + 1
    logger.debug("Update location is after the last character.")
    if not resolve_ini:
      end = i
    else:
      ini = end = i
  elif end_row == row_num + 1:
    logger.debug("Update location is a newline after the last character")
    ini = end = i 
    # we need to add the new line character introduced there
    update["text"] = '\n' + update.get('text') 

  logger.debug(f"i e: {ini} {end}")

  if end < 0 or ini < 0: 
    mssge = "The range provided in the update action does not match the current text!"
    raise Exception(mssge)
  logger.debug(f"sr sc er ec: {start_row} {start_col} {end_row} {end_col}")

  return ini, end


def apply_one_update(update, curr_content):
  """
  Applies one update by first obtaining the substring interval in the one liner content
  and the filling the text update there.

  Return: the updated content.
  """
  ini, end = _get_insertion_points(update, curr_content)
  new_text = update.get('text')

  return curr_content[:ini] + new_text + curr_content[end:]


def write_file(content, task_filename):
  logger.info(f"writting updated file... new content size {len(content)}")
  with open(f"../tasks/{task_filename}.tks", "w") as file:
    file.write(content)

def apply_updates():
  task_filename = os.getenv("QUERY_STRING", "???")
  content = read_file_as_oneline_string(task_filename)
  for update in get_updates_from_client():
    content = apply_one_update(update, content)
    logger.debug(f"content:\n{content}")
  write_file(content, task_filename)
  print("saved.")

if __name__ == '__main__':
  try:
    apply_updates()
  except Exception as e:
    logger.error(e)
    print(e)