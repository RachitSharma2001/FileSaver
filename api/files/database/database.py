############################ Module for interacting with database ############################
from .SetUp import create_connection
import uuid
import numpy as np
from .security.security import check_password

# Function to generate a unique primary key
def generate_unique_id():
    return uuid.uuid4().int >> 97

def reshape_one_dim(np_arr, n):
    return np_arr.reshape(n)

def get_files_from_dir(dir_path, dir_id):
    conn = create_connection()
    cur = conn.cursor()

    # If the dir id is non existent, indicate with return 
    if dir_id == -1:
        return -1
    cmd_get_files = "SELECT name FROM file WHERE dir_id={}".format(dir_id)
    cur.execute(cmd_get_files)
    files_list = np.array(cur.fetchall())
    return reshape_one_dim(files_list, len(files_list))

def get_subdirs_from_dir(dir_path, user_id, dir_id):
    conn = create_connection()
    cur = conn.cursor()

    # If the dir id is non existent, indicate with return 
    if dir_id == -1: 
        return -1
    cmd_get_subdirs = "SELECT name FROM dir WHERE parent_id={} AND user_id={}".format(dir_id, user_id)
    cur.execute(cmd_get_subdirs)
    dir_list = np.array(cur.fetchall())
    return reshape_one_dim(dir_list, len(dir_list))

def create_new_dir(parent_id, dir_name, dir_path, user_id):
    conn = create_connection()
    cur = conn.cursor()

    dir_id = generate_unique_id()
    cmd_make_dir = "prepare myplan as ""INSERT INTO dir VALUES ($1, $2, $3, $4, $5)"""
    cur.execute(cmd_make_dir)
    conn.commit()

    cur.execute("execute myplan (%s, %s, %s, %s, %s)", (dir_id, parent_id, user_id, dir_name, dir_path))
    conn.commit()
    return dir_id

def get_dirid_from_parent(given_path, user_id):
    conn = create_connection()
    cur = conn.cursor()

    cmd_get_dirid = "SELECT id FROM dir WHERE path='{}' AND user_id={}".format(given_path, user_id)
    cur.execute(cmd_get_dirid)
    memory_obj = cur.fetchall()
    # Check if dir exists with this path
    if len(memory_obj) == 0:
        return -1
    return memory_obj[0][0]

'''
    file_name - string
    Returns: the binary of the specified file
'''
def get_file(file_name):
    conn = create_connection()
    cur = conn.cursor()

    # Command to get the binary data column from row in file table
    cmd_get_file = "SELECT data FROM file WHERE name = '{}';".format(file_name)
    cur.execute(cmd_get_file)
    memory_obj = cur.fetchall()

    # return the binary of the first data found
    return bytes(memory_obj[0][0])

'''
    binary_data - string of binary data of file
    file_name - string
    
    Function inserts a new entry into the file table with the given binary_data and file_name arguments
'''
def insert_new_file(binary_data, file_name, parent_dir, user_id):
    conn = create_connection()
    cur = conn.cursor()
    
    cmd_insert_file = "prepare myplan as ""INSERT INTO file VALUES ($1, $2, $3, $4)"""
    cur.execute(cmd_insert_file)
    conn.commit()

    parent_id = get_dirid_from_parent(parent_dir, user_id)
    if parent_id == -1:
        return False
    cur.execute("execute myplan (%s, %s, %s, %s)", (generate_unique_id(), binary_data, file_name, parent_id))
    conn.commit()
    return True

def create_user(email, password):
    conn = create_connection()
    cur = conn.cursor()
    cmd_add_user = "prepare myplan as ""INSERT INTO enduser VALUES ($1, $2, $3)"""
    cur.execute(cmd_add_user)
    conn.commit()
    user_id = generate_unique_id()
    cur.execute('execute myplan (%s, %s, %s)', (user_id, password, email))
    conn.commit()
    return user_id

def check_user_exists(email, password):
    cur = create_connection().cursor()
    cmd_check_user = "SELECT password, id FROM enduser WHERE email='{}'".format(email)
    cur.execute(cmd_check_user)
    fetched_res = cur.fetchall()
    user_exists = (len(fetched_res) == 1)
    user_pass_exists = user_exists and check_password(password, fetched_res[0][0])
    return user_pass_exists, user_exists, (fetched_res[0][1] if user_exists else -1)
