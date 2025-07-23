import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import EmployeeForm from './components/EmployeeForm';
import EmployeeList from './components/EmployeeList';
import MenuBar from './components/MenuBar';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { themes } from './themes';

const PrivateRoute = ({ children }) => {
  const loggedIn = localStorage.getItem('loggedIn') === 'true';
  return loggedIn ? children : <Navigate to="/login" />;
};

function App() {
  const [currentTheme, setCurrentTheme] = useState('light');
  
  const handleThemeChange = (themeName) => {
    setCurrentTheme(themeName);
  };

  return (
    <ThemeProvider theme={themes[currentTheme]}>
      <CssBaseline />
      <Router>
        <MenuBar onThemeChange={handleThemeChange} currentTheme={currentTheme} />
        <main style={{ 
          flex: 1, 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'flex-start',
          padding: '2rem 1rem',
          minHeight: 'calc(100vh - 80px)' // Subtract approximate AppBar height
        }}>
          <div style={{ width: '100%', maxWidth: '1000px' }}>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/form" element={<PrivateRoute><EmployeeForm /></PrivateRoute>} />
              <Route path="/list" element={<PrivateRoute><EmployeeList /></PrivateRoute>} />
              <Route path="/" element={<PrivateRoute><Navigate to="/list" /></PrivateRoute>} />
              <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
          </div>
        </main>
      </Router>
    </ThemeProvider>
  );
}

export default App;
