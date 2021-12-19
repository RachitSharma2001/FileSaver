import psycopg2
from SetUp import create_connection

conn = create_connection()
cur = conn.cursor()
cmd_create_user_table = """ CREATE TABLE enduser (
    id INT not NULL PRIMARY KEY,
    username VARCHAR(200) not NULL,
    password VARCHAR(200) not NULL
)"""

cur.execute(cmd_create_user_table)
conn.commit()