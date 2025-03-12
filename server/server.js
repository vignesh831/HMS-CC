const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// PostgreSQL connection
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'hospital_management',
  password: '9908',
  port: 5432,
});

// Initialize database tables if they don't exist
async function initDatabase() {
  try {
    // Create doctors table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS doctors (
        id SERIAL PRIMARY KEY,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        specialization VARCHAR(100) NOT NULL,
        email VARCHAR(100),
        phone VARCHAR(20),
        license_number VARCHAR(50) UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create patients table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS patients (
        id SERIAL PRIMARY KEY,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        date_of_birth DATE NOT NULL,
        gender VARCHAR(10) NOT NULL,
        phone VARCHAR(20),
        email VARCHAR(100),
        address TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create appointments table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS appointments (
        id SERIAL PRIMARY KEY,
        patient_id INTEGER REFERENCES patients(id),
        doctor_id INTEGER REFERENCES doctors(id),
        appointment_date TIMESTAMP NOT NULL,
        reason TEXT,
        status VARCHAR(20) DEFAULT 'scheduled',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    console.log('Database tables initialized');
  } catch (err) {
    console.error('Error initializing database:', err);
  }
}

// Routes

// Get all patients
app.get('/api/patients', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM patients ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get a single patient
app.get('/api/patients/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM patients WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create a patient
app.post('/api/patients', async (req, res) => {
  try {
    const { first_name, last_name, date_of_birth, gender, phone, email, address } = req.body;
    const result = await pool.query(
      'INSERT INTO patients (first_name, last_name, date_of_birth, gender, phone, email, address) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [first_name, last_name, date_of_birth, gender, phone, email, address]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update a patient
app.put('/api/patients/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { first_name, last_name, date_of_birth, gender, phone, email, address } = req.body;
    
    const result = await pool.query(
      'UPDATE patients SET first_name = $1, last_name = $2, date_of_birth = $3, gender = $4, phone = $5, email = $6, address = $7 WHERE id = $8 RETURNING *',
      [first_name, last_name, date_of_birth, gender, phone, email, address, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete a patient
app.delete('/api/patients/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if patient has appointments
    const appointmentCheck = await pool.query('SELECT id FROM appointments WHERE patient_id = $1 LIMIT 1', [id]);
    if (appointmentCheck.rows.length > 0) {
      return res.status(400).json({ error: 'Cannot delete patient with appointments' });
    }
    
    const result = await pool.query('DELETE FROM patients WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    
    res.json({ message: 'Patient deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all doctors
app.get('/api/doctors', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM doctors ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get a single doctor
app.get('/api/doctors/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM doctors WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Doctor not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create a doctor
app.post('/api/doctors', async (req, res) => {
  try {
    const { first_name, last_name, specialization, email, phone, license_number } = req.body;
    const result = await pool.query(
      'INSERT INTO doctors (first_name, last_name, specialization, email, phone, license_number) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [first_name, last_name, specialization, email, phone, license_number]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update a doctor
app.put('/api/doctors/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { first_name, last_name, specialization, email, phone, license_number } = req.body;
    
    const result = await pool.query(
      'UPDATE doctors SET first_name = $1, last_name = $2, specialization = $3, email = $4, phone = $5, license_number = $6 WHERE id = $7 RETURNING *',
      [first_name, last_name, specialization, email, phone, license_number, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Doctor not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete a doctor
app.delete('/api/doctors/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if doctor has appointments
    const appointmentCheck = await pool.query('SELECT id FROM appointments WHERE doctor_id = $1 LIMIT 1', [id]);
    if (appointmentCheck.rows.length > 0) {
      return res.status(400).json({ error: 'Cannot delete doctor with appointments' });
    }
    
    const result = await pool.query('DELETE FROM doctors WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Doctor not found' });
    }
    
    res.json({ message: 'Doctor deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all appointments
app.get('/api/appointments', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT a.*, 
             p.first_name as patient_first_name, p.last_name as patient_last_name,
             d.first_name as doctor_first_name, d.last_name as doctor_last_name, d.specialization
      FROM appointments a
      JOIN patients p ON a.patient_id = p.id
      JOIN doctors d ON a.doctor_id = d.id
      ORDER BY appointment_date DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get a single appointment
app.get('/api/appointments/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`
      SELECT a.*, 
             p.first_name as patient_first_name, p.last_name as patient_last_name,
             d.first_name as doctor_first_name, d.last_name as doctor_last_name, d.specialization
      FROM appointments a
      JOIN patients p ON a.patient_id = p.id
      JOIN doctors d ON a.doctor_id = d.id
      WHERE a.id = $1
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create an appointment
app.post('/api/appointments', async (req, res) => {
  try {
    const { patient_id, doctor_id, appointment_date, reason, status } = req.body;
    const result = await pool.query(
      'INSERT INTO appointments (patient_id, doctor_id, appointment_date, reason, status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [patient_id, doctor_id, appointment_date, reason, status || 'scheduled']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

//update appointment status
// Update only the status of an appointment
app.put('/api/appointments/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Ensure status is provided
    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const result = await pool.query(
      'UPDATE appointments SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating appointment status:', err);
    res.status(500).json({ error: 'Server error' });
  }
});


// Update an appointment
app.put('/api/appointments/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { patient_id, doctor_id, appointment_date, reason, status } = req.body;
    
    const result = await pool.query(
      'UPDATE appointments SET patient_id = $1, doctor_id = $2, appointment_date = $3, reason = $4, status = $5 WHERE id = $6 RETURNING *',
      [patient_id, doctor_id, appointment_date, reason, status, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete an appointment
app.delete('/api/appointments/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM appointments WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    
    res.json({ message: 'Appointment deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Initialize database before starting server
initDatabase().then(() => {
  // Start the server
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});