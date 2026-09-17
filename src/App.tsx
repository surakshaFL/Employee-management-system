import { NavLink, Route, Routes } from "react-router-dom";
import Dashboard from "./Pages/Dashboard.tsx";
import Employees from "./Pages/Employees.tsx";
import LeaveRequests from "./Pages/LeaveRequests.tsx";
import Reports from "./Pages/Reports.tsx";
import "./App.css";

function App() {
  return (
    <>
      <header className="app-header">
        <div className="header-inner">
          <div className="brand-wrap">
            <div className="brand-mark">HR</div>
            <div>
              <p className="brand-label">Employee Portal</p>
              <h2>PeopleOps</h2>
            </div>
          </div>

          <nav aria-label="Main navigation">
            <ul className="nav-list">
              <li><NavLink to="/" end>Dashboard</NavLink></li>
              <li><NavLink to="/employees">Employees</NavLink></li>
              <li><NavLink to="/leave-requests">Leave Requests</NavLink></li>
              <li><NavLink to="/reports">Reports</NavLink></li>
            </ul>
          </nav>
        </div>
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
