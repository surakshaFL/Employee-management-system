const reports = [
  { title: 'Attendance Summary', value: '94.2%', detail: 'Across all departments' },
  { title: 'Open Issues', value: '09', detail: 'Flagged for review' },
  { title: 'Payroll Status', value: 'On track', detail: 'Next cycle Friday' },
];

export default function Reports() {
  return (
    <section className="page-section">
      <div className="page-header">
        <div>
          <p className="eyebrow">Insights</p>
          <h1>Reports</h1>
        </div>
        <button className="primary-btn">Generate report</button>
      </div>

      <div className="stats-grid">
        {reports.map((report) => (
          <div key={report.title} className="stat-card">
            <span className="stat-label">{report.title}</span>
            <strong>{report.value}</strong>
            <small>{report.detail}</small>
          </div>
        ))}
      </div>

      <div className="content-grid">
        <div className="panel">
          <h3>Department performance</h3>
          <ul className="list">
            <li>Engineering: 96% productivity</li>
            <li>Sales: 88% target achievement</li>
            <li>Support: 91% SLA compliance</li>
          </ul>
        </div>

        <div className="panel">
          <h3>Scheduled exports</h3>
          <ul className="list">
            <li>Monthly payroll report — 15 Sep</li>
            <li>Employee attendance — 18 Sep</li>
            <li>Leave balance summary — 22 Sep</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
