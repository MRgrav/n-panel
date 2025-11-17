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
import { addPaymentMode, updatePaymentMode, deletePaymentMode } from '../../store/slices/masterSlice';
import DataTable from '../../components/Common/DataTable';

const PaymentModes: React.FC = () => {
  const dispatch = useDispatch();
  const { paymentModes } = useSelector((state: RootState) => state.master);
  
  const [open, setOpen] = useState(false);
  const [editingMode, setEditingMode] = useState<any>(null);
  const [formData, setFormData] = useState({
    paymentModeName: '',
    status: 'active' as 'active' | 'inactive',
  });

  const columns = [
    { id: 'paymentModeName', label: 'Payment Mode Name', minWidth: 200 },
    { id: 'status', label: 'Status', minWidth: 120 },
  ];

  const handleAdd = () => {
    setEditingMode(null);
    setFormData({ paymentModeName: '', status: 'active' });
    setOpen(true);
  };

  const handleEdit = (mode: any) => {
    setEditingMode(mode);
    setFormData({
      paymentModeName: mode.paymentModeName,
      status: mode.status,
    });
    setOpen(true);
  };

  const handleDelete = (id: string) => {
    dispatch(deletePaymentMode(id));
  };

  const handleSubmit = () => {
    if (!formData.paymentModeName) return;

    if (editingMode) {
      dispatch(updatePaymentMode({ ...editingMode, ...formData }));
    } else {
      dispatch(addPaymentMode(formData));
    }

    setOpen(false);
    setFormData({ paymentModeName: '', status: 'active' });
  };

  return (
    <Box>
      <DataTable
        title="Payment Modes"
        columns={columns}
        data={paymentModes}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Search payment modes..."
      />

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingMode ? 'Edit Payment Mode' : 'Add Payment Mode'}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Payment Mode Name"
            value={formData.paymentModeName}
            onChange={(e) => setFormData({ ...formData, paymentModeName: e.target.value })}
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
            {editingMode ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PaymentModes;