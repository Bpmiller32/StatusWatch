# StatusWatch

A monitoring system for checking endpoint status and log file analysis.

## Features

- Ping monitoring for endpoints/IPs
- Log file monitoring for uptime information
- Scheduled tasks with configurable intervals
- Data retention policy
- RESTful API for status information
- Firebase Firestore integration for data storage
- Status dashboard with visual indicators
- Health check endpoint
- Request validation and rate limiting

## Project Structure

```
/StatusWatch
├── src/
│   ├── config/        (Configuration files)
│   ├── controllers/   (API endpoint handlers)
│   ├── middleware/    (Express middleware)
│   ├── models/        (Data models)
│   ├── routes/        (API routes)
│   ├── services/      (Business logic)
│   │   ├── ping/      (Ping service)
│   │   └── logs/      (Log monitoring service)
│   └── utils/         (Utility functions)
├── .env               (Environment variables)
├── .env.example       (Example environment file)
├── .gitignore         (Git ignore file)
├── API_DOCUMENTATION.md (API documentation)
├── OPERATIONS_RUNBOOK.md (Operations guide)
├── firestore.rules    (Firestore security rules)
├── package.json       (Project dependencies)
├── tsconfig.json      (TypeScript configuration)
└── README.md          (Project documentation)
```

## Prerequisites

- Node.js (v14 or higher)
- Firebase project with Firestore database
- Firebase service account credentials

## Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file based on `.env.example` and update with your configuration
4. Place your Firebase service account credentials file in the project root
5. Build the project:
   ```
   npm run build
   ```

## Running the Application

### Development Mode

```
npm run dev
```

### Production Mode

```
npm start
```

## API Endpoints

### Status Endpoints

- `GET /api/pingstatus` - Get the latest ping status
- `GET /api/pinglist` - Get a list of ping statuses
- `GET /api/steadystatus` - Get the latest log check status
- `GET /api/steadylist` - Get a list of log check statuses
- `GET /api/fullstatus` - Get the latest full status (ping and log check)

### Configuration

The application configuration is stored in a JSON file (`config.json`) in the project root directory. To modify the configuration, edit this file and restart the application.

### Monitoring Endpoints

- `GET /api/health` - Get the health status of the system
- `GET /api/dashboard` - Get the status dashboard (HTML)

## Configuration Options

- `pingInterval` - Cron expression for ping interval (default: '*/5 * * * * *')
- `endpoints` - Array of endpoints to ping
- `logFilePath` - Path to the log file to monitor
- `dataRetentionDays` - Number of days to retain data (default: 3)
- `port` - Port for the Express server (default: 3000)

## Documentation

- [API Documentation](API_DOCUMENTATION.md) - Detailed API reference
- [Operations Runbook](OPERATIONS_RUNBOOK.md) - Maintenance and operations guide
- [Firestore Rules](firestore.rules) - Security rules for Firestore

## Implementation Status

The following phases have been implemented:

- ✅ Phase 1: Initial Setup and Infrastructure
- ✅ Phase 2: Scheduled Tasks Implementation
- ✅ Phase 3: API Endpoints Implementation
- ✅ Phase 4: Configuration and Security
- ✅ Phase 5: Testing and Validation
- ✅ Phase 6: Deployment and Monitoring (excluding Docker and PM2)

## License

ISC
