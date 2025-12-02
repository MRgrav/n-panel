// Students.tsx
import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Chip,
  Avatar,
  TextField,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  InputAdornment,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Visibility as ViewIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import AddStudent from './forms/AddStudent';
import EditStudent from './forms/EditStudent';
import StudentDetails from './StudentDetails';

// Dummy data
const generateDummyStudents = () => {
  const classes = ['Nursery', 'KG', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th'];
  const schools = ['ABC Primary School', 'XYZ Public School', 'Global Academy', 'Little Stars School', 'Smart Kids School'];
  const firstNames = ['Aarav', 'Vihaan', 'Vivaan', 'Ananya', 'Diya', 'Aaradhya', 'Sai', 'Ishaan', 'Reyansh', 'Aryan'];
  const lastNames = ['Sharma', 'Verma', 'Kumar', 'Singh', 'Patel', 'Reddy', 'Gupta', 'Malhotra', 'Mehta', 'Jain'];
  
  return Array.from({ length: 50 }, (_, index) => {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const fullName = `${firstName} ${lastName}`;
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@gmail.com`;
    const promotedToClass = classes[Math.floor(Math.random() * classes.length)];
    
    const baseFee = 1000 + (classes.indexOf(promotedToClass) * 200);
    
    return {
      id: `STU${1000 + index}`,
      rollNumber: `ROLL${1000 + index}`,
      fullName,
      email,
      dateOfBirth: new Date(2010 + Math.floor(Math.random() * 10), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
      gender: ['male', 'female'][Math.floor(Math.random() * 2)] as 'male' | 'female',
      previousSchool: schools[Math.floor(Math.random() * schools.length)],
      previousClass: classes[Math.floor(Math.random() * classes.length - 1) + 1] || 'KG',
      previousGrade: ['A+', 'A', 'B+', 'B', 'C+'][Math.floor(Math.random() * 5)],
      promotedToClass,
      admissionAmount: baseFee * 5,
      monthlyFees: baseFee,
      admissionDate: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
      admissionReceiptNo: `REC${1000 + index}`,
      status: Math.random() > 0.2 ? 'active' : 'inactive' as 'active' | 'inactive',
      type: 'new' as 'new' | 'existing',
    };
  });
};

const Students: React.FC = () => {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const columns = [
    {
      id: 'student',
      label: 'Student',
      minWidth: 200,
      render: (row: any) => (
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar 
            sx={{ 
              bgcolor: row.gender === 'male' ? 'primary.main' : 'secondary.main',
              width: 40,
              height: 40
            }}
          >
            {row.fullName?.charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="subtitle2" fontWeight="bold">
              {row.fullName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Roll No: {row.rollNumber}
            </Typography>
          </Box>
        </Box>
      ),
    },
    {
      id: 'class',
      label: 'Class',
      minWidth: 120,
      render: (row: any) => (
        <Chip 
          label={row.promotedToClass} 
          size="small" 
          color="primary" 
          variant="outlined" 
        />
      ),
    },
    {
      id: 'contact',
      label: 'Contact',
      minWidth: 180,
      render: (row: any) => (
        <Box>
          <Typography variant="body2">{row.email}</Typography>
          <Typography variant="body2" color="text.secondary">
            DOB: {new Date(row.dateOfBirth).toLocaleDateString()}
          </Typography>
        </Box>
      ),
    },
    {
      id: 'academic',
      label: 'Academic History',
      minWidth: 200,
      render: (row: any) => (
        <Box>
          <Typography variant="body2">
            {row.previousSchool}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {row.previousClass} - Grade: {row.previousGrade}
          </Typography>
        </Box>
      ),
    },
    {
      id: 'fees',
      label: 'Fees',
      minWidth: 150,
      render: (row: any) => (
        <Box>
          <Typography variant="body2" fontWeight="bold">
            ₹{row.admissionAmount.toLocaleString()}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Monthly: ₹{row.monthlyFees}
          </Typography>
        </Box>
      ),
    },
    {
      id: 'status',
      label: 'Status',
      minWidth: 100,
      render: (row: any) => (
        <Chip
          label={row.status}
          color={row.status === 'active' ? 'success' : 'default'}
          size="small"
        />
      ),
    },
    {
      id: 'actions',
      label: 'Actions',
      minWidth: 150,
      render: (row: any) => (
        <Box display="flex" gap={1}>
          <IconButton
            size="small"
            color="info"
            onClick={() => handleView(row)}
          >
            <ViewIcon />
          </IconButton>
          <IconButton
            size="small"
            color="primary"
            onClick={() => handleEdit(row)}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            size="small"
            color="error"
            onClick={() => handleDelete(row.id)}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  const fetchStudents = async () => {
    setLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      const dummyData = generateDummyStudents();
      setStudents(dummyData);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleAdd = () => {
    setOpenAdd(true);
  };

  const handleEdit = (student: any) => {
    setSelectedStudent(student);
    setOpenEdit(true);
  };

  const handleView = (student: any) => {
    setSelectedStudent(student);
    setOpenView(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        setStudents(prev => prev.filter(student => student.id !== id));
      } catch (error) {
        console.error('Error deleting student:', error);
      }
    }
  };

  const handleAddStudent = (newStudent: any) => {
    setStudents(prev => [newStudent, ...prev]);
    setOpenAdd(false);
  };

  const handleUpdateStudent = (updatedStudent: any) => {
    setStudents(prev => prev.map(student => 
      student.id === updatedStudent.id ? updatedStudent : student
    ));
    setOpenEdit(false);
  };

  const filteredStudents = students.filter(student =>
    student.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.rollNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.promotedToClass?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Student Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage student registrations and academic records
          </Typography>
        </Box>
        <IconButton
          onClick={handleAdd}
          sx={{
            bgcolor: 'primary.main',
            color: 'white',
            '&:hover': { bgcolor: 'primary.dark' },
            borderRadius: 2,
            p: 2,
          }}
        >
          <AddIcon />
          <Typography ml={1}>Add Student</Typography>
        </IconButton>
      </Box>

      {/* Search Bar */}
      <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search students by name, roll number, email, or class..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Paper>

      {/* Data Table */}
      <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: 2, boxShadow: 2 }}>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height={200}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer sx={{ maxHeight: 600 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      style={{ 
                        minWidth: column.minWidth, 
                        fontWeight: 'bold',
                        backgroundColor: '#f5f5f5'
                      }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow 
                    hover 
                    key={student.id}
                    sx={{ 
                      '&:last-child td, &:last-child th': { border: 0 },
                      '&:hover': { backgroundColor: '#f8f9fa' }
                    }}
                  >
                    {columns.map((column) => (
                      <TableCell key={column.id}>
                        {column.render ? column.render(student) : student[column.id]}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        
        {filteredStudents.length === 0 && !loading && (
          <Box display="flex" justifyContent="center" alignItems="center" height={200}>
            <Typography color="text.secondary">
              {searchTerm ? 'No students found matching your search.' : 'No students found.'}
            </Typography>
          </Box>
        )}

        {/* Summary */}
        {!loading && filteredStudents.length > 0 && (
          <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
            <Typography variant="body2" color="text.secondary">
              Showing {filteredStudents.length} of {students.length} students
              {searchTerm && ` for "${searchTerm}"`}
            </Typography>
          </Box>
        )}
      </Paper>

      {/* Modals */}
      <AddStudent
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        onSave={handleAddStudent}
      />
      
      <EditStudent
        open={openEdit}
        student={selectedStudent}
        onClose={() => setOpenEdit(false)}
        onSave={handleUpdateStudent}
      />
      
      <StudentDetails
        open={openView}
        student={selectedStudent}
        onClose={() => setOpenView(false)}
      />
    </Box>
  );
};

export default Students;