import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Alert from '@mui/material/Alert';
import Collapse from '@mui/material/Collapse';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CircularProgress from '@mui/material/CircularProgress';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear any previous errors
    setIsLoading(true);
    
    try {
      const response = await axios.post('http://localhost:4000/login', { username, password });
      
      if (response.data.success) {
        localStorage.setItem('loggedIn', 'true');
        localStorage.setItem('username', username);
        navigate('/list'); // Redirect to employee list instead of form
      } else {
        setError(response.data.error || 'Login failed');
      }
    } catch (err) {
      // Handle different types of errors
      if (err.response) {
        // Server responded with error status
        const errorMessage = err.response.data?.error || 'Invalid credentials';
        setError(errorMessage);
      } else if (err.request) {
        // Network error
        setError('Network error. Please check your connection.');
      } else {
        // Other error
        setError('Login failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: 2
      }}
    >
      <Card 
        sx={{ 
          minWidth: 350, 
          maxWidth: 450, 
          p: 3, 
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          borderRadius: 3,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)'
        }}
      >
        <CardContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
            <Avatar sx={{ m: 1, bgcolor: 'primary.main', width: 56, height: 56 }}>
              <LockOutlinedIcon sx={{ fontSize: 30 }} />
            </Avatar>
            <Typography variant="h4" color="primary" align="center" fontWeight="bold">
              Welcome Back
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
              Sign in to your account
            </Typography>
          </Box>
          
          <form onSubmit={handleSubmit}>
            <TextField
              label="Username"
              value={username}
              onChange={e => {
                setUsername(e.target.value);
                if (error) setError(''); // Clear error when user starts typing
              }}
              fullWidth
              margin="normal"
              required
              variant="outlined"
              disabled={isLoading}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                }
              }}
            />
            <TextField
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => {
                setPassword(e.target.value);
                if (error) setError(''); // Clear error when user starts typing
              }}
              fullWidth
              margin="normal"
              required
              variant="outlined"
              disabled={isLoading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      edge="end"
                      disabled={isLoading}
                      data-testid="password-visibility-toggle"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                }
              }}
            />
            
            <Collapse in={!!error} timeout={400}>
              <Alert 
                severity="error"
                icon={<ErrorOutlineIcon sx={{ fontSize: '1.2rem' }} />}
                sx={{ 
                  mt: 2, 
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, #ffebee 0%, #fce4ec 100%)',
                  border: '1px solid #f8bbd9',
                  boxShadow: '0 4px 12px rgba(244, 67, 54, 0.15)',
                  '& .MuiAlert-icon': {
                    color: '#d32f2f',
                    fontSize: '1.2rem'
                  },
                  '& .MuiAlert-message': {
                    fontSize: '0.95rem',
                    fontWeight: 500,
                    color: '#c62828',
                    lineHeight: 1.5
                  },
                  '&:hover': {
                    boxShadow: '0 6px 20px rgba(244, 67, 54, 0.2)',
                    transform: 'translateY(-1px)',
                    transition: 'all 0.3s ease'
                  },
                  transition: 'all 0.3s ease'
                }}
                data-testid="error-alert"
              >
                <Box>
                  <Typography sx={{ 
                    fontSize: '1rem', 
                    fontWeight: 600, 
                    mb: 0.5,
                    color: '#c62828'
                  }}>
                    Authentication Failed
                  </Typography>
                  <Typography sx={{ fontSize: '0.9rem', color: '#c62828' }}>
                    {error === 'Invalid username or password' 
                      ? 'Invalid username or password. Please check your credentials and try again.'
                      : error
                    }
                  </Typography>
                </Box>
              </Alert>
            </Collapse>
            
            <Button 
              type="submit" 
              variant="contained" 
              color="primary" 
              fullWidth 
              disabled={isLoading}
              sx={{ 
                mt: 3, 
                mb: 2, 
                fontWeight: 'bold',
                fontSize: '1.1rem',
                borderRadius: 2,
                py: 1.5,
                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #1976D2 30%, #1BA5D2 90%)',
                }
              }}
              data-testid="login-button"
            >
              {isLoading ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CircularProgress size={20} color="inherit" />
                  Signing In...
                </Box>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Login; 