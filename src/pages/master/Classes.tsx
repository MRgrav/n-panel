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
import { addClass, updateClass, deleteClass } from '../../store/slices/masterSlice';
import DataTable from '../../components/Common/DataTable';

const Classes: React.FC = () => {
  const dispatch = useDispatch();
  const { classes } = useSelector((state: RootState) => state.master);
  
  const [open, setOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<any>(null);
  const [formData, setFormData] = useState({
    class: '',
    status: 'active' as 'active' | 'inactive',
  });

  const columns = [
    { id: 'class', label: 'Class', minWidth: 200 },
    { id: 'status', label: 'Status', minWidth: 120 },
  ];

  const handleAdd = () => {
    setEditingClass(null);
    setFormData({ class: '', status: 'active' });
    setOpen(true);
  };

  const handleEdit = (cls: any) => {
    setEditingClass(cls);
    setFormData({
      class: cls.class,
      status: cls.status,
    });
    setOpen(true);
  };

  const handleDelete = (id: string) => {
    dispatch(deleteClass(id));
  };

  const handleSubmit = () => {
    if (!formData.class) return;

    if (editingClass) {
      dispatch(updateClass({ ...editingClass, ...formData }));
    } else {
      dispatch(addClass(formData));
    }

    setOpen(false);
    setFormData({ class: '', status: 'active' });
  };

  return (
    <Box>
      <DataTable
        title="Classes"
        columns={columns}
        data={classes}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Search classes..."
      />

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingClass ? 'Edit Class' : 'Add Class'}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Class Name"
            value={formData.class}
            onChange={(e) => setFormData({ ...formData, class: e.target.value })}
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Status</InputLabel>
            <Select
              label="Status"
              a
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
            {editingClass ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Classes;