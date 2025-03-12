import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {useEffect } from 'react';
import '../App.css';


// API base URL
const API_URL = 'http://localhost:5000/api';


// EditDoctor component
function EditDoctor() {
    const [doctor, setDoctor] = useState({
      first_name: '',
      last_name: '',
      specialization: '',
      email: '',
      phone: '',
      license_number: ''
    });
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const id = window.location.pathname.split('/').pop();
  
    useEffect(() => {
      async function fetchDoctor() {
        try {
          const response = await axios.get(`${API_URL}/doctors/${id}`);
          setDoctor(response.data);
          setLoading(false);
        } catch (err) {
          console.error('Error fetching doctor:', err);
          setMessage('Error loading doctor details.');
          setLoading(false);
        }
      }
      
      fetchDoctor();
    }, [id]);
  
    const handleChange = (e) => {
      setDoctor({
        ...doctor,
        [e.target.name]: e.target.value
      });
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        await axios.put(`${API_URL}/doctors/${id}`, doctor);
        setMessage('Doctor updated successfully!');
        setTimeout(() => navigate('/doctors'), 1500);
      } catch (err) {
        console.error('Error updating doctor:', err);
        setMessage('Error updating doctor. Please try again.');
      }
    };
  
    if (loading) {
      return <p>Loading doctor details...</p>;
    }
  
    return (
        <div className="edit-doctor">
        <h2>Edit Doctor</h2>
        {message && <div className="message">{message}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>First Name:</label>
            <input type="text" name="first_name" value={doctor.first_name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Last Name:</label>
            <input type="text" name="last_name" value={doctor.last_name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Specialization:</label>
            <input type="text" name="specialization" value={doctor.specialization} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Email:</label>
            <input type="email" name="email" value={doctor.email || ''} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Phone:</label>
            <input type="text" name="phone" value={doctor.phone || ''} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>License Number:</label>
            <input type="text" name="license_number" value={doctor.license_number} onChange={handleChange} required />
          </div>
          <button type="submit" className="submit-button">Update Doctor</button>
          <Link to="/doctors" className="button secondary">Cancel</Link>
        </form>
      </div>
      
    );
  }
  export default EditDoctor;