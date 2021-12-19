import psycopg2
from SetUp import create_connection
import uuid

primary_key = uuid.uuid4().int >> 97

conn = create_connection()
cur = conn.cursor()

cmd_add_user = "prepare myplan as ""INSERT INTO enduser VALUES ($1, $2, $3)"""
cur.execute(cmd_add_user)
conn.commit()
cur.execute('execute myplan (%s, %s, %s)', (primary_key, 'rachit123', 'jlaskfj;sdf'))
conn.commit()