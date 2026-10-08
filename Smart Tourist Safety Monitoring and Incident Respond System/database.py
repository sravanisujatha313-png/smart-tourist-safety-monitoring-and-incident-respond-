import sqlite3

# Connect to SQLite Database
conn = sqlite3.connect("tourist.db")
cursor = conn.cursor()

# ==========================================
# Users Table
# ==========================================
cursor.execute("""
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tourist_id TEXT UNIQUE,
    fullname TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT NOT NULL,
    password TEXT NOT NULL,
    qr_code TEXT
)
""")

# ==========================================
# Incident Reports Table
# ==========================================
cursor.execute("""
CREATE TABLE IF NOT EXISTS incidents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tourist_name TEXT NOT NULL,
    incident_type TEXT NOT NULL,
    description TEXT,
    location TEXT,
    image TEXT,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status TEXT DEFAULT 'Pending'
)
""")

# ==========================================
# Emergency Contacts Table
# ==========================================
cursor.execute("""
CREATE TABLE IF NOT EXISTS emergency_contacts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tourist_name TEXT NOT NULL,
    contact_name TEXT NOT NULL,
    relationship TEXT,
    phone TEXT NOT NULL
)
""")

# ==========================================
# Admin Table
# ==========================================
cursor.execute("""
CREATE TABLE IF NOT EXISTS admin (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT
)
""")

# ==========================================
# Hospitals Table
# ==========================================
cursor.execute("""
CREATE TABLE IF NOT EXISTS hospitals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    hospital_name TEXT,
    address TEXT,
    phone TEXT
)
""")

# ==========================================
# Police Stations Table
# ==========================================
cursor.execute("""
CREATE TABLE IF NOT EXISTS police (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    station_name TEXT,
    address TEXT,
    phone TEXT
)
""")

# ==========================================
# Default Admin
# ==========================================
cursor.execute("""
INSERT OR IGNORE INTO admin(username, password)
VALUES('admin', 'admin123')
""")

# Save Changes
conn.commit()

# Close Connection
conn.close()

print("Database and tables created successfully!")