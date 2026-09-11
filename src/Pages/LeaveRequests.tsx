const requests = [
  { employee: 'Aisha Noor', type: 'Annual Leave', dates: '12 Sep - 15 Sep', status: 'Pending' },
  { employee: 'Harsh Jain', type: 'Sick Leave', dates: '09 Sep - 10 Sep', status: 'Approved' },
  { employee: 'Meera Das', type: 'Parental Leave', dates: '20 Sep - 30 Sep', status: 'Review' },
  { employee: 'Omar Siddiqui', type: 'Personal Leave', dates: '14 Sep - 14 Sep', status: 'Rejected' },
];

export default function LeaveRequests() {
  return (
    <section className="page-section">
      <div className="page-header">
        <div>
          <p className="eyebrow">HR workflow</p>
          <h1>Leave Requests</h1>
        </div>
        <button className="primary-btn">New request</button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-label">Pending</span>
          <strong>14</strong>
          <small>Needs approval</small>
        </div>
        <div className="stat-card">
          <span className="stat-label">Approved</span>
          <strong>26</strong>
          <small>This month</small>
        </div>
        <div className="stat-card">
          <span className="stat-label">Utilized</span>
          <strong>78%</strong>
          <small>Annual quota</small>
        </div>
      </div>

      <div className="panel">
        <h3>Latest requests</h3>
        <div className="table-list">
          {requests.map((request) => (
            <div key={`${request.employee}-${request.dates}`} className="list-row">
              <div>
                <strong>{request.employee}</strong>
                <small>{request.type}</small>
              </div>
              <span>{request.dates}</span>
              <span className={`status-pill ${request.status.toLowerCase()}`}>
                {request.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
