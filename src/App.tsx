import { Link, Route, Routes } from "react-router-dom";
import Dashboard from "./Pages/Dashboard.tsx";
import Employees from "./Pages/Employees.tsx";
import LeaveRequests from "./Pages/LeaveRequests.tsx";
import Reports from "./Pages/Reports.tsx";
import "./App.css";

function App() {
  return (
    <>
      <header className="app-header">
        <nav>
          <ul className="nav-list">
            <li><Link to="/">Dashboard</Link></li>
            <li><Link to="/employees">Employees</Link></li>
            <li><Link to="/leave-requests">Leave Requests</Link></li>
            <li><Link to="/reports">Reports</Link></li>
          </ul>
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/employees" element={<Employees />} />
          <Route path="/leave-requests" element={<LeaveRequests />} />
          <Route path="/reports" element={<Reports />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
