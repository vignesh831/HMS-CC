import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../App.css';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const Dashboard = () => {
  // States for fetched data
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [timeRange, setTimeRange] = useState("weekly");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // API base URL
  const API_URL = "http://localhost:5000/api";

  // Fetch data from the backend
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch all data in parallel
        const [doctorsRes, patientsRes, appointmentsRes] = await Promise.all([
          fetch(`${API_URL}/doctors`),
          fetch(`${API_URL}/patients`),
          fetch(`${API_URL}/appointments`),
        ]);

        // Check for fetch errors
        if (!doctorsRes.ok) throw new Error("Failed to fetch doctors");
        if (!patientsRes.ok) throw new Error("Failed to fetch patients");
        if (!appointmentsRes.ok)
          throw new Error("Failed to fetch appointments");

        // Parse JSON responses
        const doctorsData = await doctorsRes.json();
        const patientsData = await patientsRes.json();
        const appointmentsData = await appointmentsRes.json();

        // Update state with fetched data
        setDoctors(doctorsData);
        setPatients(patientsData);
        setAppointments(appointmentsData);
        setError(null);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load dashboard data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Generate statistics for patient trends based on appointments data
  const generatePatientTrendsData = () => {
    // If no appointments data, return empty arrays
    if (!appointments.length) return { daily: [], weekly: [], monthly: [] };

    // Sort appointments by date
    const sortedAppointments = [...appointments].sort(
      (a, b) => new Date(a.appointment_date) - new Date(b.appointment_date)
    );

    // Get the date boundaries
    const now = new Date();
    const oneWeekAgo = new Date(now);
    oneWeekAgo.setDate(now.getDate() - 7);

    const oneMonthAgo = new Date(now);
    oneMonthAgo.setMonth(now.getMonth() - 1);

    // Generate daily data for the past week
    const dailyData = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(now.getDate() - i);

      const dayStr = date.toLocaleDateString("en-US", { weekday: "short" });
      const dateStr = date.toISOString().split("T")[0];

      // Count appointments for this day
      const admitted = appointments.filter(
        (a) =>
          a.appointment_date.split("T")[0] === dateStr &&
          a.status === "confirmed"
      ).length;

      const discharged = appointments.filter(
        (a) =>
          a.appointment_date.split("T")[0] === dateStr &&
          a.status === "completed"
      ).length;

      const emergency = appointments.filter(
        (a) =>
          a.appointment_date.split("T")[0] === dateStr &&
          a.reason?.toLowerCase().includes("emergency")
      ).length;

      dailyData.push({ name: dayStr, admitted, discharged, emergency });
    }

    // Generate weekly data for the past month
    const weeklyData = [];
    for (let i = 3; i >= 0; i--) {
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - (i * 7 + 6));
      const weekEnd = new Date(now);
      weekEnd.setDate(now.getDate() - i * 7);

      const weekLabel = `Week ${i + 1}`;

      // Count appointments for this week
      const admitted = appointments.filter((a) => {
        const appDate = new Date(a.appointment_date);
        return (
          appDate >= weekStart && appDate <= weekEnd && a.status === "confirmed"
        );
      }).length;

      const discharged = appointments.filter((a) => {
        const appDate = new Date(a.appointment_date);
        return (
          appDate >= weekStart && appDate <= weekEnd && a.status === "completed"
        );
      }).length;

      const emergency = appointments.filter((a) => {
        const appDate = new Date(a.appointment_date);
        return (
          appDate >= weekStart &&
          appDate <= weekEnd &&
          a.reason?.toLowerCase().includes("emergency")
        );
      }).length;

      weeklyData.push({ name: weekLabel, admitted, discharged, emergency });
    }

    // Generate monthly data for the past 6 months
    const monthlyData = [];
    for (let i = 5; i >= 0; i--) {
      const monthDate = new Date(now);
      monthDate.setMonth(now.getMonth() - i);

      const monthStr = monthDate.toLocaleDateString("en-US", {
        month: "short",
      });

      // Count appointments for this month
      const admitted = appointments.filter((a) => {
        const appDate = new Date(a.appointment_date);
        return (
          appDate.getMonth() === monthDate.getMonth() &&
          appDate.getFullYear() === monthDate.getFullYear() &&
          a.status === "confirmed"
        );
      }).length;

      const discharged = appointments.filter((a) => {
        const appDate = new Date(a.appointment_date);
        return (
          appDate.getMonth() === monthDate.getMonth() &&
          appDate.getFullYear() === monthDate.getFullYear() &&
          a.status === "completed"
        );
      }).length;

      const emergency = appointments.filter((a) => {
        const appDate = new Date(a.appointment_date);
        return (
          appDate.getMonth() === monthDate.getMonth() &&
          appDate.getFullYear() === monthDate.getFullYear() &&
          a.reason?.toLowerCase().includes("emergency")
        );
      }).length;

      monthlyData.push({ name: monthStr, admitted, discharged, emergency });
    }

    return { daily: dailyData, weekly: weeklyData, monthly: monthlyData };
  };

  // Generate department-wise data based on doctors' specializations
  const generateDepartmentData = () => {
    if (!doctors.length || !appointments.length) return [];

    // Count doctors by specialization
    const specializations = {};
    doctors.forEach((doctor) => {
      if (!specializations[doctor.specialization]) {
        specializations[doctor.specialization] = {
          name: doctor.specialization,
          doctors: 0,
          patients: 0,
        };
      }
      specializations[doctor.specialization].doctors++;
    });

    // Count patients by doctor specialization
    appointments.forEach((appointment) => {
      const doctor = doctors.find((d) => d.id === appointment.doctor_id);
      if (doctor && specializations[doctor.specialization]) {
        specializations[doctor.specialization].patients++;
      }
    });

    return Object.values(specializations);
  };

  // Get patient trends data
  const patientTrendsData = generatePatientTrendsData();

  // Get department data
  const departmentData = generateDepartmentData();

  // Get today's appointments
  const getTodayAppointments = () => {
    const today = new Date().toISOString().split("T")[0];
    return appointments.filter(
      (a) => a.appointment_date.split("T")[0] === today
    );
  };

  // Get recent appointments to display in the table
  const getRecentAppointments = () => {
    return [...appointments]
      .sort(
        (a, b) => new Date(b.appointment_date) - new Date(a.appointment_date)
      )
      .slice(0, 5);
  };

  // Format appointment date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Format appointment time for display
  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="dashboard">
        <h2>Loading dashboard data...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard">
        <div
          className="message"
          style={{
            backgroundColor: "#ffebee",
            color: "#c62828",
            borderLeftColor: "#c62828",
          }}
        >
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="header-actions">
        <h2>Hospital Dashboard</h2>
        <div>
          <button
            className={`button ${timeRange === "daily" ? "" : "secondary"}`}
            onClick={() => setTimeRange("daily")}
          >
            Daily
          </button>
          <button
            className={`button ${timeRange === "weekly" ? "" : "secondary"}`}
            onClick={() => setTimeRange("weekly")}
          >
            Weekly
          </button>
          <button
            className={`button ${timeRange === "monthly" ? "" : "secondary"}`}
            onClick={() => setTimeRange("monthly")}
          >
            Monthly
          </button>
        </div>
      </div>

      {/* Stats summary cards */}
      <div className="stats-container">
        <div className="stat-card">
          <h3>Total Patients</h3>
          <div className="stat-number">{patients.length}</div>
          <a href="/patients" className="view-link">
            View all patients
          </a>
        </div>
        <div className="stat-card">
          <h3>Today's Appointments</h3>
          <div className="stat-number">{getTodayAppointments().length}</div>
          <a href="/appointments" className="view-link">
            View appointments
          </a>
        </div>
        <div className="stat-card">
          <h3>Available Doctors</h3>
          <div className="stat-number">{doctors.length}</div>
          <a href="/doctors" className="view-link">
            View doctors
          </a>
        </div>
      </div>

      {/* Patient trends graph */}
      <div
  className="stat-card"
  style={{ marginTop: "1.5rem", padding: "1.5rem" }}
>
  <h3>Patient Trends - Admissions & Discharges</h3>
  <ResponsiveContainer width="100%" height={300}>
    <BarChart
      data={patientTrendsData[timeRange]}
      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar 
        dataKey="admitted" 
        name="Admitted" 
        fill="#1a73e8" 
        radius={[4, 4, 0, 0]}
      />
      <Bar 
        dataKey="discharged" 
        name="Discharged" 
        fill="#2e7d32" 
        radius={[4, 4, 0, 0]}
      />
    </BarChart>
  </ResponsiveContainer>
</div>

      {/* Department-wise patient load */}
      <div
        className="stat-card"
        style={{ marginTop: "1.5rem", padding: "1.5rem" }}
      >
        <h3>Department-wise Patient Load</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={departmentData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="patients" fill="#1a73e8" name="Patients" />
            <Bar dataKey="doctors" fill="#2e7d32" name="Doctors" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Recent appointments table */}
      <div style={{ marginTop: "1.5rem" }}>
        <h3 style={{ marginBottom: "1rem" }}>Recent Appointments</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>Patient</th>
              <th>Doctor</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {getRecentAppointments().map((appointment) => (
              <tr key={appointment.id}>
                <td>{`${appointment.patient_first_name || ""} ${
                  appointment.patient_last_name || ""
                }`}</td>
                <td>{`Dr. ${appointment.doctor_first_name || ""} ${
                  appointment.doctor_last_name || ""
                }`}</td>
                <td>{formatDate(appointment.appointment_date)}</td>
                <td>{formatTime(appointment.appointment_date)}</td>
                <td>
                  <span
                    className={`status-badge ${appointment.status.toLowerCase()}`}
                  >
                    {appointment.status.charAt(0).toUpperCase() +
                      appointment.status.slice(1)}
                  </span>
                </td>
              </tr>
            ))}
            {getRecentAppointments().length === 0 && (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>
                  No recent appointments
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
