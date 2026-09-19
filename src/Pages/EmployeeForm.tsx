import { useState, type ChangeEvent, type FormEvent } from 'react';
import { postJson } from '../lib/api';

export type EmployeeFormData = {
  name: string;
  role: string;
  dept: string;
  status: string;
};

type Employee = {
  id: number;
  name: string;
  role: string;
  dept: string;
  status: string;
};

const defaultForm: EmployeeFormData = {
  name: '',
  role: '',
  dept: '',
  status: 'Active',
};

type EmployeeFormProps = {
  onCancel: () => void;
  onSuccess: (employee: Employee) => void;
};

export default function EmployeeForm({ onCancel, onSuccess }: EmployeeFormProps) {
  const [formData, setFormData] = useState<EmployeeFormData>(defaultForm);

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formData.name.trim()) return;

    try {
      const newEmployee = await postJson<Employee, EmployeeFormData>('/api/employees', {
        name: formData.name.trim(),
        role: formData.role.trim() || 'Team Member',
        dept: formData.dept.trim() || 'Operations',
        status: formData.status,
      });

      onSuccess(newEmployee);
      // notify dashboard to refresh
      try {
        window.dispatchEvent(new CustomEvent('dashboard:update'));
      } catch {}
      setFormData(defaultForm);
    } catch (error) {
      console.error('Failed to create employee:', error);
      alert(error instanceof Error ? error.message : 'Failed to save employee.');
    }
  };

  return (
    <div className="mini-form-card">
      <h3>Add employee</h3>
      <form onSubmit={handleSubmit} className="mini-form">
        <div className="mini-form-grid">
          <input 
            name="name" 
            value={formData.name} 
            onChange={handleChange} 
            placeholder="Employee name" 
            required 
          />
          <input 
            name="role" 
            value={formData.role} 
            onChange={handleChange} 
            placeholder="Role" 
          />
          <input 
            name="dept" 
            value={formData.dept} 
            onChange={handleChange} 
            placeholder="Department" 
          />
          <select name="status" value={formData.status} onChange={handleChange}>
            <option value="Active">Active</option>
            <option value="On Leave">On Leave</option>
            <option value="In Meeting">In Meeting</option>
          </select>
        </div>

        <div className="mini-form-actions">
          <button type="button" className="secondary-btn" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className="primary-btn">
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
