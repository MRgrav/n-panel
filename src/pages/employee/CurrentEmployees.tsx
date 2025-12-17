
import React, { useEffect, useState } from 'react';
import {
  Box,
  IconButton,
  Chip,
  CircularProgress,
  Alert,
  Avatar,
  Typography,
  Button,
} from '@mui/material';
import {
  Edit,
  Delete,
  Block,
  Visibility,
  PersonAdd,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import CTable from '../../components/Common/CTable';
import { del, get, put } from '../../api/api';
import { useAuth } from '../../hooks/useAuth';
import CustomModal from '../../components/customModal';

interface Staff {
  id: number;
  employeeId: string;
  name: string;
  role: string;
  designation: string;
  mobile: string;
  dateOfJoining: string;
  email: string;
  gender?: string;
  status?: 'active' | 'inactive';
}

const CurrentEmployees: React.FC = () => {
  const [employees, setEmployees] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [blockModalOpen, setBlockModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Staff | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  const token = user?.accessToken || '';

  const columns = [
    { 
      id: 'employeeId', 
      label: 'Employee ID', 
      minWidth: 120,
      format: (value: string, row: Staff) => (
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}>
          </Avatar>
          <Box>
            <Typography variant="subtitle2" fontWeight="bold">
              {value}
            </Typography>
            <Typography variant="caption" color="text.secondary">
            </Typography>
          </Box>
        </Box>
      )
    },
    { 
      id: 'name', 
      label: 'Name', 
      minWidth: 150 
    },
    { 
      id: 'role', 
      label: 'Role', 
      minWidth: 100,
      format: (value: string) => (
        <Chip
          label={value}
          color={value === 'TEACHER' ? 'primary' : 'secondary'}
          size="small"
          variant="outlined"
          sx={{ fontWeight: 'medium' }}
        />
      )
    },
    { 
      id: 'mobile', 
      label: 'Phone', 
      minWidth: 120 
    },
    { 
      id: 'email', 
      label: 'Email', 
      minWidth: 180 
    },
    { 
      id: 'dateOfJoining', 
      label: 'Join Date', 
      minWidth: 120,
      format: (value: string) => (
        <Typography variant="body2" color="text.secondary">
          {new Date(value).toLocaleDateString()}
        </Typography>
      )
    },
    { 
      id: 'actions', 
      label: 'Actions', 
      minWidth: 200,
      align: 'center' as const,
      format: (_: any, row: Staff) => (
        <Box display="flex" gap={1} justifyContent="center">
         
          <IconButton 
            color="primary" 
            onClick={() => handleEdit(row)}
            aria-label="edit"
            size="small"
            sx={{ 
              backgroundColor: 'primary.light',
              color: 'white',
              '&:hover': { backgroundColor: 'primary.main' }
            }}
          >
            <Edit fontSize="small" />
          </IconButton>
          <IconButton 
            color="warning" 
            onClick={() => openBlockModal(row)}
            aria-label="block"
            size="small"
            sx={{ 
              backgroundColor: 'warning.light',
              color: 'white',
              '&:hover': { backgroundColor: 'warning.main' }
            }}
          >
            <Block fontSize="small" />
          </IconButton>
          <IconButton 
            color="error" 
            onClick={() => openDeleteModal(row)}
            aria-label="delete"
            size="small"
            sx={{ 
              backgroundColor: 'error.light',
              color: 'white',
              '&:hover': { backgroundColor: 'error.main' }
            }}
          >
            <Delete fontSize="small" />
          </IconButton>
        </Box>
      ),
    }
  ];

  const fetchEmployees = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await get('/staff', {}, token);
      setEmployees(response?.staff || []);
    } catch (error: any) {
      console.error('Error fetching employees:', error);
      setError('Failed to fetch employees. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleAdd = () => {
    navigate('/employee/add');
  };

  const handleView = (employee: Staff) => {
    navigate(`/employee/view/${employee.id}`);
  };

  const handleEdit = (employee: Staff) => {
    navigate(`/employee/edit/${employee.id}`);
  };

  const openDeleteModal = (employee: Staff) => {
    setSelectedEmployee(employee);
    setDeleteModalOpen(true);
  };

  const openBlockModal = (employee: Staff) => {
    setSelectedEmployee(employee);
    setBlockModalOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedEmployee) return;

    try {
      await del(`/staff/${selectedEmployee.id}`, token);
      setSuccess('Employee deleted successfully');
      fetchEmployees();
    } catch (error: any) {
      console.error('Error deleting employee:', error);
      setError('Failed to delete employee. Please try again.');
    } finally {
      setDeleteModalOpen(false);
      setSelectedEmployee(null);
    }
  };

  const handleBlock = async () => {
    if (!selectedEmployee) return;

    try {
      await put(`/staff/block/${selectedEmployee.id}`, {}, token);
      setSuccess('Employee blocked successfully');
      fetchEmployees();
    } catch (error: any) {
      console.error('Error blocking employee:', error);
      setError('Failed to block employee. Please try again.');
    } finally {
      setBlockModalOpen(false);
      setSelectedEmployee(null);
    }
  };

  return (
    <Box sx={{ p: 3 }}>


      {/* Alerts */}
      {error && (
        <Alert 
          severity="error" 
          sx={{ mb: 2, borderRadius: 2 }} 
          onClose={() => setError(null)}
        >
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert 
          severity="success" 
          sx={{ mb: 2, borderRadius: 2 }} 
          onClose={() => setSuccess(null)}
        >
          {success}
        </Alert>
      )}

      {/* Table */}
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height={400}>
          <CircularProgress />
        </Box>
      ) : (
        <CTable 
          title="Current Employees"
          columns={columns}
          data={employees}
          onAdd={handleAdd}
          searchPlaceholder="Search employees by name, ID, email..."
          itemsPerPage={10}
        />
      )}

      {/* Delete Confirmation Modal */}
      <CustomModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        width="500px"
      >
        <Box sx={{ textAlign: 'center', p: 3 }}>
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              backgroundColor: 'error.light',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
            }}
          >
            <Delete sx={{ fontSize: 40, color: 'white' }} />
          </Box>
          
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Delete Employee
          </Typography>
          
          <Typography variant="body1" color="text.secondary" paragraph>
            Are you sure you want to delete{' '}
            <Typography component="span" fontWeight="bold" color="primary">
              {selectedEmployee?.name}
            </Typography>
            ? This action cannot be undone.
          </Typography>
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Employee ID: {selectedEmployee?.employeeId}
          </Typography>
          
          <Box display="flex" gap={2} justifyContent="center">
            <Button
              variant="outlined"
              onClick={() => setDeleteModalOpen(false)}
              sx={{
                borderRadius: 2,
                px: 4,
                py: 1,
                textTransform: 'none',
                fontWeight: 'bold',
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleDelete}
              sx={{
                borderRadius: 2,
                px: 4,
                py: 1,
                textTransform: 'none',
                fontWeight: 'bold',
                background: 'linear-gradient(135deg, #f56565 0%, #e53e3e 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #e53e3e 0%, #c53030 100%)',
                }
              }}
            >
              Delete Employee
            </Button>
          </Box>
        </Box>
      </CustomModal>

      {/* Block Confirmation Modal */}
      <CustomModal
        isOpen={blockModalOpen}
        onClose={() => setBlockModalOpen(false)}
        width="500px"
      >
        <Box sx={{ textAlign: 'center', p: 3 }}>
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              backgroundColor: 'warning.light',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
            }}
          >
            <Block sx={{ fontSize: 40, color: 'white' }} />
          </Box>
          
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Block Employee
          </Typography>
          
          <Typography variant="body1" color="text.secondary" paragraph>
            Are you sure you want to block{' '}
            <Typography component="span" fontWeight="bold" color="warning.main">
              {selectedEmployee?.name}
            </Typography>
            ? They will be moved to ex-employees.
          </Typography>
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Employee ID: {selectedEmployee?.employeeId}
          </Typography>
          
          <Box display="flex" gap={2} justifyContent="center">
            <Button
              variant="outlined"
              onClick={() => setBlockModalOpen(false)}
              sx={{
                borderRadius: 2,
                px: 4,
                py: 1,
                textTransform: 'none',
                fontWeight: 'bold',
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="warning"
              onClick={handleBlock}
              sx={{
                borderRadius: 2,
                px: 4,
                py: 1,
                textTransform: 'none',
                fontWeight: 'bold',
                background: 'linear-gradient(135deg, #ed8936 0%, #dd6b20 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #dd6b20 0%, #c05621 100%)',
                }
              }}
            >
              Block Employee
            </Button>
          </Box>
        </Box>
      </CustomModal>
    </Box>
  );
};

export default CurrentEmployees;