from SetUp import create_connection

conn = create_connection()
curr = conn.cursor()

cmd_delete_user = "DELETE FROM enduser"
curr.execute(cmd_delete_user)
conn.commit()