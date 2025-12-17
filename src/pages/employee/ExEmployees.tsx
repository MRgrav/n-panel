import React, { useEffect, useState } from 'react';
import {
  Box,
  IconButton,
} from '@mui/material';

import { useNavigate } from 'react-router-dom';
import CTable from '../../components/Common/CTable';
import api, { get } from '../../api/api';
import { UnlockIcon } from 'lucide-react';

const ExEmployees: React.FC = () => {
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
            color="error" 
            onClick={() => handleBlock(row._id)}
            aria-label="unblock"
          >
            <UnlockIcon/>
          </IconButton>
        </>
      ),
    }
  ];

  const handleAdd = () => {
    navigate('/employee/add');
  };




  const fetchEmployees = async () => {
    try {
      const response = await get('/staff/blocked');
      setEmployees(response.data.staff);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

    const handleBlock = async (id: string) => {
      try {
        await api.put(`staff/unblock/${id}`);
        fetchEmployees();
      } catch (error) {
        console.error('Error deleting employee:', error);
      }
    };

  useEffect(() => {
    fetchEmployees();
  }, []);

  return (
    <Box>
      <CTable 
        title="Ex Employees"
        columns={columns}
        data={employees}
        searchPlaceholder="Search employees..."
        itemsPerPage={5}
      />
    </Box>
  );
};

export default ExEmployees;