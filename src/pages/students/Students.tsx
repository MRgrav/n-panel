import React, { useEffect, useState } from 'react';
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

import DataTable from '../../components/Common/DataTable';
import api from '../../api/api';
import AddStudent from './forms/AddStudent';
import EditStudent from './forms/EditStudent';

const Departments: React.FC = () => {
  const { departments } = useSelector((state: RootState) => state.master);
  
  const [open, setOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<any>(null);
  const [formData, setFormData] = useState({

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

  };

  const handleSubmit = () => {
   
  };

  const fetchData =async()=>{
        const res = await api.get('/students')
        return res.data
  }

  useEffect(()=>{
    fetchData().then(data=>console.log(data))
  },[])

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
          {editingDept ? 'Edit Student' : 'Add Student'}
        </DialogTitle>
       
      </Dialog>
    </Box>
  );
};

export default Departments;