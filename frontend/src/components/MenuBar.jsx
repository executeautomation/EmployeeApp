import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

const MenuBar = ({ onToggleTheme, mode }) => {
  const navigate = useNavigate();
  const loggedIn = localStorage.getItem('loggedIn') === 'true';

  const handleLogoff = () => {
    localStorage.removeItem('loggedIn');
    navigate('/login');
  };

  return (
    <AppBar position="static" color="primary" sx={{ mb: 4 }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
          Employee Manager
        </Typography>
        <Box>
          {loggedIn ? (
            <>
              <Button color="inherit" component={Link} to="/form">Add Employee</Button>
              <Button color="inherit" component={Link} to="/list">Employee List</Button>
              <Button color="inherit" onClick={handleLogoff}>Logoff</Button>
            </>
          ) : (
            <Button color="inherit" component={Link} to="/login">Login</Button>
          )}
          <IconButton sx={{ ml: 2 }} color="inherit" onClick={onToggleTheme}>
            {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default MenuBar; 