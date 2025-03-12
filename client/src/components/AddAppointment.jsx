import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../App.css';

// API base URL
const API_URL = 'http://localhost:5000/api';


function AddAppointment() {
    const [appointment, setAppointment] = useState({
      patient_id: '',
      doctor_id: '',
      appointment_date: '',
      appointment_time: '',
      reason: '',
      status: 'scheduled'
    });
    const [patients, setPatients] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [message, setMessage] = useState('');
  
    useEffect(() => {
      async function fetchData() {
        try {
          const [patientsRes, doctorsRes] = await Promise.all([
            axios.get(`${API_URL}/patients`),
            axios.get(`${API_URL}/doctors`)
          ]);
          
          setPatients(patientsRes.data);
          setDoctors(doctorsRes.data);
        } catch (err) {
          console.error('Error fetching data:', err);
        }
      }
      
      fetchData();
    }, []);
  
    const handleChange = (e) => {
      setAppointment({
        ...appointment,
        [e.target.name]: e.target.value
      });
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        // Combine date and time
        const dateTime = new Date(`${appointment.appointment_date}T${appointment.appointment_time}`);
        
        const appointmentData = {
          ...appointment,
          appointment_date: dateTime.toISOString()
        };
        
        delete appointmentData.appointment_time;
        
        await axios.post(`${API_URL}/appointments`, appointmentData);
        setMessage('Appointment scheduled successfully!');
        setAppointment({
          patient_id: '',
          doctor_id: '',
          appointment_date: '',
          appointment_time: '',
          reason: '',
          status: 'scheduled'
        });
      } catch (err) {
        console.error('Error scheduling appointment:', err);
        setMessage('Error scheduling appointment. Please try again.');
      }
    };
  
    return (
      <div className="add-appointment">
        <h2>Schedule New Appointment</h2>
        {message && <div className="message">{message}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Patient:</label>
            <select 
              name="patient_id" 
              value={appointment.patient_id} 
              onChange={handleChange} 
              required
            >
              <option value="">Select Patient</option>
              {patients.map(patient => (
                <option key={patient.id} value={patient.id}>
                  {`${patient.first_name} ${patient.last_name}`}
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label>Doctor:</label>
            <select 
              name="doctor_id" 
              value={appointment.doctor_id} 
              onChange={handleChange} 
              required
            >
              <option value="">Select Doctor</option>
              {doctors.map(doctor => (
                <option key={doctor.id} value={doctor.id}>
                  {`Dr. ${doctor.first_name} ${doctor.last_name} (${doctor.specialization})`}
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label>Date:</label>
            <input 
              type="date" 
              name="appointment_date" 
              value={appointment.appointment_date} 
              onChange={handleChange} 
              required 
            />
          </div>
          
          <div className="form-group">
            <label>Time:</label>
            <input 
              type="time" 
              name="appointment_time" 
              value={appointment.appointment_time} 
              onChange={handleChange} 
              required 
            />
          </div>
          
          <div className="form-group">
            <label>Reason:</label>
            <textarea 
              name="reason" 
              value={appointment.reason} 
              onChange={handleChange} 
              required 
            />
          </div>
          
          <div className="form-group">
            <label>Status:</label>
            <select 
              name="status" 
              value={appointment.status} 
              onChange={handleChange}
            >
              <option value="scheduled">Scheduled</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          
          <button type="submit" className="submit-button">Schedule Appointment</button>
          <Link to="/appointments" className="button secondary">Cancel</Link>
        </form>
      </div>
    );
  }
export default AddAppointment;  