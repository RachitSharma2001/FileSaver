######################## File to run if I want to alter the database ########################
from SetUp import create_connection

'''
conn = create_connection()
cur = conn.cursor()
cmd = "ALTER TABLE file ADD COLUMN type VARCHAR(50)"
cur.execute(cmd)
conn.commit()'''

'''
conn = create_connection()
cur = conn.cursor()
cmd_add = "ALTER TABLE file ADD COLUMN dir_id INT"
cmd_add_foreign = "ALTER TABLE file ADD CONSTRAINT dirfk FOREIGN KEY(dir_id) REFERENCES dir(id)"
cur.execute(cmd_add)
cur.execute(cmd_add_foreign)
conn.commit()'''

'''
conn = create_connection()
cur = conn.cursor()
cmd_add_name = "ALTER TABLE dir ADD COLUMN name VARCHAR(100)"
cur.execute(cmd_add_name)
conn.commit()'''

'''
conn = create_connection()
cur = conn.cursor()
cmd_delete_type = "ALTER TABLE file DROP COLUMN type"
cur.execute(cmd_delete_type)
conn.commit()'''

conn = create_connection()
cur = conn.cursor()
cmd_insert_path = "ALTER TABLE dir ADD COLUMN path VARCHAR(300)"
cur.execute(cmd_insert_path)
conn.commit()