import React, { useState } from 'react';
import axios from 'axios';

function Register() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:8000/api/register', form);
      const { token, user } = response.data;

      console.log('Register success:', user);
      localStorage.setItem('token', token); // simpan token
    } catch (error) {
      console.error('Register failed:', error.response?.data);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Register to Melodify</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Name" name="name" className="input-field" required onChange={handleChange} />
          <input type="email" placeholder="Email" name="email" className="input-field" required onChange={handleChange} />
          <input type="password" placeholder="Password" name="password" className="input-field" required onChange={handleChange} />
          <input type="password" placeholder="Confirm Password" name="password_confirmation" className="input-field" required onChange={handleChange} />

          <button type="submit" className="login-button">Register</button>
        </form>
      </div>
    </div>
  );
}

export default Register;
