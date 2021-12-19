import psycopg2
from SetUp import create_connection

conn = create_connection()
curr = conn.cursor()
cmd = "SELECT id FROM dir WHERE path='{}'".format("/abc")
curr.execute(cmd)
print(curr.fetchall())