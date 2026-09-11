CREATE TABLE IF NOT EXISTS employees (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(255) NOT NULL,
  dept VARCHAR(255) NOT NULL,
  status VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS leave_requests (
  id SERIAL PRIMARY KEY,
  employee VARCHAR(255) NOT NULL,
  type VARCHAR(255) NOT NULL,
  dates VARCHAR(255) NOT NULL,
  status VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO employees (name, role, dept, status)
SELECT 'Ayesha Khan', 'HR Manager', 'Human Resources', 'Active'
WHERE NOT EXISTS (SELECT 1 FROM employees WHERE name = 'Ayesha Khan');

INSERT INTO employees (name, role, dept, status)
SELECT 'Rahul Verma', 'Senior Developer', 'Engineering', 'Working'
WHERE NOT EXISTS (SELECT 1 FROM employees WHERE name = 'Rahul Verma');

INSERT INTO employees (name, role, dept, status)
SELECT 'Nisha Patel', 'Sales Lead', 'Sales', 'In Meeting'
WHERE NOT EXISTS (SELECT 1 FROM employees WHERE name = 'Nisha Patel');

INSERT INTO employees (name, role, dept, status)
SELECT 'Imran Ali', 'Operations Analyst', 'Operations', 'On Leave'
WHERE NOT EXISTS (SELECT 1 FROM employees WHERE name = 'Imran Ali');

INSERT INTO leave_requests (employee, type, dates, status)
SELECT 'Aisha Noor', 'Annual Leave', '12 Sep - 15 Sep', 'Pending'
WHERE NOT EXISTS (SELECT 1 FROM leave_requests WHERE employee = 'Aisha Noor' AND dates = '12 Sep - 15 Sep');

INSERT INTO leave_requests (employee, type, dates, status)
SELECT 'Harsh Jain', 'Sick Leave', '09 Sep - 10 Sep', 'Approved'
WHERE NOT EXISTS (SELECT 1 FROM leave_requests WHERE employee = 'Harsh Jain' AND dates = '09 Sep - 10 Sep');

INSERT INTO leave_requests (employee, type, dates, status)
SELECT 'Meera Das', 'Parental Leave', '20 Sep - 30 Sep', 'Review'
WHERE NOT EXISTS (SELECT 1 FROM leave_requests WHERE employee = 'Meera Das' AND dates = '20 Sep - 30 Sep');

INSERT INTO leave_requests (employee, type, dates, status)
SELECT 'Omar Siddiqui', 'Personal Leave', '14 Sep - 14 Sep', 'Rejected'
WHERE NOT EXISTS (SELECT 1 FROM leave_requests WHERE employee = 'Omar Siddiqui' AND dates = '14 Sep - 14 Sep');
