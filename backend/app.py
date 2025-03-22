from flask import Flask, request, jsonify
from flask_cors import CORS
import psycopg2
from psycopg2.extras import RealDictCursor

app = Flask(__name__)
CORS(app)

# Database connection
def get_db_connection():
    conn = psycopg2.connect(
        host="localhost",
        database="your_database_name",
        user="your_username",
        password="your_password"
    )
    return conn

# Create a new profile
@app.route('/api/profiles', methods=['POST'])
def create_profile():
    data = request.json
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute(
        'INSERT INTO profiles (name, age, location, bio, interests, images, distance)'
        'VALUES (%s, %s, %s, %s, %s, %s, %s) RETURNING id;',
        (data['name'], data['age'], data['location'], data['bio'], data['interests'], data['images'], data['distance'])
    )
    profile_id = cur.fetchone()[0]
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({"id": profile_id, "message": "Profile created successfully!"}), 201

# Get all profiles
@app.route('/api/profiles', methods=['GET'])
def get_profiles():
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    cur.execute('SELECT * FROM profiles;')
    profiles = cur.fetchall()
    cur.close()
    conn.close()
    return jsonify(profiles)

# Get a single profile by ID
@app.route('/api/profiles/<int:profile_id>', methods=['GET'])
def get_profile(profile_id):
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    cur.execute('SELECT * FROM profiles WHERE id = %s;', (profile_id,))
    profile = cur.fetchone()
    cur.close()
    conn.close()
    if profile is None:
        return jsonify({"error": "Profile not found"}), 404
    return jsonify(profile)

# Update a profile
@app.route('/api/profiles/<int:profile_id>', methods=['PUT'])
def update_profile(profile_id):
    data = request.json
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute(
        'UPDATE profiles SET name = %s, age = %s, location = %s, bio = %s, interests = %s, images = %s, distance = %s'
        'WHERE id = %s;',
        (data['name'], data['age'], data['location'], data['bio'], data['interests'], data['images'], data['distance'], profile_id)
    )
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({"message": "Profile updated successfully!"})

# Delete a profile
@app.route('/api/profiles/<int:profile_id>', methods=['DELETE'])
def delete_profile(profile_id):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('DELETE FROM profiles WHERE id = %s;', (profile_id,))
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({"message": "Profile deleted successfully!"})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)