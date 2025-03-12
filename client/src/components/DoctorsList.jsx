import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {useEffect } from 'react';
import '../App.css';

const API_URL = 'http://localhost:5000/api';
function DoctorsList() {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
  
    const fetchDoctors = async () => {
      try {
        const response = await axios.get(`${API_URL}/doctors`);
        setDoctors(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching doctors:', err);
        setLoading(false);
      }
    };
  
    useEffect(() => {
      fetchDoctors();
    }, []);
  
    const handleDelete = async (id) => {
        try {
          await axios.delete(`${API_URL}/doctors/${id}`);
          // Refresh the list
          fetchDoctors();
        } catch (err) {
          console.error('Error deleting doctor:', err);
          alert('Failed to delete doctor. They may have appointments scheduled.');
        }
      
    };
  
    return (
      <div className="doctors-list">
        <div className="header-actions">
          <h2>Doctors</h2>
          <Link to="/doctors/new" className="button">Add New Doctor</Link>
        </div>
        
        {loading ? (
          <p>Loading doctors...</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Specialization</th>
                <th>Contact</th>
                <th>License Number</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {doctors.map(doctor => (
                <tr key={doctor.id}>
                  <td>{doctor.id}</td>
                  <td>{`Dr. ${doctor.first_name} ${doctor.last_name}`}</td>
                  <td>{doctor.specialization}</td>
                  <td>{doctor.phone}</td>
                  <td>{doctor.license_number}</td>
                  <td className="action-buttons">
                    <button 
                      className="edit-btn" 
                      onClick={() => navigate(`/doctors/edit/${doctor.id}`)}
                    >
                      Edit
                    </button>
                    <button 
                      className="delete-btn"
                      onClick={() => handleDelete(doctor.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    );
  }

  export default DoctorsList;