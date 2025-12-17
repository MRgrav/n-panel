// Classes.tsx
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Alert
} from '@mui/material';
import { get, post, put, del } from '../../api/api';
import { useAuth } from '../../hooks/useAuth';
import DataTable from '../../components/Common/DataTable';

interface ClassData {
  id: string;
  name: string;
  schoolId: string;
  createdAt?: string;
  updatedAt?: string;
}

const Classes: React.FC = () => {
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassData | null>(null);
  const [formData, setFormData] = useState({
    name: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const { user } = useAuth();
  const token = user?.accessToken || '';

  const columns = [
    { 
      id: 'name', 
      label: 'Class', 
      minWidth: 200,
      render: (row: ClassData) => (
        <Box fontWeight="medium">
          {row.name}
        </Box>
      )
    },
    
    {
      id: 'createdAt',
      label: 'Created',
      minWidth: 150,
      render: (row: ClassData) => (
        <Box color="text.secondary" fontSize="0.875rem">
          {row.createdAt ? new Date(row.createdAt).toLocaleDateString() : 'N/A'}
        </Box>
      )
    },
  ];

  const fetchClasses = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await get('/classes', {}, token);
      setClasses(response.classrooms || []);
    } catch (error: any) {
      console.error('Error fetching classes:', error);
      setError('Failed to fetch classes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const handleAdd = () => {
    setEditingClass(null);
    setFormData({ name:'' });
    setError(null);
    setSuccess(null);
    setOpen(true);
  };

  const handleEdit = (cls: ClassData) => {
    setEditingClass(cls);
    setFormData({
      name: cls.name,
    });
    setError(null);
    setSuccess(null);
    setOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this class?')) {
      return;
    }

    try {
      await del(`/classes/${id}`, token);
      setSuccess('Class deleted successfully');
      fetchClasses();
    } catch (error: any) {
      console.error('Error deleting class:', error);
      setError('Failed to delete class. Please try again.');
    }
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      setError('Class name is required');
      return;
    }

    setError(null);
    setSuccess(null);

    try {
      const payload = {
        name: formData.name.trim(),
        schoolId: "0001"
      };

      if (editingClass) {
        await put(`/classes/${editingClass.id}`, payload, token);
        setSuccess('Class updated successfully');
      } else {
        await post('/classes', payload, token);
        setSuccess('Class added successfully');
      }

      setOpen(false);
      fetchClasses();
      setFormData({ name: ''});
    } catch (error: any) {
      console.error('Error saving class:', error);
      setError(error.response?.data?.message || 'Failed to save class. Please try again.');
    }
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setFormData({ name: ''});
    setError(null);
    setSuccess(null);
  };

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}

      <DataTable
        title="Classes"
        columns={columns}
        data={classes}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={(row) => handleDelete(row.id)}
        searchPlaceholder="Search classes..."
        searchableFields={['name']}
        showSerialNo={true}
      />

      <Dialog open={open} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingClass ? 'Edit Class' : 'Add New Class'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Class Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              margin="normal"
              required
              error={!!error}
              helperText={error || "Enter the class name (e.g., UKG, 1st, 2nd)"}
              autoFocus
            />
           
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleCloseDialog} color="inherit">
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained"
            disabled={!formData.name.trim()}
          >
            {editingClass ? 'Update Class' : 'Add Class'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Classes;