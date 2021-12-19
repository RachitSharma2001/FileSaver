from SetUp import create_connection

conn = create_connection()
print("Database connection created")

cur = conn.cursor()
cmd_select_from_table = "SELECT * from file"
cur.execute(cmd_select_from_table)

table_entries = cur.fetchall()
for row in table_entries:
    print("ID: ", row[0])
    print("Data: ", bytes(row[1]))