import psycopg2
from SetUp import create_connection
import uuid

new_id = uuid.uuid4().int >> 97

conn = create_connection()
cur = conn.cursor()
cmd_insert_dir = "prepare myplan as ""INSERT INTO dir VALUES ($1, $2, $3, $4)"""
cur.execute(cmd_insert_dir)
conn.commit()

cur.execute('execute myplan (%s, %s, %s, %s)', (new_id, new_id, "C:", "C:"))
conn.commit()