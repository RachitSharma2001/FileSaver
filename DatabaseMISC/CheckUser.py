import psycopg2
from SetUp import create_connection

conn = create_connection()
cur = conn.cursor()
cmd_check_user = "SELECT id FROM enduser WHERE username='{}' AND password='{}'".format('rachit123','jlaskfasdfj;sdf')
cur.execute(cmd_check_user)
print(len(cur.fetchall()))