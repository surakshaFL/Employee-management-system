const stats = [
  { label: 'Total Employees', value: '248', change: '+12 this month' },
  { label: 'On Leave Today', value: '18', change: '4 urgent' },
  { label: 'Pending Requests', value: '14', change: '8 awaiting review' },
  { label: 'Attendance', value: '94%', change: '+2.4% vs last week' },
];

const activity = [
  'New onboarding for 5 employees started',
  'Marketing team attendance improved this week',
  '3 leave requests need manager approval',
  'Monthly salary cycle scheduled for Friday',
];

export default function Dashboard() {
  return (
    <section className="page-section">
      <div className="page-header">
        <div>
          <p className="eyebrow">Overview</p>
          <h1>Dashboard</h1>
        </div>
        <button className="primary-btn">Export report</button>
      </div>

      <div className="stats-grid">
        {stats.map((item) => (
          <div key={item.label} className="stat-card">
            <span className="stat-label">{item.label}</span>
            <strong>{item.value}</strong>
            <small>{item.change}</small>
          </div>
        ))}
      </div>

      <div className="content-grid">
        <div className="panel">
          <h3>Recent activity</h3>
          <ul className="list">
            {activity.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="panel">
          <h3>Team availability</h3>
          <div className="mini-metric">
            <span>HR</span>
            <div className="progress"><i style={{ width: '86%' }} /></div>
            <b>86%</b>
          </div>
          <div className="mini-metric">
            <span>Engineering</span>
            <div className="progress"><i style={{ width: '92%' }} /></div>
            <b>92%</b>
          </div>
          <div className="mini-metric">
            <span>Support</span>
            <div className="progress"><i style={{ width: '79%' }} /></div>
            <b>79%</b>
          </div>
        </div>
      </div>
    </section>
  );
}

