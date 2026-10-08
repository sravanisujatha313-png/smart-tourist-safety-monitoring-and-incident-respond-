import sqlite3

conn = sqlite3.connect("tourist.db")
cur = conn.cursor()

# Users Table
cur.execute("""
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tourist_id TEXT UNIQUE,
    fullname TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    password TEXT NOT NULL,
    qr_code TEXT
)
""")

# Incidents Table
cur.execute("""
CREATE TABLE IF NOT EXISTS incidents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    location TEXT NOT NULL,
    incident_type TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'Pending',
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
)
""")

conn.commit()
conn.close()

print("Database created successfully!")