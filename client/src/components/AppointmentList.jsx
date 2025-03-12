import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../App.css';

const API_URL = 'http://localhost:5000/api';

function AppointmentsList() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(null);
    const [editedAppointment, setEditedAppointment] = useState({});
  
    // Status options - matching the CSS classes in the provided file
    const statusOptions = ['scheduled', 'confirmed', 'completed', 'cancelled', 'no-show'];
  
    useEffect(() => {
      fetchAppointments();
    }, []);
  
    async function fetchAppointments() {
      try {
        const response = await axios.get(`${API_URL}/appointments`);
        setAppointments(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching appointments:', err);
        setLoading(false);
      }
    }
  
    const handleEditClick = (appointment) => {
      setEditMode(appointment.id);
      setEditedAppointment({ ...appointment });
    };
  
    const handleCancelEdit = () => {
      setEditMode(null);
      setEditedAppointment({});
    };
  
    const handleSaveEdit = async (id) => {
      try {
        await axios.put(`${API_URL}/appointments/${id}`, editedAppointment);
        setEditMode(null);
        fetchAppointments(); // Refresh the list
        
        // Using the message style from the CSS
        const messageElement = document.createElement('div');
        messageElement.className = 'message';
        messageElement.textContent = 'Appointment updated successfully';
        
        // Insert the message at the top of the appointments list
        const appointmentsListElement = document.querySelector('.appointments-list');
        appointmentsListElement.insertBefore(messageElement, appointmentsListElement.firstChild);
        
        // Remove the message after 3 seconds
        setTimeout(() => {
          messageElement.remove();
        }, 3000);
      } catch (err) {
        console.error('Error updating appointment:', err);
        alert('Failed to update appointment');
      }
    };
  
    const handleDeleteClick = async (id) => {
      
        try {
          await axios.delete(`${API_URL}/appointments/${id}`);
          fetchAppointments(); // Refresh the list
          
          // Using the message style from the CSS
          const messageElement = document.createElement('div');
          messageElement.className = 'message';
          messageElement.textContent = 'Appointment deleted successfully';
          
          // Insert the message at the top of the appointments list
          const appointmentsListElement = document.querySelector('.appointments-list');
          appointmentsListElement.insertBefore(messageElement, appointmentsListElement.firstChild);
          
          // Remove the message after 3 seconds
          setTimeout(() => {
            messageElement.remove();
          }, 3000);
        } catch (err) {
          console.error('Error deleting appointment:', err);
          alert('Failed to delete appointment');
        }
      
    };
  
    const handleStatusChange = async (id, newStatus) => {
      try {
        await axios.put(`${API_URL}/appointments/${id}/status`, { status: newStatus });
        fetchAppointments(); // Refresh the list
      } catch (err) {
        console.error('Error updating appointment status:', err);
        alert('Failed to update appointment status');
      }
    };
  
    const handleInputChange = (e) => {
      setEditedAppointment({
        ...editedAppointment,
        [e.target.name]: e.target.value
      });
    };
  
    return (
      <div className="appointments-list">
        <div className="header-actions">
          <h2>Appointments</h2>
          <Link to="/appointments/new" className="button">Schedule Appointment</Link>
        </div>
        
        {loading ? (
          <p>Loading appointments...</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Date & Time</th>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map(appointment => (
                <tr key={appointment.id}>
                  <td>
                    {editMode === appointment.id ? (
                      <div className="form-group">
                        <input
                          type="datetime-local"
                          name="appointment_date"
                          value={editedAppointment.appointment_date ? new Date(editedAppointment.appointment_date).toISOString().slice(0, 16) : ''}
                          onChange={handleInputChange}
                        />
                      </div>
                    ) : (
                      new Date(appointment.appointment_date).toLocaleString()
                    )}
                  </td>
                  <td>{`${appointment.patient_first_name} ${appointment.patient_last_name}`}</td>
                  <td>{`Dr. ${appointment.doctor_first_name} ${appointment.doctor_last_name} (${appointment.specialization})`}</td>
                  <td>
                    {editMode === appointment.id ? (
                      <div className="form-group">
                        <input
                          type="text"
                          name="reason"
                          value={editedAppointment.reason || ''}
                          onChange={handleInputChange}
                        />
                      </div>
                    ) : (
                      appointment.reason
                    )}
                  </td>
                  <td>
                    {editMode === appointment.id ? (
                      <div className="form-group">
                        <select
                          name="status"
                          value={editedAppointment.status || ''}
                          onChange={handleInputChange}
                        >
                          {statusOptions.map(status => (
                            <option key={status} value={status}>{status}</option>
                          ))}
                        </select>
                      </div>
                    ) : (
                      <div className="status-selector">
                        <span className={`status-badge ${appointment.status}`}>
                          {appointment.status}
                        </span>
                        <select 
                          className="status-dropdown"
                          value={appointment.status}
                          onChange={(e) => handleStatusChange(appointment.id, e.target.value)}
                        >
                          {statusOptions.map(status => (
                            <option key={status} value={status}>{status}</option>
                          ))}
                        </select>
                      </div>
                    )}
                  </td>
                  <td className="action-buttons">
                    {editMode === appointment.id ? (
                      <>
                        <button 
                          className="save-btn" 
                          onClick={() => handleSaveEdit(appointment.id)}
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
                          onClick={() => handleEditClick(appointment)}
                        >
                          Edit
                        </button>
                        <button 
                          className="delete-btn" 
                          onClick={() => handleDeleteClick(appointment.id)}
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
  export default AppointmentsList;