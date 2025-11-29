import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
} from '@mui/material';
import { RootState } from '../../store';
import { addDepartment, updateDepartment, deleteDepartment } from '../../store/slices/masterSlice';
import DataTable from '../../components/Common/DataTable';

const Departments: React.FC = () => {
  const dispatch = useDispatch();
  const { departments } = useSelector((state: RootState) => state.master);
  
  const [open, setOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<any>(null);
  const [formData, setFormData] = useState({
    department: '',
    status: 'active' as 'active' | 'inactive',
  });

  const columns = [
    { id: 'department', label: 'Department', minWidth: 200 },
    { id: 'status', label: 'Status', minWidth: 120 },
  ];

  const handleAdd = () => {
    setEditingDept(null);
    setFormData({ department: '', status: 'active' });
    setOpen(true);
  };

  const handleEdit = (dept: any) => {
    setEditingDept(dept);
    setFormData({
      department: dept.department,
      status: dept.status,
    });
    setOpen(true);
  };

  const handleDelete = (id: string) => {
    dispatch(deleteDepartment(id));
  };

  const handleSubmit = () => {
    if (!formData.department) return;

    if (editingDept) {
      dispatch(updateDepartment({ ...editingDept, ...formData }));
    } else {
      dispatch(addDepartment(formData));
    }

    setOpen(false);
    setFormData({ department: '', status: 'active' });
  };

  return (
    <Box>
      <DataTable
        title="Departments"
        columns={columns}
        data={departments}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Search departments..."
      />

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingDept ? 'Edit Department' : 'Add Department'}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Department Name"
            value={formData.department}
            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Status</InputLabel>
            <Select
              label="Status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
            >
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingDept ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Departments;