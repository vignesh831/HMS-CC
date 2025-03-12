import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../App.css';

// API base URL
const API_URL = 'http://localhost:5000/api';

function AddPatient() {
    const [patient, setPatient] = useState({
      first_name: '',
      last_name: '',
      date_of_birth: '',
      gender: '',
      phone: '',
      email: '',
      address: ''
    });
    const [message, setMessage] = useState('');
  
    const handleChange = (e) => {
      setPatient({
        ...patient,
        [e.target.name]: e.target.value
      });
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        await axios.post(`${API_URL}/patients`, patient);
        setMessage('Patient added successfully!');
        setPatient({
          first_name: '',
          last_name: '',
          date_of_birth: '',
          gender: '',
          phone: '',
          email: '',
          address: ''
        });
      } catch (err) {
        console.error('Error adding patient:', err);
        setMessage('Error adding patient. Please try again.');
      }
    };
  
    return (
      <div className="add-patient">
        <h2>Add New Patient</h2>
        {message && <div className="message">{message}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>First Name:</label>
            <input 
              type="text" 
              name="first_name" 
              value={patient.first_name} 
              onChange={handleChange} 
              required 
            />
          </div>
          
          <div className="form-group">
            <label>Last Name:</label>
            <input 
              type="text" 
              name="last_name" 
              value={patient.last_name} 
              onChange={handleChange} 
              required 
            />
          </div>
          
          <div className="form-group">
            <label>Date of Birth:</label>
            <input 
              type="date" 
              name="date_of_birth" 
              value={patient.date_of_birth} 
              onChange={handleChange} 
              required 
            />
          </div>
          
          <div className="form-group">
            <label>Gender:</label>
            <select name="gender" value={patient.gender} onChange={handleChange} required>
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>Phone:</label>
            <input 
              type="text" 
              name="phone" 
              value={patient.phone} 
              onChange={handleChange} 
            />
          </div>
          
          <div className="form-group">
            <label>Email:</label>
            <input 
              type="email" 
              name="email" 
              value={patient.email} 
              onChange={handleChange} 
            />
          </div>
          
          <div className="form-group">
            <label>Address:</label>
            <textarea 
              name="address" 
              value={patient.address} 
              onChange={handleChange} 
            />
          </div>
          
          <button type="submit" className="submit-button">Add Patient</button>
          <Link to="/patients" className="button secondary">Cancel</Link>
        </form>
      </div>
    );
  }

  export default AddPatient;