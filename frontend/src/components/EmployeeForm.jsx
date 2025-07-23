import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

const EmployeeForm = ({ onSuccess, initialValues, onEdit }) => {
  const [name, setName] = useState(initialValues?.name || '');
  const [email, setEmail] = useState(initialValues?.email || '');
  const [position, setPosition] = useState(initialValues?.position || '');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const isEdit = !!initialValues && !!onEdit;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (isEdit) {
        await axios.put(`http://localhost:4000/employees/${initialValues.id}`, { name, email, position });
        setSuccess('Employee updated successfully!');
        if (onEdit) {
          setTimeout(() => onEdit(), 1500);
        }
      } else {
        await axios.post('http://localhost:4000/employees', { name, email, position });
        setSuccess('Employee added successfully!');
        setName(''); setEmail(''); setPosition('');
        
        if (onSuccess) {
          setTimeout(() => onSuccess(), 1500);
        } else {
          setTimeout(() => navigate('/list'), 1500);
        }
      }
    } catch (err) {
      if (err.response) {
        const errorMessage = err.response.data?.error || 
          (isEdit ? 'Failed to update employee' : 'Failed to add employee');
        setError(`${errorMessage} (Status: ${err.response.status})`);
      } else if (err.request) {
        setError('Network error. Please check your connection and try again.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const FormContent = (
    <>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Name"
          value={name}
          onChange={e => setName(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Position"
          value={position}
          onChange={e => setPosition(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mt: 2 }}>
            {success}
          </Alert>
        )}
        <Button 
          type="submit" 
          variant="contained" 
          color="primary" 
          fullWidth 
          sx={{ mt: 2, fontWeight: 'bold' }}
          disabled={loading}
        >
          {loading ? 'Processing...' : (isEdit ? 'Update Employee' : 'Add Employee')}
        </Button>
      </form>
    </>
  );

  // If used as a modal, don't wrap in Card
  if (onSuccess || isEdit) {
    return (
      <div style={{ minWidth: 350, maxWidth: 400 }}>
        <Typography variant="h5" color="primary" align="center" fontWeight="bold" mb={3}>
          {isEdit ? 'Edit Employee' : 'Add Employee'}
        </Typography>
        {FormContent}
      </div>
    );
  }

  // Standalone page
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
      <Card sx={{ minWidth: 350, maxWidth: 400, p: 2, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h5" color="primary" align="center" fontWeight="bold" mb={3}>
            Add Employee
          </Typography>
          {FormContent}
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeForm; 