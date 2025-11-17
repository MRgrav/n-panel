import React, { useEffect, useState } from 'react';
import {
  Box,
  IconButton,
} from '@mui/material';

import { useNavigate } from 'react-router-dom';
import CTable from '../../components/Common/CTable';
import api from '../../api/api';
import { Block, Delete, Edit } from '@mui/icons-material';

const CurrentEmployees: React.FC = () => {
  const [employees, setEmployees] = useState([]);


  const navigate = useNavigate();

  const columns = [
    { id: 'name', label: 'Name', minWidth: 150 },
    { id: 'role', label: 'Role', minWidth: 100 },
    { id: 'employeeId', label: 'Employee ID', minWidth: 120 },
    { id: 'number', label: 'Phone', minWidth: 100 },
    { id: 'joiningOfDate', label: 'Join Date', minWidth: 120 },
    { id: 'number', label: 'Phone', minWidth: 130 },
    { 
      id: 'actions', 
      label: 'Actions', 
      minWidth: 150,
      align: 'center' as const,
      format: (_: any, row: any) => (
        <>
          <IconButton 
            color="primary" 
            onClick={() => handleEdit(row)}
            aria-label="edit"
          >
            <Edit />
          </IconButton>
          <IconButton 
            color="error" 
            onClick={() => handleDelete(row._id)}
            aria-label="delete"
          >
            <Delete />
          </IconButton>

          <IconButton 
            color="error" 
            onClick={() => handleBlock(row._id)}
            aria-label="block"
          >
            <Block />
          </IconButton>

        </>
      ),
    }
  ];

  const handleAdd = () => {
    navigate('/employee/add');
  };

  const handleEdit = (employee: any) => {
    navigate(`/employee/edit/${employee._id}`);
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/staff/${id}`);
      fetchEmployees();
    } catch (error) {
      console.error('Error deleting employee:', error);
    }
  };

  const handleBlock = async (id: string) => {
    try {
      await api.put(`staff/block/${id}`);
      fetchEmployees();
    } catch (error) {
      console.error('Error deleting employee:', error);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await api.get('/staff');
      setEmployees(response.data.staff);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  return (
    <Box>
      <CTable 
        title="Current Employees"
        columns={columns}
        data={employees}
        onAdd={handleAdd}
        searchPlaceholder="Search employees..."
        itemsPerPage={5}
      />
    </Box>
  );
};

export default CurrentEmployees;