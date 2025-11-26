import React, { useContext } from 'react';
import { AuthProvider, AuthContext } from './context/AuthContext';
import AuthForm from './components/AuthForm';
import Dashboard from './components/Dashboard';
import './App.css';

function AppContent() {
  const { token, login, logout } = useContext(AuthContext);

  if (!token) {
    return <AuthForm onSuccess={login} />;
  }

  return <Dashboard logout={logout} />;
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;