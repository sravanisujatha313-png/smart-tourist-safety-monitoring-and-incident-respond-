from flask import Flask, render_template, request, redirect, session, jsonify
import sqlite3
import qrcode
import os
import re
import requests

app = Flask(__name__)
app.secret_key = "tourist_safety_secret_key"

DB_NAME = "tourist.db"
QR_FOLDER = "static/qr_codes"

os.makedirs(QR_FOLDER, exist_ok=True)


# =========================================================
# DATABASE
# =========================================================

def get_db():
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row
    return conn


# =========================================================
# DISABLE BROWSER CACHE
# =========================================================

@app.after_request
def add_header(response):
    response.headers["Cache-Control"] = (
        "no-store, no-cache, must-revalidate, max-age=0"
    )
    response.headers["Pragma"] = "no-cache"
    response.headers["Expires"] = "0"
    return response


# =========================================================
# HOME
# =========================================================

@app.route("/")
def home():
    return render_template("index.html")


# =========================================================
# REGISTER
# =========================================================

@app.route("/register", methods=["GET", "POST"])
def register():

    if request.method == "POST":

        name = request.form.get("username", "").strip()
        email = request.form.get("email", "").strip()
        phone = request.form.get("phone", "").strip()
        password = request.form.get("password", "")
        confirm_password = request.form.get("confirm_password", "")

        if not name or not email or not phone or not password:
            return "All fields are required!"

        if password != confirm_password:
            return "Passwords do not match!"

        if len(password) < 8:
            return "Password must contain at least 8 characters."

        email_pattern = r'^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'

        if not re.match(email_pattern, email):
            return "Invalid email address."

        if not phone.isdigit() or len(phone) != 10:
            return "Phone number must contain exactly 10 digits."

        conn = get_db()
        cur = conn.cursor()

        cur.execute(
            "SELECT id FROM users WHERE email=?",
            (email,)
        )

        existing_user = cur.fetchone()

        if existing_user:
            conn.close()
            return "Email already registered!"

        cur.execute("SELECT COUNT(*) FROM users")
        count = cur.fetchone()[0] + 1

        tourist_id = f"TR{count:03d}"

        # Create QR code
        qr_filename = tourist_id + ".png"

        qr_data = (
            f"Tourist ID: {tourist_id}\n"
            f"Name: {name}\n"
            f"Email: {email}\n"
            f"Phone: {phone}"
        )

        img = qrcode.make(qr_data)

        img.save(
            os.path.join(QR_FOLDER, qr_filename)
        )

        cur.execute("""
            INSERT INTO users
            (tourist_id, fullname, email, phone, password, qr_code)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (
            tourist_id,
            name,
            email,
            phone,
            password,
            qr_filename
        ))

        conn.commit()
        conn.close()

        return redirect("/login")

    return render_template("register.html")


# =========================================================
# LOGIN
# =========================================================

@app.route("/login", methods=["GET", "POST"])
def login():

    if request.method == "POST":

        email = request.form.get("email", "").strip()
        password = request.form.get("password", "")

        conn = get_db()
        cur = conn.cursor()

        cur.execute("""
            SELECT *
            FROM users
            WHERE email=? AND password=?
        """, (email, password))

        user = cur.fetchone()

        conn.close()

        if user:

            session["user_id"] = user["id"]
            session["user_name"] = user["fullname"]

            return redirect("/dashboard")

        return "Invalid Email or Password"

    return render_template("login.html")


# =========================================================
# DASHBOARD
# =========================================================

@app.route("/dashboard")
def dashboard():

    if "user_id" not in session:
        return redirect("/login")

    return render_template("dashboard.html")


# =========================================================
# LOCATION
# =========================================================

@app.route("/location")
def location():

    if "user_id" not in session:
        return redirect("/login")

    return render_template("location.html")


# =========================================================
# SOS
# =========================================================

@app.route("/sos")
def sos():

    if "user_id" not in session:
        return redirect("/login")

    return render_template("sos.html")


# =========================================================
# EMERGENCY CONTACTS
# =========================================================

@app.route("/contacts")
def contacts():

    if "user_id" not in session:
        return redirect("/login")

    return render_template("contacts.html")


# =========================================================
# INCIDENT REPORT
# =========================================================

@app.route("/report", methods=["GET", "POST"])
def report():

    if "user_id" not in session:
        return redirect("/login")

    if request.method == "POST":

        name = request.form.get("name", "").strip()
        location = request.form.get("location", "").strip()
        incident_type = request.form.get("incident_type", "").strip()
        description = request.form.get("description", "").strip()

        if not name or not location or not incident_type:
            return "Please fill all required fields."

        conn = get_db()
        cur = conn.cursor()

        cur.execute("""
            INSERT INTO incidents
            (tourist_name, incident_type, description, location, status)
            VALUES (?, ?, ?, ?, ?)
        """, (
            name,
            incident_type,
            description,
            location,
            "Pending"
        ))

        conn.commit()
        conn.close()

        return """
        <h2>Incident Report Submitted Successfully!</h2>
        <a href="/dashboard">Go to Dashboard</a>
        """

    return render_template("report.html")


# =========================================================
# INCIDENT HISTORY
# =========================================================

@app.route("/history")
def history():

    if "user_id" not in session:
        return redirect("/login")

    conn = get_db()
    cur = conn.cursor()

    cur.execute("""
        SELECT id,
               location,
               incident_type,
               description,
               status,
               date
        FROM incidents
        ORDER BY id DESC
    """)

    incidents = cur.fetchall()

    conn.close()

    return render_template(
        "history.html",
        incidents=incidents
    )


# =========================================================
# HOSPITAL PAGE
# =========================================================

@app.route("/hospital")
def hospital():

    if "user_id" not in session:
        return redirect("/login")

    return render_template("hospital.html")


# =========================================================
# NEARBY HOSPITAL / POLICE / FIRE API
# =========================================================

@app.route("/api/emergency")
def emergency():

    lat = request.args.get("lat")
    lon = request.args.get("lon")

    if not lat or not lon:
        return jsonify({
            "error": "Latitude and Longitude are required"
        }), 400

    try:

        overpass_query = f"""
        [out:json];
        (
            node(around:5000,{lat},{lon})["amenity"="hospital"];
            node(around:5000,{lat},{lon})["amenity"="police"];
            node(around:5000,{lat},{lon})["amenity"="fire_station"];
        );
        out body;
        """

        response = requests.post(
            "https://overpass-api.de/api/interpreter",
            data=overpass_query,
            timeout=20
        )

        response.raise_for_status()

        data = response.json()

        places = []

        for item in data.get("elements", []):

            tags = item.get("tags", {})

            places.append({
                "name": tags.get("name", "Unknown"),
                "type": tags.get("amenity", ""),
                "lat": item.get("lat"),
                "lon": item.get("lon")
            })

        return jsonify(places)

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500


# =========================================================
# SAFE ROUTE
# =========================================================

@app.route("/safe_route")
def safe_route():

    if "user_id" not in session:
        return redirect("/login")

    return render_template("safe_route.html")


# =========================================================
# GEOCODING FUNCTION
# =========================================================

def get_coordinates(place):

    url = "https://nominatim.openstreetmap.org/search"

    params = {
        "q": place,
        "format": "json",
        "limit": 1
    }

    headers = {
        "User-Agent": "TouristSafetySystem/1.0"
    }

    response = requests.get(
        url,
        params=params,
        headers=headers,
        timeout=15
    )

    response.raise_for_status()

    data = response.json()

    if not data:
        return None

    return (
        float(data[0]["lat"]),
        float(data[0]["lon"])
    )


# =========================================================
# SAFE ROUTE API
# =========================================================

@app.route("/api/safe-route", methods=["POST"])
def safe_route_api():

    if "user_id" not in session:
        return jsonify({
            "error": "Please login first."
        }), 401

    data = request.get_json()

    current = data.get("current", "").strip()
    destination = data.get("destination", "").strip()

    if not current or not destination:

        return jsonify({
            "error": "Enter current location and destination."
        }), 400

    try:

        start = get_coordinates(current)
        end = get_coordinates(destination)

        if not start:

            return jsonify({
                "error": "Current location not found."
            }), 404

        if not end:

            return jsonify({
                "error": "Destination not found."
            }), 404

        start_lat, start_lon = start
        end_lat, end_lon = end

        # OSRM routing
        route_url = (
            "https://router.project-osrm.org/route/v1/driving/"
            f"{start_lon},{start_lat};{end_lon},{end_lat}"
        )

        params = {
            "overview": "full",
            "geometries": "geojson",
            "steps": "true"
        }

        response = requests.get(
            route_url,
            params=params,
            timeout=20
        )

        response.raise_for_status()

        route_data = response.json()

        if route_data.get("code") != "Ok":

            return jsonify({
                "error": "Route could not be found."
            }), 404

        route = route_data["routes"][0]

        distance_km = route["distance"] / 1000
        duration_minutes = route["duration"] / 60

        geometry = route["geometry"]

        return jsonify({

            "success": True,

            "distance": round(distance_km, 2),

            "duration": round(duration_minutes, 1),

            "start": {
                "lat": start_lat,
                "lon": start_lon
            },

            "destination": {
                "lat": end_lat,
                "lon": end_lon
            },

            "geometry": geometry

        })

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500


# =========================================================
# WEATHER PAGE
# =========================================================

@app.route("/weather")
def weather():

    if "user_id" not in session:
        return redirect("/login")

    return render_template("weather.html")


# =========================================================
# WEATHER API
# =========================================================

@app.route("/api/weather")
def weather_api():

    city = request.args.get("city", "Bengaluru")

    try:

        # First find city coordinates
        geo_url = "https://geocoding-api.open-meteo.com/v1/search"

        geo_params = {
            "name": city,
            "count": 1,
            "language": "en",
            "format": "json"
        }

        geo_response = requests.get(
            geo_url,
            params=geo_params,
            timeout=10
        )

        geo_response.raise_for_status()

        geo_data = geo_response.json()

        if "results" not in geo_data or not geo_data["results"]:

            return jsonify({
                "error": "City not found"
            }), 404

        location = geo_data["results"][0]

        latitude = location["latitude"]
        longitude = location["longitude"]

        # Get current weather
        weather_url = "https://api.open-meteo.com/v1/forecast"

        weather_params = {
            "latitude": latitude,
            "longitude": longitude,
            "current": (
                "temperature_2m,"
                "relative_humidity_2m,"
                "weather_code,"
                "wind_speed_10m"
            ),
            "timezone": "auto"
        }

        weather_response = requests.get(
            weather_url,
            params=weather_params,
            timeout=10
        )

        weather_response.raise_for_status()

        weather_data = weather_response.json()

        current = weather_data["current"]

        weather_code = current.get("weather_code", 0)

        condition = get_weather_condition(weather_code)

        return jsonify({

            "city": location.get("name", city),

            "temperature": current.get(
                "temperature_2m"
            ),

            "humidity": current.get(
                "relative_humidity_2m"
            ),

            "wind_speed": current.get(
                "wind_speed_10m"
            ),

            "condition": condition

        })

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500


# =========================================================
# WEATHER CONDITION
# =========================================================

def get_weather_condition(code):

    weather_codes = {

        0: "Clear sky",

        1: "Mainly clear",
        2: "Partly cloudy",
        3: "Overcast",

        45: "Fog",
        48: "Depositing rime fog",

        51: "Light drizzle",
        53: "Moderate drizzle",
        55: "Dense drizzle",

        61: "Slight rain",
        63: "Moderate rain",
        65: "Heavy rain",

        71: "Slight snow",
        73: "Moderate snow",
        75: "Heavy snow",

        80: "Slight rain showers",
        81: "Moderate rain showers",
        82: "Violent rain showers",

        95: "Thunderstorm",

        96: "Thunderstorm with slight hail",
        99: "Thunderstorm with heavy hail"
    }

    return weather_codes.get(
        code,
        "Unknown"
    )


# =========================================================
# GUIDE
# =========================================================

@app.route("/guide")
def guide():

    if "user_id" not in session:
        return redirect("/login")

    return render_template("guide.html")


# =========================================================
# POLICE
# =========================================================

@app.route("/police")
def police():

    if "user_id" not in session:
        return redirect("/login")

    return render_template("police.html")


# =========================================================
# PROFILE
# =========================================================

@app.route("/profile")
def profile():

    if "user_id" not in session:
        return redirect("/login")

    conn = get_db()
    cur = conn.cursor()

    cur.execute("""
        SELECT tourist_id,
               fullname,
               email,
               phone,
               qr_code
        FROM users
        WHERE id=?
    """, (session["user_id"],))

    user = cur.fetchone()

    conn.close()

    return render_template(
        "profile.html",
        user=user
    )


# =========================================================
# ADMIN
# =========================================================

@app.route("/admin")
def admin():

    search = request.args.get(
        "search",
        ""
    ).strip()

    conn = get_db()
    cur = conn.cursor()

    cur.execute(
        "SELECT COUNT(*) FROM users"
    )

    total_users = cur.fetchone()[0]

    cur.execute(
        "SELECT COUNT(*) FROM incidents"
    )

    total_reports = cur.fetchone()[0]

    cur.execute("""
        SELECT COUNT(*)
        FROM incidents
        WHERE status='Pending'
    """)

    pending_reports = cur.fetchone()[0]

    cur.execute("""
        SELECT COUNT(*)
        FROM incidents
        WHERE status='Resolved'
    """)

    resolved_reports = cur.fetchone()[0]

    if search:

        cur.execute("""
            SELECT id,
                   location,
                   incident_type,
                   status,
                   date
            FROM incidents
            WHERE location LIKE ?
               OR incident_type LIKE ?
            ORDER BY id DESC
        """, (
            "%" + search + "%",
            "%" + search + "%"
        ))

    else:

        cur.execute("""
            SELECT id,
                   location,
                   incident_type,
                   status,
                   date
            FROM incidents
            ORDER BY id DESC
        """)

    reports = cur.fetchall()

    conn.close()

    return render_template(
        "admin.html",
        total_users=total_users,
        total_reports=total_reports,
        pending_reports=pending_reports,
        resolved_reports=resolved_reports,
        reports=reports
    )


# =========================================================
# LOGOUT
# =========================================================

@app.route("/logout")
def logout():

    session.clear()

    return redirect("/login")


# =========================================================
# RUN APPLICATION
# =========================================================

if __name__ == "__main__":

    app.run(
        debug=True,
        host="127.0.0.1",
        port=5000
    )