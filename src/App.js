import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const API_URL = 'http://localhost:3000'; // your backend URL

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = isLogin ? '/login' : '/signup';
      const response = await axios.post(`${API_URL}${endpoint}`, { email, password });
      setMessage(response.data.message);
    } catch (error) {
      if (error.response) setMessage(error.response.data.message);
      else setMessage('Server not responding');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'linear-gradient(135deg, #89afceff 0%, #3694d3ff 100%)',
      fontFamily: 'Inter, sans-serif',
    }}>
      <div style={{
        width: '360px',
        backgroundColor: 'white',
        borderRadius: '20px',
        padding: '40px 30px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
        textAlign: 'center',
      }}>
        <h2 style={{ marginBottom: '25px', color: '#333' }}>
          {isLogin ? 'Welcome Back' : 'Create an Account'}
        </h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              padding: '12px 14px',
              borderRadius: '8px',
              border: '1px solid #ccc',
              outline: 'none',
              transition: '0.2s',
            }}
            onFocus={(e) => (e.target.style.borderColor = '#667eea')}
            onBlur={(e) => (e.target.style.borderColor = '#ccc')}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              padding: '12px 14px',
              borderRadius: '8px',
              border: '1px solid #ccc',
              outline: 'none',
              transition: '0.2s',
            }}
            onFocus={(e) => (e.target.style.borderColor = '#667eea')}
            onBlur={(e) => (e.target.style.borderColor = '#ccc')}
          />
          <button
            type="submit"
            style={{
              background: 'linear-gradient(135deg, #94bbdbff 0%, #3694d3ff 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: '0.3s',
            }}
            onMouseEnter={(e) => (e.target.style.opacity = '0.9')}
            onMouseLeave={(e) => (e.target.style.opacity = '1')}
          >
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>
        <p style={{ marginTop: '20px', color: '#555' }}>
          {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
          <span
            onClick={() => {
              setIsLogin(!isLogin);
              setMessage('');
            }}
            style={{ color: '#667eea', cursor: 'pointer', fontWeight: '600' }}
          >
            {isLogin ? 'Sign up' : 'Login'}
          </span>
        </p>
        {message && (
          <p style={{
            marginTop: '20px',
            color: message.includes('success') ? 'green' : 'red',
            fontWeight: '500',
          }}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

export default App;
