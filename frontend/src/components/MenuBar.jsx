import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import PaletteIcon from '@mui/icons-material/Palette';
import { themeNames, themeKeys } from '../themes';

const MenuBar = ({ onThemeChange, currentTheme }) => {
  const navigate = useNavigate();
  const loggedIn = localStorage.getItem('loggedIn') === 'true';

  const handleLogoff = () => {
    localStorage.removeItem('loggedIn');
    navigate('/login');
  };

  const handleThemeChange = (event) => {
    onThemeChange(event.target.value);
  };

  return (
    <AppBar position="static" color="primary" sx={{ mb: 4 }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
          Employee Manager
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {loggedIn ? (
            <>
              <Button color="inherit" component={Link} to="/form">Add Employee</Button>
              <Button color="inherit" component={Link} to="/list">Employee List</Button>
              <Button color="inherit" onClick={handleLogoff}>Logoff</Button>
            </>
          ) : (
            <Button color="inherit" component={Link} to="/login">Login</Button>
          )}
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel 
              id="theme-select-label" 
              sx={{ 
                color: 'inherit',
                '&.Mui-focused': { color: 'inherit' }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <PaletteIcon fontSize="small" />
                Theme
              </Box>
            </InputLabel>
            <Select
              labelId="theme-select-label"
              value={currentTheme}
              onChange={handleThemeChange}
              label="Theme"
              sx={{
                color: 'inherit',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255, 255, 255, 0.23)',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255, 255, 255, 0.87)',
                },
                '& .MuiSvgIcon-root': {
                  color: 'inherit',
                },
              }}
            >
              {themeKeys.map((themeKey) => (
                <MenuItem key={themeKey} value={themeKey}>
                  {themeNames[themeKey]}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default MenuBar; 