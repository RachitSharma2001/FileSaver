''' ----------------- Code that created file table --------------------- '''
import psycopg2
from SetUp import create_connection

'''
cmd_create_files_table = """CREATE TABLE File (
                                ID INT not Null,
                                Data BYTEA not Null    
                            )
                          """
conn = create_connection
print("Database connection created")

cur = conn.cursor()
cur.execute(cmd_create_files_table)
conn.commit()
print("Table created successfully")'''

conn = create_connection()
cur = conn.cursor()
cmd_create_dir_table = """ CREATE TABLE dir (
  id INT not NULL PRIMARY KEY,
  parent_id INT default NULL,
  user_id INT not NULL,
  name VARCHAR(200),
  path VARCHAR(500),
  FOREIGN KEY(parent_id) REFERENCES dir(id)
)"""
cur.execute(cmd_create_dir_table)
conn.commit()
