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
    col_ini <= col_end
  even you have selected the text from top to bottom.

  The 1d end is exclusive and the 2d end at column level is also exclusive.
  """
  row_ini = update.get('range').get('startLineNumber')
  col_ini = update.get('range').get('startColumn')
  row_end = update.get('range').get('endLineNumber')
  col_end = update.get('range').get('endColumn')

  # insert update
  row_num = 1 # pointer
  col_num = 1 # pointer
  i = 0       # pointer 
  ini = -1    # output
  end = -1    # output

  for c in oneline_string_content:
    logger.debug("------------------------------------------------")
    logger.debug(f"{i} {ini} {end}")
    logger.debug(f"> {ini > 0} {row_num} | {col_num} | '{c}' ")
    logger.debug(f"s {ini > 0} {row_ini} | {col_ini} ")
    logger.debug(f"e {ini > 0} {row_end} | {col_end} ")
    if ini < 0 and (row_num == row_ini) and (col_num == col_ini):
      ini = i
      if row_ini == row_end and col_ini == col_end: # no selection
        end = ini
    elif (not ini < 0) and (row_num == row_end) and (col_num == col_end):
      end = i
    
    if c == '\n':
      row_num += 1
      col_num = 1
    else:
      col_num += 1
    i += 1

    if ini > -1 and end > -1:
      break

  # Ending scenarios
  # ini > -1 | end > -1
  # ---------|----------
  # True     |  True      : Both ends where found in the loop
  # True     |  False     : End is missing
  # False    |  True      : Impossible, it is necessary to find 'ini' first before 'end'
  # False    |  False     : Not found yet, check one plus last position.
  row_beyond = row_end == row_num + 1
  col_beyond = col_end == col_num
  if ini > -1:
    if end < 0:
      if col_beyond or row_beyond:
        end = i
        if row_beyond:
          logger.debug("Update location is a newline after the last character")
          # we need to add the new line character introduced there
          # if len(update.get('text')) > 0:
          # update["text"] = '\n' + update.get('text') 
        if col_beyond:
          logger.debug("Update location is after the last character.")
  else:
    if col_beyond or row_beyond:
      ini = end = i
      if row_beyond:
        logger.debug("Update location is a newline after the last character")
        # we need to add the new line character introduced there
        # if len(update.get('text')) > 0:
        # update["text"] = '\n' + update.get('text') 
      if col_beyond:
        logger.debug("Update location is after the last character.")

    else:
      mssge = "The range provided in the update action does not match the current text!"
      raise Exception(mssge)

  
  # if row_end == row_num + 1: 
  #   if ini > -1:
  #     end = i
  #   else:
  #     ini = end = i
  #   # we need to add the new line character introduced there
  #   update["text"] = '\n' + update.get('text')
  # elif col_end == col_num: # col_end == max_col + 1
  #   if ini > -1:
  #     end = i
  #   else:
  #     ini = end = i
  
  # # if ini < 0 or end < 0:
    

  logger.debug(f"i e: {ini} {end}")

  
  logger.debug(f"sr sc er ec: {row_ini} {col_ini} {row_end} {col_end}")

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

def apply_updates(content, updates):
  for u in updates:
    content = apply_one_update(u, content)
    logger.debug(f"content:\n{content}")
  return content
  
if __name__ == '__main__':
  try:
    task_filename = os.getenv("QUERY_STRING", "???")
    content = read_file_as_oneline_string(task_filename)
    updates = get_updates_from_client()
    content = apply_updates(content, updates)
    write_file(content, task_filename)
    print("saved.")

  except Exception as e:
    logger.error(e)
    print(e)