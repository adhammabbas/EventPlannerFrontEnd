import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLogin, setIsLogin] = useState(true);

  const API_URL = 'http://localhost:3000'; // your Express backend

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
    <div style={{ maxWidth: '400px', margin: '100px auto', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ padding: '8px' }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ padding: '8px' }}
        />
        <button type="submit" style={{ padding: '8px', cursor: 'pointer' }}>
          {isLogin ? 'Login' : 'Sign Up'}
        </button>
      </form>
      <p style={{ marginTop: '15px' }}>
        {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
        <button
          onClick={() => {
            setIsLogin(!isLogin);
            setMessage('');
          }}
          style={{ border: 'none', background: 'none', color: 'blue', cursor: 'pointer' }}
        >
          {isLogin ? 'Sign up' : 'Login'}
        </button>
      </p>
      {message && <p style={{ marginTop: '10px', color: 'green' }}>{message}</p>}
    </div>
  );
}

export default App;