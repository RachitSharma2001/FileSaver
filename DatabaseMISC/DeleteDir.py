import psycopg2
from SetUp import create_connection

conn = create_connection()
curr = conn.cursor()
cmd_delete_dir = "DROP TABLE dir CASCADE"
curr.execute(cmd_delete_dir)
conn.commit()