import { useEffect, useState } from 'react';
import { fetchJson } from '../lib/api';

type ReportCard = {
  title: string;
  value: string;
  detail: string;
};

type DepartmentPerformance = {
  department: string;
  value: string;
};

type ScheduledExport = {
  item: string;
  date: string;
};

type ReportsResponse = {
  reports: ReportCard[];
  departmentPerformance: DepartmentPerformance[];
  scheduledExports: ScheduledExport[];
};

export default function Reports() {
  const [reports, setReports] = useState<ReportCard[]>([]);
  const [departmentPerformance, setDepartmentPerformance] = useState<DepartmentPerformance[]>([]);
  const [scheduledExports, setScheduledExports] = useState<ScheduledExport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReports = async () => {
      try {
        const data = await fetchJson<ReportsResponse>('/api/reports');
        setReports(data.reports);
        setDepartmentPerformance(data.departmentPerformance);
        setScheduledExports(data.scheduledExports);
      } catch (error) {
        console.error('Failed to load reports:', error);
      } finally {
        setLoading(false);
      }
    };

    loadReports();
  }, []);

  if (loading) {
    return <section className="page-section"><p>Loading reports...</p></section>;
  }

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
            {departmentPerformance.map((item) => (
              <li key={item.department}>{item.department}: {item.value}</li>
            ))}
          </ul>
        </div>

        <div className="panel">
          <h3>Scheduled exports</h3>
          <ul className="list">
            {scheduledExports.map((item) => (
              <li key={`${item.item}-${item.date}`}>{item.item} — {item.date}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
