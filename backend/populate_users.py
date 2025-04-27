# filepath: d:\Projekty\pako-time-tracker\work-time-tracker\backend\populate_users.py
from app import db, User, app  # Import the app instance along with db and User

# Add sample users
users = [
    User(username="PAK001", name="Kamil", surname="Bednarski"),
    User(username="PAK002", name="Jerzy", surname="Ogórek"),
    User(username="PAK003", name="Jaro", surname="Sław"),
    User(username="PAK004", name="Tomasz", surname="Pieróg"),
    User(username="PAK005", name="Paweł", surname="Lipiński"),
]

# Use the application context to perform database operations
with app.app_context():
    db.session.bulk_save_objects(users)
    db.session.commit()
    print("Users added successfully!")
