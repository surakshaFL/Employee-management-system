const employees = [
  { name: 'Ayesha Khan', role: 'HR Manager', dept: 'Human Resources', status: 'Active' },
  { name: 'Rahul Verma', role: 'Senior Developer', dept: 'Engineering', status: 'Working' },
  { name: 'Nisha Patel', role: 'Sales Lead', dept: 'Sales', status: 'In Meeting' },
  { name: 'Imran Ali', role: 'Operations Analyst', dept: 'Operations', status: 'On Leave' },
];

export default function Employees() {
  return (
    <section className="page-section">
      <div className="page-header">
        <div>
          <p className="eyebrow">Directory</p>
          <h1>Employees</h1>
        </div>
        <button className="primary-btn">Add employee</button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-label">Total staff</span>
          <strong>248</strong>
          <small>+8 this quarter</small>
        </div>
        <div className="stat-card">
          <span className="stat-label">Remote</span>
          <strong>72</strong>
          <small>29% of workforce</small>
        </div>
        <div className="stat-card">
          <span className="stat-label">New hires</span>
          <strong>12</strong>
          <small>2 onboarding this week</small>
        </div>
      </div>

      <div className="panel">
        <h3>Employee list</h3>
        <div className="table-list">
          {employees.map((employee) => (
            <div key={employee.name} className="list-row">
              <div>
                <strong>{employee.name}</strong>
                <small>{employee.role}</small>
              </div>
              <span>{employee.dept}</span>
              <span className={`status-pill ${employee.status.toLowerCase().replace(/\s+/g, '-')}`}>
                {employee.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
