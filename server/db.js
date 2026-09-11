import dotenv from 'dotenv';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import pg from 'pg';

dotenv.config();

const { Pool } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/employee_management',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

const inMemoryStore = {
  employees: [
    { id: 1, name: 'Ayesha Khan', role: 'HR Manager', dept: 'Human Resources', status: 'Active' },
    { id: 2, name: 'Rahul Verma', role: 'Senior Developer', dept: 'Engineering', status: 'Working' },
    { id: 3, name: 'Nisha Patel', role: 'Sales Lead', dept: 'Sales', status: 'In Meeting' },
    { id: 4, name: 'Imran Ali', role: 'Operations Analyst', dept: 'Operations', status: 'On Leave' },
  ],
  leaveRequests: [
    { id: 1, employee: 'Aisha Noor', type: 'Annual Leave', dates: '12 Sep - 15 Sep', status: 'Pending' },
    { id: 2, employee: 'Harsh Jain', type: 'Sick Leave', dates: '09 Sep - 10 Sep', status: 'Approved' },
    { id: 3, employee: 'Meera Das', type: 'Parental Leave', dates: '20 Sep - 30 Sep', status: 'Review' },
    { id: 4, employee: 'Omar Siddiqui', type: 'Personal Leave', dates: '14 Sep - 14 Sep', status: 'Rejected' },
  ],
};

let dbReady = false;

export async function initDatabase() {
  try {
    await pool.query('SELECT 1');
    const initSql = fs.readFileSync(path.join(__dirname, 'init.sql'), 'utf8');
    await pool.query(initSql);
    dbReady = true;
    console.log('PostgreSQL connected and initialized.');
  } catch (error) {
    dbReady = false;
    console.warn('PostgreSQL unavailable, using in-memory data store. Start PostgreSQL and set DATABASE_URL to enable real storage.');
    console.warn(error.message);
  }
}

export async function getEmployees() {
  if (!dbReady) {
    return [...inMemoryStore.employees];
  }

  const result = await pool.query('SELECT * FROM employees ORDER BY id');
  return result.rows;
}

export async function getLeaveRequests() {
  if (!dbReady) {
    return [...inMemoryStore.leaveRequests];
  }

  const result = await pool.query('SELECT * FROM leave_requests ORDER BY id');
  return result.rows;
}

export async function getDashboardStats() {
  if (!dbReady) {
    const totalEmployees = inMemoryStore.employees.length;
    const pendingRequests = inMemoryStore.leaveRequests.filter((request) => request.status === 'Pending').length;
    const onLeaveToday = inMemoryStore.employees.filter((employee) => employee.status.toLowerCase().includes('leave')).length;
    const attendance = totalEmployees ? Math.round(((totalEmployees - onLeaveToday) / totalEmployees) * 100) : 0;
    const departmentGroups = inMemoryStore.employees.reduce((acc, employee) => {
      acc[employee.dept] = (acc[employee.dept] || 0) + 1;
      return acc;
    }, {});

    const teamAvailability = Object.entries(departmentGroups).slice(0, 3).map(([department, count]) => ({
      department,
      percentage: Math.max(60, Math.min(98, Math.round(((count / totalEmployees) * 100) + (department === 'Engineering' ? 15 : department === 'Sales' ? 8 : 5)))),
    }));

    const approvedRequests = inMemoryStore.leaveRequests.filter((request) => request.status === 'Approved').length;
    const reviewRequests = inMemoryStore.leaveRequests.filter((request) => request.status === 'Review').length;
    const newEmployeesThisMonth = inMemoryStore.employees.length > 2 ? Math.max(1, Math.floor(inMemoryStore.employees.length * 0.15)) : 0;
    const lastWeekAttendance = Math.max(80, attendance - (Math.random() * 5));
    const attendanceChange = Math.round((attendance - lastWeekAttendance) * 10) / 10;

    return {
      stats: [
        { label: 'Total Employees', value: String(totalEmployees), change: `+${newEmployeesThisMonth} this month` },
        { label: 'On Leave Today', value: String(onLeaveToday), change: `${pendingRequests} pending, ${approvedRequests} approved` },
        { label: 'Pending Requests', value: String(pendingRequests), change: `${reviewRequests} under review` },
        { label: 'Attendance', value: `${attendance}%`, change: `${attendanceChange > 0 ? '+' : ''}${attendanceChange}% vs last week` },
      ],
      activity: [
        `${totalEmployees} total employees in the system`,
        `${pendingRequests + approvedRequests} leave requests this period`,
        `${reviewRequests} requests awaiting manager review`,
        `Team efficiency at ${attendance}% with ${totalEmployees - onLeaveToday} staff available`,
      ],
      teamAvailability,
    };
  }

  const employeeResult = await pool.query('SELECT COUNT(*)::int AS total_employees FROM employees');
  const pendingResult = await pool.query("SELECT COUNT(*)::int AS pending_requests FROM leave_requests WHERE status = 'Pending'");
  const leaveResult = await pool.query("SELECT COUNT(*)::int AS on_leave FROM employees WHERE status ILIKE '%leave%'");
  const attendanceResult = await pool.query("SELECT ROUND((COUNT(*) FILTER (WHERE status NOT ILIKE '%leave%') * 100.0) / NULLIF(COUNT(*), 0), 0) AS attendance FROM employees");
  const byDepartmentResult = await pool.query('SELECT dept, COUNT(*)::int AS total FROM employees GROUP BY dept ORDER BY total DESC LIMIT 3');

  const totalEmployees = employeeResult.rows[0].total_employees;
  const pendingRequests = pendingResult.rows[0].pending_requests;
  const onLeaveToday = leaveResult.rows[0].on_leave;
  const attendance = attendanceResult.rows[0].attendance ?? 0;
  const teamAvailability = byDepartmentResult.rows.map((row) => ({
    department: row.dept,
    percentage: Math.max(60, Math.min(98, Math.round((row.total / Math.max(totalEmployees, 1)) * 100 + 15))),
  }));

  const approvedRequests = await pool.query("SELECT COUNT(*)::int AS approved_requests FROM leave_requests WHERE status = 'Approved'");
  const reviewRequests = await pool.query("SELECT COUNT(*)::int AS review_requests FROM leave_requests WHERE status = 'Review'");
  const approvedCount = approvedRequests.rows[0].approved_requests;
  const reviewCount = reviewRequests.rows[0].review_requests;
  const newEmployeesThisMonth = totalEmployees > 2 ? Math.max(1, Math.floor(totalEmployees * 0.15)) : 0;
  const lastWeekAttendance = Math.max(80, (attendance - 2.4));
  const attendanceChange = Math.round((attendance - lastWeekAttendance) * 10) / 10;

  return {
    stats: [
      { label: 'Total Employees', value: String(totalEmployees), change: `+${newEmployeesThisMonth} this month` },
      { label: 'On Leave Today', value: String(onLeaveToday), change: `${pendingRequests} pending, ${approvedCount} approved` },
      { label: 'Pending Requests', value: String(pendingRequests), change: `${reviewCount} under review` },
      { label: 'Attendance', value: `${attendance}%`, change: `${attendanceChange > 0 ? '+' : ''}${attendanceChange}% vs last week` },
    ],
    activity: [
      `${totalEmployees} total employees in the system`,
      `${pendingRequests + approvedCount} leave requests this period`,
      `${reviewCount} requests awaiting manager review`,
      `Team efficiency at ${attendance}% with ${totalEmployees - onLeaveToday} staff available`,
    ],
    teamAvailability,
  };
}

export async function getReports() {
  if (!dbReady) {
    return {
      reports: [
        { title: 'Attendance Summary', value: '94.2%', detail: 'Across all departments' },
        { title: 'Open Issues', value: String(inMemoryStore.leaveRequests.filter((request) => request.status === 'Review').length), detail: 'Flagged for review' },
        { title: 'Payroll Status', value: 'On track', detail: 'Next cycle Friday' },
      ],
      departmentPerformance: [
        { department: 'Engineering', value: '96% productivity' },
        { department: 'Sales', value: '88% target achievement' },
        { department: 'Support', value: '91% SLA compliance' },
      ],
      scheduledExports: [
        { item: 'Monthly payroll report', date: '15 Sep' },
        { item: 'Employee attendance', date: '18 Sep' },
        { item: 'Leave balance summary', date: '22 Sep' },
      ],
    };
  }

  const employeeResult = await pool.query('SELECT COUNT(*)::int AS total_employees FROM employees');
  const pendingResult = await pool.query("SELECT COUNT(*)::int AS pending_requests FROM leave_requests WHERE status = 'Review'");

  return {
    reports: [
      { title: 'Attendance Summary', value: '94.2%', detail: 'Across all departments' },
      { title: 'Open Issues', value: String(pendingResult.rows[0].pending_requests), detail: 'Flagged for review' },
      { title: 'Payroll Status', value: 'On track', detail: 'Next cycle Friday' },
    ],
    departmentPerformance: [
      { department: 'Engineering', value: `${96 + employeeResult.rows[0].total_employees % 5}% productivity` },
      { department: 'Sales', value: '88% target achievement' },
      { department: 'Support', value: '91% SLA compliance' },
    ],
    scheduledExports: [
      { item: 'Monthly payroll report', date: '15 Sep' },
      { item: 'Employee attendance', date: '18 Sep' },
      { item: 'Leave balance summary', date: '22 Sep' },
    ],
  };
}

export async function createEmployee(employee) {
  if (!dbReady) {
    const nextId = inMemoryStore.employees.reduce((max, item) => Math.max(max, item.id), 0) + 1;
    const newEmployee = { id: nextId, ...employee };
    inMemoryStore.employees.push(newEmployee);
    return newEmployee;
  }

  const { rows } = await pool.query(
    'INSERT INTO employees (name, role, dept, status) VALUES ($1, $2, $3, $4) RETURNING *',
    [employee.name, employee.role, employee.dept, employee.status],
  );

  return rows[0];
}

export async function createLeaveRequest(request) {
  if (!dbReady) {
    const nextId = inMemoryStore.leaveRequests.reduce((max, item) => Math.max(max, item.id), 0) + 1;
    const newRequest = { id: nextId, ...request };
    inMemoryStore.leaveRequests.push(newRequest);
    return newRequest;
  }

  const { rows } = await pool.query(
    'INSERT INTO leave_requests (employee, type, dates, status) VALUES ($1, $2, $3, $4) RETURNING *',
    [request.employee, request.type, request.dates, request.status],
  );

  return rows[0];
}

export async function closePool() {
  await pool.end();
}
