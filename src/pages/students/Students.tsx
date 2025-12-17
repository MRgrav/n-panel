
import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Chip,
  Avatar,
  TextField,
  CircularProgress,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  InputAdornment,
  Button,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Visibility as ViewIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { del, get } from '../../api/api';
import AddStudent from './forms/AddStudent';
import EditStudent from './forms/EditStudent';
import StudentDetails from './StudentDetails';
import { useAuth } from '../../hooks/useAuth';

interface Student {
  id: number;
  name: string;
  email: string;
  rollNo: string | null;
  grade: string | null;
  dateOfBirth: string | null;
  enrolledAt: string;
  gender: string | null;
  previousSchoolName: string | null;
  previousClass: string | null;
  previousGrade: string | null;
  promotedToClass: string | null;
  totalAdmissionAmount: number | null;
  monthlyFees: number | null;
  admissionDate: string | null;
  admissionReceiptNo: string | null;
  admissionReceiptLink: string | null;
  status?: 'active' | 'inactive';
  classroom?: any;
  school: {
    id: number;
    name: string;
    schoolCode: string;
  };
  user: {
    email: string;
    role: string;
  };
}

const Students: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const {user} = useAuth()
  const token = user?.accessToken || '';
  const [pagination, setPagination] = useState({
    total: 0,
    pages: 0,
    currentPage: 1,
    perPage: 10
  });

  const columns = [
    {
      id: 'student',
      label: 'Student',
      minWidth: 200,
      render: (row: Student) => (
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar sx={{ bgcolor: 'primary.main' }}>
            {row.name?.charAt(0).toUpperCase() || 'S'}
          </Avatar>
          <Box>
            <Typography variant="subtitle2" fontWeight="bold">
              {row.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Roll No: {row.rollNo || 'N/A'}
            </Typography>
          </Box>
        </Box>
      ),
    },
    {
      id: 'class',
      label: 'Class',
      minWidth: 120,
      render: (row: Student) => (
        <Chip 
          label={row.grade || 'Not Assigned'} 
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
      render: (row: Student) => (
        <Box>
          <Typography variant="body2">{row.email}</Typography>
          <Typography variant="body2" color="text.secondary">
            Enrolled: {new Date(row.enrolledAt).toLocaleDateString()}
          </Typography>
        </Box>
      ),
    },
    {
      id: 'academic',
      label: 'Academic History',
      minWidth: 200,
      render: (row: Student) => (
        <Box>
          <Typography variant="body2">
            Previous: {row.previousClass || 'N/A'} - {row.previousSchoolName || 'N/A'}
          </Typography>
          <Typography variant="body2">
            Grade: {row.previousGrade || 'N/A'}
          </Typography>
        </Box>
      ),
    },
    {
      id: 'fees',
      label: 'Fees',
      minWidth: 150,
      render: (row: Student) => (
        <Box>
          <Typography variant="body2">
            Admission: ₹{row.totalAdmissionAmount || 0}
          </Typography>
          <Typography variant="body2">
            Monthly: ₹{row.monthlyFees || 0}
          </Typography>
        </Box>
      ),
    },
    {
      id: 'status',
      label: 'Status',
      minWidth: 100,
      render: (row: Student) => {
        // Determine status from enrollment date or other logic
        const isActive = row.enrolledAt && new Date(row.enrolledAt) <= new Date();
        return (
          <Chip
            label={isActive ? 'Active' : 'Inactive'}
            color={isActive ? 'success' : 'default'}
            size="small"
          />
        );
      },
    },
    {
      id: 'actions',
      label: 'Actions',
      minWidth: 150,
      render: (row: Student) => (
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
      const data = await get(`/students?schoolCode=0001`, {}, token); // Pass token as third argument
      setStudents(data.students || []);
      setPagination(data.pagination || {
        total: 0,
        pages: 0,
        currentPage: 1,
        perPage: 10
      });
    } catch (error) {
      console.error('Error fetching students:', error);
      setStudents([]);
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

  const handleEdit = (student: Student) => {
    setSelectedStudent(student);
    setOpenEdit(true);
  };

  const handleView = (student: Student) => {
    setSelectedStudent(student);
    setOpenView(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await del(`/students/${id}`);
        fetchStudents();
      } catch (error) {
        console.error('Error deleting student:', error);
      }
    }
  };

  const filteredStudents = students.filter(student =>
    student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (student.rollNo && student.rollNo.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handlePageChange = (newPage: number) => {
    fetchStudents(newPage);
  };

  return (
    <Box>
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
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAdd}
          sx={{
            borderRadius: 2,
            py: 1,
            px: 3,
          }}
        >
          Add Student
        </Button>
      </Box>

      {/* Search Bar */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search students by name, email, or roll number..."
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
      <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: 2 }}>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height={400}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <TableContainer>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    {columns.map((column) => (
                      <TableCell
                        key={column.id}
                        style={{ minWidth: column.minWidth, fontWeight: 'bold' }}
                      >
                        {column.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredStudents.map((student) => (
                    <TableRow hover key={student.id}>
                      {columns.map((column) => (
                        <TableCell key={column.id}>
                          {column.render ? column.render(student) : student[column.id as keyof Student]}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            
            {/* Pagination */}
            {pagination.pages > 1 && (
              <Box display="flex" justifyContent="center" p={2}>
                <Box display="flex" gap={1}>
                  {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={pagination.currentPage === page ? "contained" : "outlined"}
                      size="small"
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </Button>
                  ))}
                </Box>
              </Box>
            )}
          </>
        )}
        
        {filteredStudents.length === 0 && !loading && (
          <Box display="flex" justifyContent="center" alignItems="center" height={200}>
            <Typography color="text.secondary">
              No students found. {searchTerm && 'Try changing your search terms.'}
            </Typography>
          </Box>
        )}
      </Paper>

      {/* Modals */}
      <AddStudent
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        onSave={() => {
          setOpenAdd(false);
          fetchStudents();
        }}
      />
      
      <EditStudent
        open={openEdit}
        student={selectedStudent}
        onClose={() => setOpenEdit(false)}
        onSave={() => {
          setOpenEdit(false);
          fetchStudents();
        }}
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