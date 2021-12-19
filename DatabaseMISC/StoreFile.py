from SetUp import create_connection

conn = create_connection()

print("Database connection created")

cur = conn.cursor()
cmd_insert_file = "prepare myplan as ""INSERT INTO file VALUES ($1, $2)"""
cur.execute(cmd_insert_file)
conn.commit()
print("Successfully inserted values")

givenFile = "Test.txt"

testFile = open(givenFile, 'rb')
binaryData = testFile.read()
testFile.close()

cur.execute("execute myplan (%s, %s)", (1, binaryData))
conn.commit()
print("Successfully updated values with binary data as: ", binaryData)