-- Create database (run this separately)
-- CREATE DATABASE hospital_management;

-- Patient table
CREATE TABLE patients (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  date_of_birth DATE NOT NULL,
  gender VARCHAR(10),
  phone VARCHAR(20),
  email VARCHAR(100),
  address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Doctor table
CREATE TABLE doctors (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  specialization VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  email VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Appointment table
CREATE TABLE appointments (
  id SERIAL PRIMARY KEY,
  patient_id INTEGER REFERENCES patients(id) ON DELETE CASCADE,
  doctor_id INTEGER REFERENCES doctors(id) ON DELETE CASCADE,
  appointment_date TIMESTAMP NOT NULL,
  reason TEXT,
  status VARCHAR(20) DEFAULT 'scheduled',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert some sample data
INSERT INTO patients (first_name, last_name, date_of_birth, gender, phone, email, address)
VALUES 
  ('John', 'Doe', '1985-05-15', 'Male', '555-123-4567', 'john.doe@email.com', '123 Main St'),
  ('Jane', 'Smith', '1990-08-22', 'Female', '555-987-6543', 'jane.smith@email.com', '456 Oak Ave'),
  ('Robert', 'Johnson', '1978-11-30', 'Male', '555-456-7890', 'robert.j@email.com', '789 Pine Rd');

INSERT INTO doctors (first_name, last_name, specialization, phone, email)
VALUES 
  ('Sarah', 'Williams', 'Cardiology', '555-222-3333', 'sarah.w@hospital.com'),
  ('Michael', 'Brown', 'Neurology', '555-444-5555', 'michael.b@hospital.com'),
  ('Emily', 'Davis', 'Pediatrics', '555-666-7777', 'emily.d@hospital.com');

INSERT INTO appointments (patient_id, doctor_id, appointment_date, reason, status)
VALUES 
  (1, 1, '2025-03-15 10:00:00', 'Regular checkup', 'scheduled'),
  (2, 3, '2025-03-16 14:30:00', 'Fever and cough', 'scheduled'),
  (3, 2, '2025-03-14 09:15:00', 'Headache', 'completed');

  ALTER TABLE doctors ADD COLUMN license_number VARCHAR(255);
