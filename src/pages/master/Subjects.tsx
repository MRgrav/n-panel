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
import { addSubject, updateSubject, deleteSubject } from '../../store/slices/masterSlice';
import DataTable from '../../components/Common/DataTable';

const Subjects: React.FC = () => {
  const dispatch = useDispatch();
  const { subjects } = useSelector((state: RootState) => state.master);
  
  const [open, setOpen] = useState(false);
  const [editingSub, setEditingSub] = useState<any>(null);
  const [formData, setFormData] = useState({
    subject: '',
    status: 'active' as 'active' | 'inactive',
  });

  const columns = [
    { id: 'subject', label: 'Subject', minWidth: 200 },
    { id: 'status', label: 'Status', minWidth: 120 },
  ];

  const handleAdd = () => {
    setEditingSub(null);
    setFormData({ subject: '', status: 'active' });
    setOpen(true);
  };

  const handleEdit = (sub: any) => {
    setEditingSub(sub);
    setFormData({
      subject: sub.subject,
      status: sub.status,
    });
    setOpen(true);
  };

  const handleDelete = (id: string) => {
    dispatch(deleteSubject(id));
  };

  const handleSubmit = () => {
    if (!formData.subject) return;

    if (editingSub) {
      dispatch(updateSubject({ ...editingSub, ...formData }));
    } else {
      dispatch(addSubject(formData));
    }

    setOpen(false);
    setFormData({ subject: '', status: 'active' });
  };

  return (
    <Box>
      <DataTable
        title="Subjects"
        columns={columns}
        data={subjects}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Search Subjects..."
      />

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingSub ? 'Edit Subject' : 'Add Subject'}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Subject Name"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
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
            {editingSub ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Subjects;