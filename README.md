# Work Time Tracker

This project is a work time tracking application designed to help employees log their working hours efficiently. It includes a login interface, task category tiles, live time tracking, and reporting features. The application is built using Flask for the backend and React for the frontend, and it is containerized using Docker.

## Project Structure

```
work-time-tracker
├── backend
│   ├── app.py                # Main entry point for the backend application
│   ├── requirements.txt      # Python dependencies for the backend
│   ├── Dockerfile            # Dockerfile for building the backend image
│   └── README.md             # Documentation for the backend
├── frontend
│   ├── public
│   │   └── index.html        # Main HTML file for the frontend application
│   ├── src
│   │   ├── App.js            # Main component of the React application
│   │   ├── components
│   │   │   ├── Login.js      # Login interface component
│   │   │   ├── TaskTiles.js   # Component for displaying task categories
│   │   │   ├── TimeTracker.js  # Live time tracking component
│   │   │   └── Reports.js     # Component for generating reports
│   │   └── styles
│   │       └── App.css       # CSS styles for the frontend application
│   ├── package.json          # npm configuration file for the frontend
│   ├── Dockerfile            # Dockerfile for building the frontend image
│   └── README.md             # Documentation for the frontend
├── docker-compose.yml        # Docker Compose configuration for the application
└── README.md                 # Overall documentation for the project
```

## Getting Started

### Prerequisites

- Docker
- Docker Compose

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd work-time-tracker
   ```

2. Build and run the application using Docker Compose:
   ```
   docker-compose up --build
   ```

3. Access the application in your web browser at `http://localhost:3000`.

### Usage

- Employees can log in using their credentials.
- Once logged in, they can select task categories and track their time.
- Reports can be generated based on the tracked time.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or features you would like to add.

## License

This project is licensed under the MIT License. See the LICENSE file for details.