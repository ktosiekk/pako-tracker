# Work Time Tracker Backend

This document provides an overview of the backend application for the Work Time Tracker project. The backend is built using Flask and is responsible for handling user authentication, managing task categories, and tracking time for tasks.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/work-time-tracker.git
   cd work-time-tracker/backend
   ```

2. Install the required dependencies:
   ```
   pip install -r requirements.txt
   ```

3. Build and run the Docker container:
   ```
   docker build -t work-time-tracker-backend .
   docker run -p 5000:5000 work-time-tracker-backend
   ```

## Usage

- Start the Flask server to handle requests.
- Access the API endpoints to manage user authentication and task tracking.

## API Endpoints

- **POST /login**: Authenticate a user.
- **GET /tasks**: Retrieve a list of task categories.
- **POST /tasks/start**: Start tracking time for a task.
- **POST /tasks/stop**: Stop tracking time for a task.
- **GET /reports**: Generate reports based on tracked time.

## Contributing

Contributions are welcome! Please submit a pull request or open an issue for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.