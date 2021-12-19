import psycopg2
from SetUp import create_connection

conn = create_connection()
cur = conn.cursor()
cmd_add_userid = 'ALTER TABLE dir ADD COLUMN user_id INT'
cmd_alter_dir = 'ALTER TABLE dir ADD CONSTRAINT dirfk_u FOREIGN KEY (user_id) REFERENCES enduser(id)'
cur.execute(cmd_add_userid)
cur.execute(cmd_alter_dir)
conn.commit()
