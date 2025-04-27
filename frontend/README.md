# Work Time Tracker Frontend

This is the frontend application for the Work Time Tracker project, built using React. It provides a user interface for employees to log in, track their work time, manage tasks, and generate reports.

## Features

- **Login Interface**: Employees can log in using their credentials.
- **Task Categories**: Displays task categories as tiles for easy selection.
- **Live Time Tracking**: Allows users to track time spent on selected tasks in real-time.
- **Reporting**: Users can generate and export reports based on tracked time.

## Getting Started

To get started with the frontend application, follow these steps:

1. **Clone the repository**:
   ```
   git clone <repository-url>
   cd work-time-tracker/frontend
   ```

2. **Install dependencies**:
   ```
   npm install
   ```

3. **Run the application**:
   ```
   npm start
   ```

   This will start the development server and open the application in your default web browser.

## Folder Structure

- `public/`: Contains the static files, including `index.html`.
- `src/`: Contains the React components and styles.
  - `components/`: Contains individual components like `Login`, `TaskTiles`, `TimeTracker`, and `Reports`.
  - `styles/`: Contains CSS files for styling the application.

## Docker

To build and run the frontend application using Docker, follow these steps:

1. **Build the Docker image**:
   ```
   docker build -t work-time-tracker-frontend .
   ```

2. **Run the Docker container**:
   ```
   docker run -p 3000:3000 work-time-tracker-frontend
   ```

The application will be accessible at `http://localhost:3000`.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.