import { useState, type ChangeEvent, type FormEvent } from 'react';
import { postJson } from '../lib/api';

type FormValues = {
  employee: string;
  type: string;
  dates: string;
  status: string;
};

type LeaveRequest = {
  id: number;
  employee: string;
  type: string;
  dates: string;
  status: string;
};

const defaultForm: FormValues = {
  employee: '',
  type: 'Annual Leave',
  dates: '',
  status: 'Pending',
};

type Props = {
  onCancel: () => void;
  onSuccess: (data: LeaveRequest) => void;
};

export default function LeaveRequestForm({ onCancel, onSuccess }: Props) {
  const [formData, setFormData] = useState<FormValues>(defaultForm);

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formData.employee.trim()) return;

    try {
      const newRequest = await postJson<LeaveRequest, FormValues>('/api/leave-requests', {
        employee: formData.employee.trim(),
        type: formData.type.trim() || 'Annual Leave',
        dates: formData.dates.trim() || '2026-09-20 to 2026-09-24',
        status: formData.status,
      });

      onSuccess(newRequest);
      // notify dashboard to refresh
      try {
        window.dispatchEvent(new CustomEvent('dashboard:update'));
      } catch {}
      setFormData(defaultForm);
    } catch (error) {
      console.error('Failed to create leave request:', error);
      alert(error instanceof Error ? error.message : 'Failed to save leave request.');
    }
  };

  return (
    <div className="mini-form-card">
      <h3>New request</h3>
      <form onSubmit={handleSubmit} className="mini-form">
        <div className="mini-form-grid">
          <input name="employee" value={formData.employee} onChange={handleChange} placeholder="Employee name" required />
          <input name="type" value={formData.type} onChange={handleChange} placeholder="Leave type" />
          <input name="dates" value={formData.dates} onChange={handleChange} placeholder="Dates e.g. 2026-09-20 to 2026-09-24" />
          <select name="status" value={formData.status} onChange={handleChange}>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        <div className="mini-form-actions">
          <button type="button" className="secondary-btn" onClick={onCancel}>Cancel</button>
          <button type="submit" className="primary-btn">Save</button>
        </div>
      </form>
    </div>
  );
}
