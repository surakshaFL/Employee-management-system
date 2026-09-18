import { useEffect, useState } from 'react';
import { fetchJson } from '../lib/api';
import LeaveRequestForm from './LeaveRequestForm';

type LeaveRequest = {
  id: number;
  employee: string;
  type: string;
  dates: string;
  status: string;
};

export default function LeaveRequests() {
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const loadLeaveRequests = async () => {
    try {
      const data = await fetchJson<LeaveRequest[]>('/api/leave-requests');
      setRequests(data);
    } catch (error) {
      console.error('Failed to load leave requests:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeaveRequests();
  }, []);

  const pendingCount = requests.filter((request) => request.status === 'Pending').length;
  const approvedCount = requests.filter((request) => request.status === 'Approved').length;
  const utilization = requests.length ? Math.min(100, Math.round((approvedCount / requests.length) * 100)) : 0;

  const handleFormSuccess = (newRequest: LeaveRequest) => {
    setRequests((previous) => [newRequest, ...previous]);
    setIsFormOpen(false);
    loadLeaveRequests();
  };

  if (loading) {
    return <section className="page-section"><p>Loading leave requests...</p></section>;
  }

  return (
    <section className="page-section">
      <div className="page-header">
        <div>
          <p className="eyebrow">HR workflow</p>
          <h1>Leave Requests</h1>
        </div>
        <button className="primary-btn" onClick={() => setIsFormOpen((open) => !open)}>New request</button>
      </div>

      {isFormOpen && (
        <LeaveRequestForm
          onCancel={() => setIsFormOpen(false)}
          onSuccess={handleFormSuccess}
        />
      )}

      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-label">Pending</span>
          <strong>{pendingCount}</strong>
          <small>Needs approval</small>
        </div>
        <div className="stat-card">
          <span className="stat-label">Approved</span>
          <strong>{approvedCount}</strong>
          <small>This month</small>
        </div>
        <div className="stat-card">
          <span className="stat-label">Utilized</span>
          <strong>{utilization}%</strong>
          <small>Based on approvals</small>
        </div>
      </div>

      <div className="panel">
        <h3>Latest requests</h3>
        <div className="table-list">
          {requests.map((request) => (
            <div key={`${request.id ?? request.employee}-${request.dates}`} className="list-row">
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
