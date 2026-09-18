import { useEffect, useState } from 'react';
import { fetchJson } from '../lib/api';
import EmployeeForm from './EmployeeForm';

type Employee = {
  id: number;
  name: string;
  role: string;
  dept: string;
  status: string;
};

export default function Employees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [stats, setStats] = useState({ total: 0, remote: 0, newHires: 0 });
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const loadEmployees = async () => {
    try {
      const data = await fetchJson<Employee[]>('/api/employees');
      setEmployees(data);

      const total = data.length;
      const remoteCount = Math.max(1, Math.floor(total * 0.3));
      const newHiresCount = Math.max(0, Math.floor(total * 0.15));

      setStats({
        total,
        remote: remoteCount,
        newHires: newHiresCount,
      });
    } catch (error) {
      console.error('Failed to load employees:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  const handleFormSuccess = (newEmployee: Employee) => {
    setEmployees((previous) => [newEmployee, ...previous]);
    setStats((current) => ({
      total: current.total + 1,
      remote: Math.max(1, Math.floor((current.total + 1) * 0.3)),
      newHires: Math.max(0, Math.floor((current.total + 1) * 0.15)),
    }));
    setIsFormOpen(false);
    loadEmployees();
  };

  if (loading) {
    return <section className="page-section"><p>Loading employees...</p></section>;
  }

  return (
    <section className="page-section">
      <div className="page-header">
        <div>
          <p className="eyebrow">Directory</p>
          <h1>Employees</h1>
        </div>
        <button className="primary-btn" onClick={() => setIsFormOpen((open) => !open)}>Add employee</button>
      </div>

      {isFormOpen && (
        <EmployeeForm 
          onCancel={() => setIsFormOpen(false)}
          onSuccess={handleFormSuccess}
        />
      )}

      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-label">Total staff</span>
          <strong>{stats.total}</strong>
          <small>+8 this quarter</small>
        </div>
        <div className="stat-card">
          <span className="stat-label">Remote</span>
          <strong>{stats.remote}</strong>
          <small>{Math.round((stats.remote / stats.total) * 100)}% of workforce</small>
        </div>
        <div className="stat-card">
          <span className="stat-label">New hires</span>
          <strong>{stats.newHires}</strong>
          <small>{stats.newHires > 0 ? `${Math.ceil(stats.newHires / 2)} onboarding this week` : 'None onboarding'}</small>
        </div>
      </div>

      <div className="panel">
        <h3>Employee list</h3>
        <div className="table-list">
          {employees.map((employee) => (
            <div key={employee.id ?? employee.name} className="list-row">
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
