import { useEffect, useState } from 'react';
import { fetchJson } from '../lib/api';

type DashboardStats = {
  label: string;
  value: string;
  change: string;
};

type TeamAvailability = {
  department: string;
  percentage: number;
};

type DashboardResponse = {
  stats: DashboardStats[];
  activity: string[];
  teamAvailability: TeamAvailability[];
};

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats[]>([]);
  const [activity, setActivity] = useState<string[]>([]);
  const [teamAvailability, setTeamAvailability] = useState<TeamAvailability[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const data = await fetchJson<DashboardResponse>('/api/dashboard');
        setStats(data.stats);
        setActivity(data.activity);
        setTeamAvailability(data.teamAvailability || []);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const handleExportReport = () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      stats,
      activity,
      teamAvailability,
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json',
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'dashboard-report.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return <section className="page-section"><p>Loading dashboard...</p></section>;
  }

  return (
    <section className="page-section">
      <div className="page-header">
        <div>
          <p className="eyebrow">Overview</p>
          <h1>Dashboard</h1>
        </div>
        <button className="primary-btn" onClick={handleExportReport}>Export report</button>
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
          {teamAvailability.length > 0 ? (
            teamAvailability.map((team) => (
              <div key={team.department} className="mini-metric">
                <span>{team.department}</span>
                <div className="progress"><i style={{ width: `${team.percentage}%` }} /></div>
                <b>{team.percentage}%</b>
              </div>
            ))
          ) : (
            <p>No team data available.</p>
          )}
        </div>
      </div>
    </section>
  );
}

