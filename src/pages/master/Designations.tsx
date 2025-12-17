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
import { addDesignation, updateDesignation, deleteDesignation } from '../../store/slices/masterSlice';
import DataTable from '../../components/Common/DataTable';

const Designations: React.FC = () => {
  const dispatch = useDispatch();
  const { designations } = useSelector((state: RootState) => state.master);
  
  const [open, setOpen] = useState(false);
  const [editingDesig, setEditingDesig] = useState<any>(null);
  const [formData, setFormData] = useState({
    designation: '',
    status: 'active' as 'active' | 'inactive',
  });

  const columns = [
    { id: 'designation', label: 'Designation', minWidth: 200 },
    { id: 'status', label: 'Status', minWidth: 120 },
  ];

  const handleAdd = () => {
    setEditingDesig(null);
    setFormData({ designation: '', status: 'active' });
    setOpen(true);
  };

  const handleEdit = (desig: any) => {
    setEditingDesig(desig);
    setFormData({
      designation: desig.designation,
      status: desig.status,
    });
    setOpen(true);
  };

  const handleDelete = (id: string) => {
    dispatch(deleteDesignation(id));
  };

  const handleSubmit = () => {
    if (!formData.designation) return;

    if (editingDesig) {
      dispatch(updateDesignation({ ...editingDesig, ...formData }));
    } else {
      dispatch(addDesignation(formData));
    }

    setOpen(false);
    setFormData({ designation: '', status: 'active' });
  };

  return (
    <Box>
      <DataTable
        title="Designations"
        columns={columns}
        data={designations}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Search designations..."
        showSerialNo={true}
      />

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingDesig ? 'Edit Designation' : 'Add Designation'}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Designation Name"
            value={formData.designation}
            onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Status</InputLabel>
            <Select
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
            {editingDesig ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Designations;