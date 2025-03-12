// Create React App installation commands:
// npx create-react-app client
// cd client
// npm install axios react-router-dom

// Then replace src/App.js with this code:

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link} from 'react-router-dom';
import './App.css';
import AddDoctor from './components/AddDoctor';
import EditDoctor from './components/EditDoctor';
import DoctorsList from './components/DoctorsList';
import AppointmentsList from './components/AppointmentList';
import AddPatient from './components/AddPatient';
import PatientsList from './components/PatientsList';
import AddAppointment from './components/AddAppointment';
import Dashboard from './components/Dashboard';
import Footer from './components/Footer';
// API base URL
const API_URL = 'http://localhost:5000/api';

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="navbar">
          <h1>Hospital Management System</h1>
          <div className="nav-links">
            <Link to="/">Dashboard</Link>
            <Link to="/patients">Patients</Link>
            <Link to="/doctors">Doctors</Link>
            <Link to="/appointments">Appointments</Link>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/patients" element={<PatientsList />} />
          <Route path="/patients/new" element={<AddPatient />} />
          <Route path="/doctors" element={<DoctorsList />} />
          <Route path="/doctors/new" element={<AddDoctor />} />
          <Route path="/doctors/edit/:id" element={<EditDoctor />} />
          <Route path="/appointments" element={<AppointmentsList />} />
          <Route path="/appointments/new" element={<AddAppointment />} />
        </Routes>
      </div>
      <Footer/>
    </Router>
  );
}



// Dashboard component

// DoctorsList component





// Add Patient component


// Add Appointment component

export default App;