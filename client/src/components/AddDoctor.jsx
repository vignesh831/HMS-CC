import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../App.css';

// API base URL
const API_URL = 'http://localhost:5000/api';

function AddDoctor() {
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState({
    first_name: '',
    last_name: '',
    specialization: '',
    email: '',
    phone: '',
    license_number: ''
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setDoctor({
      ...doctor,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/doctors`, doctor);
      setMessage('Doctor added successfully!');
      // Reset form
      setDoctor({
        first_name: '',
        last_name: '',
        specialization: '',
        email: '',
        phone: '',
        license_number: ''
      });
      // Optionally redirect after success
      // navigate('/doctors');
    } catch (err) {
      console.error('Error adding doctor:', err);
      setMessage('Error adding doctor. Please try again.');
    }
  };

  return (
    <div className="add-doctor">
      <h2>Add New Doctor</h2>
      {message && <div className="message">{message}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>First Name:</label>
          <input 
            type="text" 
            name="first_name" 
            value={doctor.first_name} 
            onChange={handleChange} 
            required 
          />
        </div>
        
        <div className="form-group">
          <label>Last Name:</label>
          <input 
            type="text" 
            name="last_name" 
            value={doctor.last_name} 
            onChange={handleChange} 
            required 
          />
        </div>
        
        <div className="form-group">
          <label>Specialization:</label>
          <input 
            type="text" 
            name="specialization" 
            value={doctor.specialization} 
            onChange={handleChange} 
            required 
          />
        </div>
        
        <div className="form-group">
          <label>Email:</label>
          <input 
            type="email" 
            name="email" 
            value={doctor.email} 
            onChange={handleChange} 
          />
        </div>
        
        <div className="form-group">
          <label>Phone:</label>
          <input 
            type="text" 
            name="phone" 
            value={doctor.phone} 
            onChange={handleChange} 
          />
        </div>
        
        <div className="form-group">
          <label>License Number:</label>
          <input 
            type="text" 
            name="license_number" 
            value={doctor.license_number} 
            onChange={handleChange} 
            required 
          />
        </div>
        
        <button type="submit" className="submit-button">Add Doctor</button>
        <Link to="/doctors" className="button secondary">Cancel</Link>
      </form>
    </div>
  );
}

export default AddDoctor;