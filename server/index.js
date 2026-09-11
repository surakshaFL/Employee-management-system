import express from 'express';
import cors from 'cors';
import { initDatabase, pool, getEmployees, getLeaveRequests, getDashboardStats, getReports, createEmployee, createLeaveRequest, closePool } from './db.js';

const app = express();
const PORT = Number(process.env.PORT || 5000);

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Employee management API is running.' });
});

app.get('/api/employees', async (req, res) => {
  try {
    const employees = await getEmployees();
    res.json(employees);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch employees', details: error.message });
  }
});

app.get('/api/leave-requests', async (req, res) => {
  try {
    const leaveRequests = await getLeaveRequests();
    res.json(leaveRequests);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch leave requests', details: error.message });
  }
});

app.get('/api/dashboard', async (req, res) => {
  try {
    const dashboard = await getDashboardStats();
    res.json(dashboard);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch dashboard data', details: error.message });
  }
});

app.get('/api/reports', async (req, res) => {
  try {
    const reports = await getReports();
    res.json(reports);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch reports data', details: error.message });
  }
});

app.post('/api/employees', async (req, res) => {
  const { name, role, dept, status } = req.body || {};

  if (!name || !role || !dept || !status) {
    return res.status(400).json({ error: 'Missing required employee fields' });
  }

  try {
    const employee = await createEmployee({ name, role, dept, status });
    return res.status(201).json(employee);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to create employee', details: error.message });
  }
});

app.post('/api/leave-requests', async (req, res) => {
  const { employee, type, dates, status } = req.body || {};

  if (!employee || !type || !dates || !status) {
    return res.status(400).json({ error: 'Missing required leave request fields' });
  }

  try {
    const leaveRequest = await createLeaveRequest({ employee, type, dates, status });
    return res.status(201).json(leaveRequest);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to create leave request', details: error.message });
  }
});

async function startServer() {
  await initDatabase();

  app.listen(PORT, () => {
    console.log(`API running on http://localhost:${PORT}`);
  });
}

startServer();

process.on('SIGINT', async () => {
  await closePool();
  process.exit(0);
});
