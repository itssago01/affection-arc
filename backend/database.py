##This file will handle database connections and queries:

import psycopg2
from psycopg2 import Error
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

def get_db_connection():
    """Connect to the PostgreSQL database."""
    try:
        connection = psycopg2.connect(
            host=os.getenv('DB_HOST'),
            database=os.getenv('DB_NAME'),
            user=os.getenv('DB_USER'),
            password=os.getenv('DB_PASSWORD')
        )
        return connection
    except Error as e:
        print(f"Error connecting to PostgreSQL: {e}")
        return None

def create_tables():
    """Create tables in the database."""
    connection = get_db_connection()
    if connection:
        try:
            cursor = connection.cursor()
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS users (
                    id SERIAL PRIMARY KEY,
                    name VARCHAR(100) NOT NULL,
                    email VARCHAR(100) NOT NULL UNIQUE,
                    password VARCHAR(100) NOT NULL,
                    gender VARCHAR(10) NOT NULL,
                    age INT NOT NULL,
                    bio TEXT,
                    profile_picture TEXT
                );
            ''')
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS preferences (
                    id SERIAL PRIMARY KEY,
                    user_id INT REFERENCES users(id) ON DELETE CASCADE,
                    preferred_gender VARCHAR(10) NOT NULL,
                    min_age INT NOT NULL,
                    max_age INT NOT NULL
                );
            ''')
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS matches (
                    id SERIAL PRIMARY KEY,
                    user1_id INT REFERENCES users(id) ON DELETE CASCADE,
                    user2_id INT REFERENCES users(id) ON DELETE CASCADE,
                    matched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
            ''')
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS messages (
                    id SERIAL PRIMARY KEY,
                    match_id INT REFERENCES matches(id) ON DELETE CASCADE,
                    sender_id INT REFERENCES users(id) ON DELETE CASCADE,
                    message TEXT NOT NULL,
                    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
            ''')
            connection.commit()
            print("Tables created successfully")
        except Error as e:
            print(f"Error creating tables: {e}")
        finally:
            cursor.close()
            connection.close()

def insert_user(name, email, password, gender, age, bio=None, profile_picture=None):
    """Insert a new user into the database."""
    connection = get_db_connection()
    if connection:
        try:
            cursor = connection.cursor()
            cursor.execute('''
                INSERT INTO users (name, email, password, gender, age, bio, profile_picture)
                VALUES (%s, %s, %s, %s, %s, %s, %s);
            ''', (name, email, password, gender, age, bio, profile_picture))
            connection.commit()
            print("User inserted successfully")
        except Error as e:
            print(f"Error inserting user: {e}")
        finally:
            cursor.close()
            connection.close()

def get_users():
    """Fetch all users from the database."""
    connection = get_db_connection()
    if connection:
        try:
            cursor = connection.cursor()
            cursor.execute('SELECT * FROM users;')
            users = cursor.fetchall()
            return users
        except Error as e:
            print(f"Error fetching users: {e}")
            return []
        finally:
            cursor.close()
            connection.close()