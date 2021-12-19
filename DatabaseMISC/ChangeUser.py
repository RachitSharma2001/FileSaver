import psycopg2
from SetUp import create_connection

conn = create_connection()
curr = conn.cursor()

cmd_delete_col = "ALTER TABLE enduser DROP COLUMN username"
cmd_add_col = "ALTER TABLE enduser ADD COLUMN email VARCHAR(200)"
curr.execute(cmd_delete_col)
curr.execute(cmd_add_col)
conn.commit()
