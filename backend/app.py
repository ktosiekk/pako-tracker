from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import datetime

app = Flask(__name__)
CORS(app)

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///work_time_tracker.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    name = db.Column(db.String(120), nullable=False)  # Keep this field
    surname = db.Column(db.String(120), nullable=False)  # Keep this field

class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    category = db.Column(db.String(80), nullable=False)
    start_time = db.Column(db.DateTime, nullable=True)
    end_time = db.Column(db.DateTime, nullable=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)  # Ensure this field exists

# Routes
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    user = User.query.filter_by(username=data['username'], password=data['password']).first()
    if user:
        return jsonify({"message": "Login successful"}), 200
    return jsonify({"message": "Invalid credentials"}), 401

@app.route('/tasks', methods=['POST'])
def create_task():
    data = request.json
    new_task = Task(category=data['category'])
    db.session.add(new_task)
    db.session.commit()
    return jsonify({"message": "Task created", "task_id": new_task.id}), 201

@app.route('/tasks/<int:task_id>/start', methods=['POST'])
def start_task(task_id):
    data = request.json
    user_id = data.get('user_id')  # Pass the user ID in the request body

    # Check if the user has another running task
    running_task = Task.query.filter(
        Task.start_time.isnot(None),
        Task.end_time.is_(None),
        Task.user_id == user_id
    ).first()

    if running_task:
        # Pause the currently running task
        running_task.end_time = datetime.datetime.now()
        db.session.commit()

    # Start the new task
    task = Task.query.get(task_id)
    if task:
        task.start_time = datetime.datetime.now()
        task.user_id = user_id  # Associate the task with the user
        db.session.commit()
        return jsonify({"message": "Task started"}), 200

    return jsonify({"message": "Task not found"}), 404

@app.route('/tasks/<int:task_id>/stop', methods=['POST'])
def stop_task(task_id):
    task = Task.query.get(task_id)
    if task and task.start_time:
        task.end_time = datetime.datetime.now()
        db.session.commit()
        return jsonify({"message": "Task stopped"}), 200
    return jsonify({"message": "Task not found or not started"}), 404

@app.route('/reports', methods=['GET'])
def get_reports():
    tasks = Task.query.all()
    report = [{"id": task.id, "category": task.category, "start_time": task.start_time, "end_time": task.end_time} for task in tasks]
    return jsonify(report), 200

@app.route('/validate_user', methods=['POST'])
def validate_user():
    data = request.json
    user = User.query.filter_by(username=data['userId']).first()
    if user:
        return jsonify({"name": user.name, "surname": user.surname}), 200
    return jsonify({"message": "Invalid user ID"}), 401

@app.route('/save_tracking_data', methods=['POST'])
def save_tracking_data():
    data = request.json
    for record in data:
        # Save each record to the database (adjust the model as needed)
        report = Task(
            user_id=record['userId'],
            name=record['name'],
            surname=record['surname'],
            category=record['category'],
            subcategory=record['subcategory'],
            total_time=record['totalTime'],
            date=datetime.date.today()
        )
        db.session.add(report)
    db.session.commit()
    return jsonify({"message": "Tracking data saved successfully"}), 200

if __name__ == '__main__':
    with app.app_context():  # Add this line to set up the application context
        db.create_all()  # Create the database tables
    app.run(host='0.0.0.0', port=5000)