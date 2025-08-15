import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import PaletteIcon from '@mui/icons-material/Palette';
import PeopleIcon from '@mui/icons-material/People';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ListIcon from '@mui/icons-material/List';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { themeNames, themeKeys } from '../themes';

const MenuBar = ({ onThemeChange, currentTheme }) => {
  const navigate = useNavigate();
  const loggedIn = localStorage.getItem('loggedIn') === 'true';
  const [employeeMenuAnchor, setEmployeeMenuAnchor] = useState(null);
  const [themeMenuAnchor, setThemeMenuAnchor] = useState(null);

  const handleLogoff = () => {
    localStorage.removeItem('loggedIn');
    navigate('/login');
  };

  const handleEmployeeMenuOpen = (event) => {
    setEmployeeMenuAnchor(event.currentTarget);
  };

  const handleEmployeeMenuClose = () => {
    setEmployeeMenuAnchor(null);
  };

  const handleThemeMenuOpen = (event) => {
    setThemeMenuAnchor(event.currentTarget);
  };

  const handleThemeMenuClose = () => {
    setThemeMenuAnchor(null);
  };

  const handleThemeChange = (themeKey) => {
    onThemeChange(themeKey);
    handleThemeMenuClose();
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
              <Button 
                color="inherit" 
                onClick={handleEmployeeMenuOpen}
                onMouseEnter={handleEmployeeMenuOpen}
                data-testid="employee-menu-button"
                sx={{ 
                  '&:hover': { 
                    backgroundColor: 'rgba(255, 255, 255, 0.1)' 
                  } 
                }}
                startIcon={<PeopleIcon />}
                endIcon={<ExpandMoreIcon />}
              >
                Employees
              </Button>
              <Menu
                anchorEl={employeeMenuAnchor}
                open={Boolean(employeeMenuAnchor)}
                onClose={handleEmployeeMenuClose}
                MenuListProps={{
                  onMouseLeave: handleEmployeeMenuClose,
                }}
                data-testid="employee-menu"
                sx={{
                  '& .MuiPaper-root': {
                    mt: 1.5,
                  }
                }}
              >
                <MenuItem 
                  component={Link} 
                  to="/form" 
                  onClick={handleEmployeeMenuClose}
                  data-testid="add-employee-menu-item"
                >
                  <PersonAddIcon sx={{ mr: 1 }} />
                  Add Employee
                </MenuItem>
                <MenuItem 
                  component={Link} 
                  to="/list" 
                  onClick={handleEmployeeMenuClose}
                  data-testid="employee-list-menu-item"
                >
                  <ListIcon sx={{ mr: 1 }} />
                  Employee List
                </MenuItem>
              </Menu>
              <Button color="inherit" onClick={handleLogoff}>Logoff</Button>
            </>
          ) : (
            <Button color="inherit" component={Link} to="/login">Login</Button>
          )}
          <Button 
            color="inherit" 
            onClick={handleThemeMenuOpen}
            onMouseEnter={handleThemeMenuOpen}
            data-testid="theme-menu-button"
            sx={{ 
              '&:hover': { 
                backgroundColor: 'rgba(255, 255, 255, 0.1)' 
              } 
            }}
            startIcon={<PaletteIcon />}
            endIcon={<ExpandMoreIcon />}
          >
            {themeNames[currentTheme]}
          </Button>
          <Menu
            anchorEl={themeMenuAnchor}
            open={Boolean(themeMenuAnchor)}
            onClose={handleThemeMenuClose}
            MenuListProps={{
              onMouseLeave: handleThemeMenuClose,
            }}
            data-testid="theme-menu"
            sx={{
              '& .MuiPaper-root': {
                mt: 1.5,
              }
            }}
          >
            {themeKeys.map((themeKey) => (
              <MenuItem 
                key={themeKey} 
                onClick={() => handleThemeChange(themeKey)}
                data-testid={`theme-${themeKey}-menu-item`}
                sx={{
                  backgroundColor: currentTheme === themeKey ? 'rgba(0, 0, 0, 0.08)' : 'transparent',
                  '&:hover': {
                    backgroundColor: currentTheme === themeKey ? 'rgba(0, 0, 0, 0.12)' : 'rgba(0, 0, 0, 0.04)',
                  }
                }}
              >
                <PaletteIcon sx={{ mr: 1 }} />
                {themeNames[themeKey]}
              </MenuItem>
            ))}
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default MenuBar; 