import React, { useEffect, useState } from 'react';
import axios from 'axios';
import EmployeeForm from './EmployeeForm';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import DialogContentText from '@mui/material/DialogContentText';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [viewEmp, setViewEmp] = useState(null);
  const [editEmp, setEditEmp] = useState(null);
  const [deleteEmp, setDeleteEmp] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchEmployees = () => {
    setLoading(true);
    setError('');
    axios.get('http://localhost:4000/employees')
      .then(res => {
        setEmployees(res.data);
        setLoading(false);
      })
      .catch(err => {
        setLoading(false);
        if (err.response) {
          setError(`Failed to load employees (Status: ${err.response.status})`);
        } else if (err.request) {
          setError('Network error. Please check your connection.');
        } else {
          setError('An unexpected error occurred while loading employees.');
        }
      });
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleView = (emp) => setViewEmp(emp);
  const handleEdit = (emp) => setEditEmp(emp);
  const handleDelete = (emp) => setDeleteEmp(emp);
  const confirmDelete = async () => {
    if (!deleteEmp) return;
    setDeleting(true);
    setError('');
    
    try {
      await axios.delete(`http://localhost:4000/employees/${deleteEmp.id}`);
      setDeleteEmp(null);
      setSuccess('Employee deleted successfully!');
      fetchEmployees();
    } catch (err) {
      setDeleting(false);
      if (err.response) {
        setError(`Failed to delete employee (Status: ${err.response.status})`);
      } else if (err.request) {
        setError('Network error. Please check your connection.');
      } else {
        setError('An unexpected error occurred while deleting employee.');
      }
    }
    setDeleting(false);
  };
  
  const closeModal = () => { 
    setShowAdd(false); 
    setViewEmp(null); 
    setEditEmp(null); 
    setError(''); // Clear errors when closing modals
  };

  // Filter employees by search
  const filteredEmployees = employees.filter(emp => {
    const q = search.toLowerCase();
    return (
      emp.name.toLowerCase().includes(q) ||
      emp.email.toLowerCase().includes(q) ||
      emp.position.toLowerCase().includes(q)
    );
  });

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <Typography variant="h6">Loading employees...</Typography>
    </Box>
  );

  return (
    <Box sx={{ width: '100%' }}>
      <Card sx={{ width: '100%', boxShadow: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="h5" color="primary" fontWeight="bold">Employee List</Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }} sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
              <Button variant="contained" color="primary" onClick={() => setShowAdd(true)}>
                + Add Employee
              </Button>
            </Grid>
            <Grid size={12} sx={{ mt: 1 }}>
              <TextField
                label="Search employees"
                value={search}
                onChange={e => setSearch(e.target.value)}
                fullWidth
                size="small"
              />
            </Grid>
          </Grid>
          
          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
          
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Position</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredEmployees.map(emp => (
                  <TableRow key={emp.id} hover>
                    <TableCell>{emp.id}</TableCell>
                    <TableCell>{emp.name}</TableCell>
                    <TableCell>{emp.email}</TableCell>
                    <TableCell>{emp.position}</TableCell>
                    <TableCell>
                      <Button size="small" variant="outlined" color="primary" sx={{ mr: 1 }} onClick={() => handleView(emp)}>View</Button>
                      <Button size="small" variant="outlined" color="warning" sx={{ mr: 1 }} onClick={() => handleEdit(emp)}>Edit</Button>
                      <Button size="small" variant="outlined" color="error" onClick={() => handleDelete(emp)}>Delete</Button>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredEmployees.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} align="center">No employees found.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Add Employee Dialog */}
      <Dialog open={showAdd} onClose={closeModal} maxWidth="xs" fullWidth>
        <DialogTitle>Add Employee</DialogTitle>
        <DialogContent>
          <EmployeeForm onSuccess={() => { closeModal(); fetchEmployees(); }} />
        </DialogContent>
      </Dialog>

      {/* View Employee Dialog */}
      <Dialog open={!!viewEmp} onClose={closeModal} maxWidth="xs" fullWidth>
        <DialogTitle>Employee Details</DialogTitle>
        <DialogContent>
          {viewEmp && (
            <>
              <Typography><b>ID:</b> {viewEmp.id}</Typography>
              <Typography><b>Name:</b> {viewEmp.name}</Typography>
              <Typography><b>Email:</b> {viewEmp.email}</Typography>
              <Typography><b>Position:</b> {viewEmp.position}</Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeModal} color="primary">Close</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Employee Dialog */}
      <Dialog open={!!editEmp} onClose={closeModal} maxWidth="xs" fullWidth>
        <DialogTitle>Edit Employee</DialogTitle>
        <DialogContent>
          {editEmp && (
            <EmployeeForm initialValues={editEmp} onEdit={() => { closeModal(); fetchEmployees(); }} />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeModal} color="primary">Cancel</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Employee Dialog */}
      <Dialog open={!!deleteEmp} onClose={() => setDeleteEmp(null)} maxWidth="xs" fullWidth>
        <DialogTitle>Delete Employee</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete employee <b>{deleteEmp?.name}</b>?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteEmp(null)} color="primary" disabled={deleting}>Cancel</Button>
          <Button onClick={confirmDelete} color="error" variant="contained" disabled={deleting}>
            {deleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success/Error Snackbar */}
      <Snackbar
        open={!!success}
        autoHideDuration={3000}
        onClose={() => setSuccess('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={() => setSuccess('')}>
          {success}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default EmployeeList; 