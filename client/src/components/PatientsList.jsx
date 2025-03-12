import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../App.css';

const API_URL = 'http://localhost:5000/api';

// Patients List component
function PatientsList() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(null);
  const [editedPatient, setEditedPatient] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchPatients();
  }, []);

  async function fetchPatients() {
    try {
      const response = await axios.get(`${API_URL}/patients`);
      setPatients(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching patients:', err);
      setLoading(false);
    }
  }

  const handleEditClick = (patient) => {
    setEditMode(patient.id);
    setEditedPatient({ ...patient });
  };

  const handleCancelEdit = () => {
    setEditMode(null);
    setEditedPatient({});
  };

  const handleSaveEdit = async (id) => {
    try {
      await axios.put(`${API_URL}/patients/${id}`, editedPatient);
      setEditMode(null);
      fetchPatients(); // Refresh the list
      
      // Add success message
      const messageElement = document.createElement('div');
      messageElement.className = 'message';
      messageElement.textContent = 'Patient updated successfully';
      
      const patientsListElement = document.querySelector('.patients-list');
      patientsListElement.insertBefore(messageElement, patientsListElement.firstChild);
      
      setTimeout(() => {
        messageElement.remove();
      }, 3000);
    } catch (err) {
      console.error('Error updating patient:', err);
      alert('Failed to update patient: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleDeleteClick = async (id) => {
    
      try {
        await axios.delete(`${API_URL}/patients/${id}`);
        fetchPatients(); // Refresh the list
        
        // Add success message
        const messageElement = document.createElement('div');
        messageElement.className = 'message';
        messageElement.textContent = 'Patient deleted successfully';
        
        const patientsListElement = document.querySelector('.patients-list');
        patientsListElement.insertBefore(messageElement, patientsListElement.firstChild);
        
        setTimeout(() => {
          messageElement.remove();
        }, 3000);
      } catch (err) {
        console.error('Error deleting patient:', err);
        if (err.response?.status === 400) {
          alert('Cannot delete patient with appointments');
        } else {
          alert('Failed to delete patient: ' + (err.response?.data?.error || err.message));
        }
      }
    
  };

  const handleInputChange = (e) => {
    setEditedPatient({
      ...editedPatient,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="patients-list">
      <div className="header-actions">
        <h2>Patients</h2>
        <Link to="/patients/new" className="button">Add New Patient</Link>
      </div>
      
      {loading ? (
        <p>Loading patients...</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Date of Birth</th>
              <th>Gender</th>
              <th>Contact</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {patients.map(patient => (
              <tr key={patient.id}>
                <td>{patient.id}</td>
                <td>
                  {editMode === patient.id ? (
                    <div className="form-group">
                      <input
                        type="text"
                        name="first_name"
                        value={editedPatient.first_name || ''}
                        onChange={handleInputChange}
                        placeholder="First Name"
                      />
                      <input
                        type="text"
                        name="last_name"
                        value={editedPatient.last_name || ''}
                        onChange={handleInputChange}
                        placeholder="Last Name"
                        style={{ marginTop: '8px' }}
                      />
                    </div>
                  ) : (
                    `${patient.first_name} ${patient.last_name}`
                  )}
                </td>
                <td>
                  {editMode === patient.id ? (
                    <div className="form-group">
                      <input
                        type="date"
                        name="date_of_birth"
                        value={editedPatient.date_of_birth ? editedPatient.date_of_birth.substring(0, 10) : ''}
                        onChange={handleInputChange}
                      />
                    </div>
                  ) : (
                    new Date(patient.date_of_birth).toLocaleDateString()
                  )}
                </td>
                <td>
                  {editMode === patient.id ? (
                    <div className="form-group">
                      <select
                        name="gender"
                        value={editedPatient.gender || ''}
                        onChange={handleInputChange}
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  ) : (
                    patient.gender
                  )}
                </td>
                <td>
                  {editMode === patient.id ? (
                    <div className="form-group">
                      <input
                        type="tel"
                        name="phone"
                        value={editedPatient.phone || ''}
                        onChange={handleInputChange}
                        placeholder="Phone"
                      />
                      <input
                        type="email"
                        name="email"
                        value={editedPatient.email || ''}
                        onChange={handleInputChange}
                        placeholder="Email"
                        style={{ marginTop: '8px' }}
                      />
                      <input
                        type="text"
                        name="address"
                        value={editedPatient.address || ''}
                        onChange={handleInputChange}
                        placeholder="Address"
                        style={{ marginTop: '8px' }}
                      />
                    </div>
                  ) : (
                    patient.phone
                  )}
                </td>
                <td className="action-buttons">
                  {editMode === patient.id ? (
                    <>
                      <button 
                        className="save-btn" 
                        onClick={() => handleSaveEdit(patient.id)}
                      >
                        Save
                      </button>
                      <button 
                        className="cancel-btn" 
                        onClick={handleCancelEdit}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button 
                        className="edit-btn" 
                        onClick={() => handleEditClick(patient)}
                      >
                        Edit
                      </button>
                      <button 
                        className="delete-btn" 
                        onClick={() => handleDeleteClick(patient.id)}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default PatientsList;