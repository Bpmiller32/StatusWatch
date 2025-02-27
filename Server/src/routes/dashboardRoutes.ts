import { Router, Request, Response } from 'express';
import { getLatestStatusLog, getStatusLogs } from '../utils/firestore';
import { logger } from '../utils/logger';

const router = Router();

/**
 * Status dashboard endpoint
 * Returns an HTML page with the current status of the system
 */
router.get('/dashboard', async (req: Request, res: Response) => {
  try {
    // Get latest status log
    const latestLog = await getLatestStatusLog();
    
    // Get recent status logs (last 10)
    const recentLogs = await getStatusLogs(10);
    
    // Calculate uptime percentage
    const successfulPings = recentLogs.filter(log => 
      log.pingResults.every(result => result.status >= 200 && result.status < 300)
    ).length;
    
    const uptimePercentage = recentLogs.length > 0 
      ? (successfulPings / recentLogs.length) * 100 
      : 0;
      
    // Determine current status
    let status = 'unknown';
    let statusClass = 'status-unknown';
    
    if (latestLog) {
      const allPingsSuccessful = latestLog.pingResults.every(
        result => result.status >= 200 && result.status < 300
      );
      
      const logCheckSuccessful = latestLog.logCheck.success;
      
      if (allPingsSuccessful && logCheckSuccessful) {
        status = 'up';
        statusClass = 'status-healthy';
      } else if (allPingsSuccessful || logCheckSuccessful) {
        status = 'partially up';
        statusClass = 'status-warning';
      } else {
        status = 'down';
        statusClass = 'status-error';
      }
    }
    
    // Generate HTML
    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>StatusWatch Dashboard</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 20px;
            color: #333;
          }
          .container {
            max-width: 1200px;
            margin: 0 auto;
          }
          header {
            background-color: #f4f4f4;
            padding: 20px;
            margin-bottom: 20px;
            border-radius: 5px;
          }
          h1, h2, h3 {
            color: #444;
          }
          .status-card {
            background-color: #fff;
            border-radius: 5px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            padding: 20px;
            margin-bottom: 20px;
          }
          .status-indicator {
            display: inline-block;
            width: 15px;
            height: 15px;
            border-radius: 50%;
            margin-right: 10px;
          }
          .status-healthy {
            background-color: #2ecc71;
          }
          .status-warning {
            background-color: #f39c12;
          }
          .status-error {
            background-color: #e74c3c;
          }
          .status-unknown {
            background-color: #95a5a6;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
          }
          th, td {
            padding: 12px 15px;
            text-align: left;
            border-bottom: 1px solid #ddd;
          }
          th {
            background-color: #f4f4f4;
          }
          tr:hover {
            background-color: #f9f9f9;
          }
          .refresh-button {
            background-color: #3498db;
            color: white;
            border: none;
            padding: 10px 15px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
          }
          .refresh-button:hover {
            background-color: #2980b9;
          }
          .uptime-bar {
            height: 20px;
            background-color: #ecf0f1;
            border-radius: 10px;
            margin-bottom: 20px;
            overflow: hidden;
          }
          .uptime-fill {
            height: 100%;
            background-color: #2ecc71;
            width: ${uptimePercentage}%;
          }
          .timestamp {
            color: #7f8c8d;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <header>
            <h1>StatusWatch Dashboard</h1>
            <p>Real-time monitoring of system status</p>
            <button class="refresh-button" onclick="window.location.reload()">Refresh</button>
          </header>
          
          <div class="status-card">
            <h2>System Status</h2>
            <div class="uptime-bar">
              <div class="uptime-fill"></div>
            </div>
            <p>
              <span class="status-indicator ${statusClass}"></span>
              <strong>Current Status: ${status.toUpperCase()}</strong>
            </p>
            <p>Uptime: ${uptimePercentage.toFixed(2)}%</p>
            <p class="timestamp">Last updated: ${new Date().toLocaleString()}</p>
          </div>
          
          ${latestLog ? `
          <div class="status-card">
            <h2>Latest Status</h2>
            <h3>Ping Results</h3>
            <table>
              <thead>
                <tr>
                  <th>Endpoint</th>
                  <th>Status</th>
                  <th>Response Time</th>
                </tr>
              </thead>
              <tbody>
                ${latestLog.pingResults.map(result => `
                <tr>
                  <td>${result.endpoint}</td>
                  <td>
                    <span class="status-indicator ${
                      result.status >= 200 && result.status < 300 ? 'status-healthy' : 
                      result.status >= 300 && result.status < 500 ? 'status-warning' : 'status-error'
                    }"></span>
                    ${result.status}
                  </td>
                  <td>${result.responseTime} ms</td>
                </tr>
                `).join('')}
              </tbody>
            </table>
            
            <h3>Log Check</h3>
            <table>
              <thead>
                <tr>
                  <th>Status</th>
                  <th>Found Entries</th>
                  <th>Error</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <span class="status-indicator ${
                      latestLog.logCheck.success ? 'status-healthy' : 'status-error'
                    }"></span>
                    ${latestLog.logCheck.success ? 'Success' : 'Failed'}
                  </td>
                  <td>${latestLog.logCheck.foundEntries}</td>
                  <td>${latestLog.logCheck.error || 'None'}</td>
                </tr>
              </tbody>
            </table>
            <p class="timestamp">Timestamp: ${latestLog.timestamp.toDate().toLocaleString()}</p>
          </div>
          ` : '<div class="status-card"><h2>No status data available</h2></div>'}
          
          <div class="status-card">
            <h2>Recent Status History</h2>
            <table>
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Ping Status</th>
                  <th>Log Check</th>
                </tr>
              </thead>
              <tbody>
                ${recentLogs.map(log => `
                <tr>
                  <td>${log.timestamp.toDate().toLocaleString()}</td>
                  <td>
                    <span class="status-indicator ${
                      log.pingResults.every(r => r.status >= 200 && r.status < 300) ? 'status-healthy' : 
                      log.pingResults.some(r => r.status >= 500) ? 'status-error' : 'status-warning'
                    }"></span>
                    ${log.pingResults.every(r => r.status >= 200 && r.status < 300) ? 'Healthy' : 
                      log.pingResults.some(r => r.status >= 500) ? 'Error' : 'Warning'}
                  </td>
                  <td>
                    <span class="status-indicator ${
                      log.logCheck.success ? 'status-healthy' : 'status-error'
                    }"></span>
                    ${log.logCheck.success ? 'Success' : 'Failed'}
                  </td>
                </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </body>
      </html>
    `;
    
    // Send HTML response
    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  } catch (error: any) {
    logger.error('Error generating dashboard:', error);
    
    // Send error response
    res.status(500).send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>StatusWatch Dashboard - Error</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 20px;
            color: #333;
          }
          .container {
            max-width: 800px;
            margin: 0 auto;
            text-align: center;
          }
          .error-card {
            background-color: #fff;
            border-radius: 5px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            padding: 20px;
            margin-top: 50px;
            border-left: 5px solid #e74c3c;
          }
          h1 {
            color: #e74c3c;
          }
          .refresh-button {
            background-color: #3498db;
            color: white;
            border: none;
            padding: 10px 15px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
            margin-top: 20px;
          }
          .refresh-button:hover {
            background-color: #2980b9;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="error-card">
            <h1>Dashboard Error</h1>
            <p>There was an error generating the dashboard.</p>
            ${process.env.NODE_ENV === 'development' ? `<p>Error: ${error.message}</p>` : ''}
            <button class="refresh-button" onclick="window.location.reload()">Retry</button>
          </div>
        </div>
      </body>
      </html>
    `);
  }
});

export default router;
