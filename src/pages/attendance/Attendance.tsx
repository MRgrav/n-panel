// Attendance.tsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Avatar,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  CircularProgress,
  Divider,
  Tooltip,
  Switch,
  FormControlLabel,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  ToggleButton,
  ToggleButtonGroup,
  alpha,
  useTheme,
} from '@mui/material';
import {
  CheckCircle,
  Cancel,
  Visibility,
  Edit,
  Save,
  ClearAll,
  Refresh,
  Person,
  Class as ClassIcon,
  Subject as SubjectIcon,
  CalendarToday,
  Today,
  Check,
  Close,
  Group,
} from '@mui/icons-material';
import { get, post } from '../../api/api';
import { useAuth } from '../../hooks/useAuth';

interface Student {
  id: number;
  name: string;
  email: string;
  rollNo: string;
  grade: string;
  gender: string;
}

interface Classroom {
  id: number;
  name: string;
  section: string;
  school: {
    id: number;
    name: string;
  };
  students: Student[];
}

interface Subject {
  id: number;
  name: string;
  code: string;
  description: string;
}

interface AttendanceRecord {
  studentId: number;
  rollNo: string;
  studentName: string;
  status: 'present' | 'absent';
  remarks?: string;
}

const Attendance: React.FC = () => {
  const theme = useTheme();
  const { user } = useAuth();
  
  // State management
  const [loading, setLoading] = useState(false);
  const [loadingClasses, setLoadingClasses] = useState(false);
  const [loadingSubjects, setLoadingSubjects] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Data
  const [classes, setClasses] = useState<Classroom[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [students, setStudents] = useState<Student[]>([]);
  
  // Attendance data
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [bulkStatus, setBulkStatus] = useState<'present' | 'absent'>('present');
  const [markForSubject, setMarkForSubject] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(false);
  
  // Current date - cannot be changed
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const apiDate = currentDate.toISOString().split('T')[0];

  // Fetch classes
  const fetchClasses = async () => {
    setLoadingClasses(true);
    try {
      console.log('Fetching classes...');
      const response = await get('/classes', {}, user?.accessToken);
      console.log('Classes response:', response);
      
      if (response?.classrooms) {
        setClasses(response.classrooms);
        console.log('Classes set:', response.classrooms);
      } else {
        console.error('No classrooms in response:', response);
      }
    } catch (error: any) {
      console.error('Error fetching classes:', error);
      setError('Failed to load classes. Please try again.');
    } finally {
      setLoadingClasses(false);
    }
  };

  // Fetch subjects
  const fetchSubjects = async () => {
    setLoadingSubjects(true);
    try {
      const response = await get('/subjects', {}, user?.accessToken);
      if (response?.subjects) {
        setSubjects(response.subjects);
      }
    } catch (error: any) {
      console.error('Error fetching subjects:', error);
      setError('Failed to load subjects. Please try again.');
    } finally {
      setLoadingSubjects(false);
    }
  };

  // Initialize attendance records for students
  const initializeAttendanceRecords = (studentsList: Student[]) => {
    console.log('Initializing attendance records for students:', studentsList);
    const records: AttendanceRecord[] = studentsList.map(student => ({
      studentId: student.id,
      rollNo: student.rollNo,
      studentName: student.name,
      status: 'present', // Default to present
      remarks: '',
    }));
    setAttendanceRecords(records);
    console.log('Attendance records initialized:', records);
  };

  // Handle class selection
  const handleClassSelect = (event: any) => {
    const classId = event.target.value;
    console.log('Class selected:', classId);
    
    if (!classId) {
      setSelectedClass('');
      setStudents([]);
      setAttendanceRecords([]);
      return;
    }

    const selected = classes.find(c => c.id.toString() === classId);
    console.log('Found class:', selected);
    
    if (selected) {
      setSelectedClass(classId);
      const classStudents = selected.students || [];
      console.log('Class students:', classStudents);
      setStudents(classStudents);
      initializeAttendanceRecords(classStudents);
      setSelectedSubject(''); // Reset subject when class changes
      setEditMode(false); // Reset edit mode
      setError(null);
      
      // Log for debugging
      console.log('Selected class ID:', classId);
      console.log('Selected class object:', selected);
      console.log('Number of students:', classStudents.length);
    } else {
      console.error('Class not found for ID:', classId);
      setError('Selected class not found');
    }
  };

  // Handle subject selection
  const handleSubjectSelect = (event: any) => {
    const subjectId = event.target.value;
    setSelectedSubject(subjectId);
    console.log('Subject selected:', subjectId);
  };

  // Handle attendance status change for a student
  const handleAttendanceChange = (studentId: number, status: 'present' | 'absent') => {
    if (!editMode) return;
    
    setAttendanceRecords(prev =>
      prev.map(record =>
        record.studentId === studentId ? { ...record, status } : record
      )
    );
  };

  // Apply bulk attendance
  const handleBulkAttendance = () => {
    if (!editMode) return;
    
    setAttendanceRecords(prev =>
      prev.map(record => ({ ...record, status: bulkStatus }))
    );
    setSuccess(`Marked all students as ${bulkStatus}`);
  };

  // Save attendance
  const handleSaveAttendance = async () => {
    if (!user?.accessToken || !selectedClass) {
      setError('Missing required information');
      return;
    }

    if (markForSubject && !selectedSubject) {
      setError('Please select a subject for subject-wise attendance');
      return;
    }

    setSaving(true);
    try {
      const selectedClassObj = classes.find(c => c.id.toString() === selectedClass);
      const selectedSubjectObj = subjects.find(s => s.id.toString() === selectedSubject);
      
      console.log('Saving attendance with data:', {
        classroomId: parseInt(selectedClass),
        subjectId: markForSubject && selectedSubject ? parseInt(selectedSubject) : null,
        date: apiDate,
        attendance: attendanceRecords.map(record => ({
          studentId: record.studentId,
          status: record.status,
          remarks: record.remarks || '',
        })),
        markedBy: user?.email || user?.name || 'teacher',
        schoolId: selectedClassObj?.school?.id || 1,
      });

      const payload = {
        classroomId: parseInt(selectedClass),
        subjectId: markForSubject && selectedSubject ? parseInt(selectedSubject) : null,
        date: apiDate,
        attendance: attendanceRecords.map(record => ({
          studentId: record.studentId,
          status: record.status,
          remarks: record.remarks || '',
        })),
        markedBy: user?.email || user?.name || 'teacher',
        schoolId: selectedClassObj?.school?.id || 1,
      };

      // Call your attendance API endpoint
      const response = await post('/attendance', payload, user.accessToken);
      
      if (response) {
        setSuccess(`Attendance saved successfully for ${selectedClassObj?.name} ${selectedClassObj?.section}${selectedSubjectObj ? ` - ${selectedSubjectObj.name}` : ''}`);
        setEditMode(false);
        
        // Optionally, you might want to fetch updated data
        setTimeout(() => {
          // Reinitialize the selected class data
          const currentSelected = classes.find(c => c.id.toString() === selectedClass);
          if (currentSelected) {
            initializeAttendanceRecords(currentSelected.students || []);
          }
        }, 1000);
      } else {
        throw new Error('Failed to save attendance');
      }
    } catch (error: any) {
      console.error('Error saving attendance:', error);
      setError(error.response?.data?.message || error.message || 'Failed to save attendance');
    } finally {
      setSaving(false);
    }
  };

  // Reset attendance to default (all present)
  const handleResetAttendance = () => {
    initializeAttendanceRecords(students);
    setSuccess('Attendance reset to default (all present)');
  };

  // Toggle edit mode
  const handleToggleEditMode = () => {
    if (editMode) {
      // Save before exiting edit mode
      handleSaveAttendance();
    } else {
      if (!selectedClass) {
        setError('Please select a class first');
        return;
      }
      if (markForSubject && !selectedSubject) {
        setError('Please select a subject for subject-wise attendance');
        return;
      }
      setEditMode(true);
    }
  };

  // Get status color
  const getStatusColor = (status: 'present' | 'absent') => {
    return status === 'present' ? 'success' : 'error';
  };

  // Get status icon
  const getStatusIcon = (status: 'present' | 'absent') => {
    return status === 'present' ? <Check fontSize="small" /> : <Close fontSize="small" />;
  };

  // Calculate attendance summary
  const getAttendanceSummary = () => {
    const presentCount = attendanceRecords.filter(r => r.status === 'present').length;
    const absentCount = attendanceRecords.filter(r => r.status === 'absent').length;
    const total = attendanceRecords.length;
    const percentage = total > 0 ? ((presentCount / total) * 100).toFixed(1) : '0.0';

    return { presentCount, absentCount, total, percentage };
  };

  // Refresh all data
  const handleRefresh = () => {
    fetchClasses();
    fetchSubjects();
    setSuccess('Data refreshed successfully');
  };

  // Initialize data
  useEffect(() => {
    console.log('Component mounted, fetching data...');
    fetchClasses();
    fetchSubjects();
  }, []);

  // Debug log when classes change
  useEffect(() => {
    console.log('Classes updated:', classes);
  }, [classes]);

  // When students change, update attendance records
  useEffect(() => {
    console.log('Students changed:', students.length);
    if (students.length > 0 && attendanceRecords.length === 0) {
      initializeAttendanceRecords(students);
    }
  }, [students]);

  const summary = getAttendanceSummary();
  const selectedClassObj = classes.find(c => c.id.toString() === selectedClass);
  const selectedSubjectObj = subjects.find(s => s.id.toString() === selectedSubject);

  return (
    <Box sx={{ p: 3, maxWidth: 1400, mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom color="primary">
              📋 Attendance Management
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Mark student attendance {markForSubject ? 'subject-wise' : 'for the entire class'}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            {/* Date Display */}
            <Paper elevation={0} sx={{ 
              p: 2, 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1.5,
              bgcolor: alpha(theme.palette.primary.main, 0.08),
              borderRadius: 2,
              border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`
            }}>
              <Today color="primary" />
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Today's Date
                </Typography>
                <Typography variant="subtitle1" fontWeight="bold" color="primary">
                  {formattedDate}
                </Typography>
              </Box>
            </Paper>

            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={handleRefresh}
              size="small"
            >
              Refresh
            </Button>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />
      </Box>

      {/* Alerts */}
      {error && (
        <Alert 
          severity="error" 
          sx={{ mb: 3, borderRadius: 2 }} 
          onClose={() => setError(null)}
        >
          {error}
        </Alert>
      )}

      {/* Debug Info (remove in production) */}
      {process.env.NODE_ENV === 'development' && (
        <Box sx={{ mb: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
          <Typography variant="caption" color="text.secondary">
            Debug: Classes: {classes.length} | Selected: {selectedClass} | Students: {students.length} | Records: {attendanceRecords.length}
          </Typography>
        </Box>
      )}

      {/* Controls Section */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* Class Selection */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', borderRadius: 2, boxShadow: 1 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <ClassIcon color="primary" />
                <Typography variant="h6" fontWeight="bold">
                  Select Class
                </Typography>
              </Box>
              
              {loadingClasses ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                  <CircularProgress size={30} />
                  <Typography variant="body2" sx={{ ml: 2 }}>
                    Loading classes...
                  </Typography>
                </Box>
              ) : (
                <FormControl fullWidth size="medium">
                  <InputLabel id="class-select-label">Choose Class & Section</InputLabel>
                  <Select
                    labelId="class-select-label"
                    value={selectedClass}
                    label="Choose Class & Section"
                    onChange={handleClassSelect}
                    disabled={editMode}
                    renderValue={(value) => {
                      const cls = classes.find(c => c.id.toString() === value);
                      return cls ? `Class ${cls.name} - Section ${cls.section}` : 'Select a class';
                    }}
                  >
                    <MenuItem value="">
                      <em>Select a class</em>
                    </MenuItem>
                    {classes.map(cls => (
                      <MenuItem key={cls.id} value={cls.id.toString()}>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                          <Typography variant="body1" fontWeight="medium">
                            Class {cls.name} - Section {cls.section}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {cls.school?.name || 'Unknown School'} • {cls.students?.length || 0} students
                          </Typography>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Subject Selection */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', borderRadius: 2, boxShadow: 1 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <SubjectIcon color="primary" />
                  <Typography variant="h6" fontWeight="bold">
                    Subject-wise
                  </Typography>
                </Box>
                <FormControlLabel
                  control={
                    <Switch
                      checked={markForSubject}
                      onChange={(e) => setMarkForSubject(e.target.checked)}
                      disabled={editMode || !selectedClass}
                      color="primary"
                    />
                  }
                  label={markForSubject ? "Enabled" : "Disabled"}
                />
              </Box>

              {markForSubject && (
                <FormControl fullWidth size="medium">
                  <InputLabel id="subject-select-label">Select Subject</InputLabel>
                  <Select
                    labelId="subject-select-label"
                    value={selectedSubject}
                    label="Select Subject"
                    onChange={handleSubjectSelect}
                    disabled={editMode || !selectedClass}
                    renderValue={(value) => {
                      const subject = subjects.find(s => s.id.toString() === value);
                      return subject ? `${subject.name} (${subject.code})` : 'Select subject';
                    }}
                  >
                    <MenuItem value="">
                      <em>Select subject</em>
                    </MenuItem>
                    {subjects.map(subject => (
                      <MenuItem key={subject.id} value={subject.id.toString()}>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                          <Typography variant="body1" fontWeight="medium">
                            {subject.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Code: {subject.code}
                          </Typography>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
              
              {!markForSubject && selectedClass && (
                <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Full-day attendance</strong> will be marked for all subjects
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Actions */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', borderRadius: 2, boxShadow: 1 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Attendance Actions
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {selectedClass && (
                  <Button
                    variant={editMode ? "contained" : "outlined"}
                    color={editMode ? "success" : "primary"}
                    startIcon={editMode ? <Save /> : <Edit />}
                    onClick={handleToggleEditMode}
                    disabled={saving || (markForSubject && !selectedSubject)}
                    fullWidth
                    size="large"
                  >
                    {editMode 
                      ? 'Save & Exit Edit Mode' 
                      : 'Enter Edit Mode'
                    }
                  </Button>
                )}

                {editMode && selectedClass && (
                  <>
                    <Button
                      variant="outlined"
                      color="secondary"
                      startIcon={<ClearAll />}
                      onClick={handleResetAttendance}
                      fullWidth
                    >
                      Reset All to Present
                    </Button>

                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                      <Typography variant="body2" sx={{ flex: 1 }}>
                        Bulk action:
                      </Typography>
                      <Button
                        variant={bulkStatus === 'present' ? 'contained' : 'outlined'}
                        color="success"
                        size="small"
                        onClick={() => {
                          setBulkStatus('present');
                          handleBulkAttendance();
                        }}
                        sx={{ flex: 1 }}
                      >
                        All Present
                      </Button>
                      <Button
                        variant={bulkStatus === 'absent' ? 'contained' : 'outlined'}
                        color="error"
                        size="small"
                        onClick={() => {
                          setBulkStatus('absent');
                          handleBulkAttendance();
                        }}
                        sx={{ flex: 1 }}
                      >
                        All Absent
                      </Button>
                    </Box>
                  </>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Class Info & Summary */}
      {selectedClass && selectedClassObj && (
        <Card sx={{ mb: 3, borderRadius: 2, boxShadow: 1 }}>
          <CardContent>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={8}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
                    <Group sx={{ fontSize: 28 }} />
                  </Avatar>
                  <Box>
                    <Typography variant="h5" fontWeight="bold">
                      Class {selectedClassObj.name} - Section {selectedClassObj.section}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {students.length} student{students.length !== 1 ? 's' : ''} enrolled • 
                      School: {selectedClassObj.school?.name || 'Unknown'}
                      {markForSubject && selectedSubjectObj && (
                        <>
                          {' • '}
                          Subject: <strong>{selectedSubjectObj.name}</strong>
                        </>
                      )}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Paper sx={{ 
                  p: 2, 
                  bgcolor: alpha(theme.palette.primary.main, 0.05), 
                  borderRadius: 2,
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
                }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Today fontSize="small" /> Current Attendance Status
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <Box>
                      <Typography variant="h3" color="primary" fontWeight="bold">
                        {summary.percentage}%
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Attendance Rate
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: 'success.main' }} />
                        <Typography variant="body2">
                          {summary.presentCount} Present
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: 'error.main' }} />
                        <Typography variant="body2">
                          {summary.absentCount} Absent
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Students Attendance Table */}
      {selectedClass && students.length > 0 && (
        <Card sx={{ borderRadius: 2, boxShadow: 1 }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Box>
                <Typography variant="h6" fontWeight="bold">
                  Students List ({students.length})
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {editMode ? '🟢 Edit mode: Click on student rows to toggle attendance' : '🔴 View mode: Enter edit mode to mark attendance'}
                </Typography>
              </Box>
              {editMode && (
                <Chip 
                  label="EDITING" 
                  color="warning" 
                  size="small"
                  sx={{ fontWeight: 'bold' }}
                />
              )}
            </Box>

            <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2, maxHeight: 500 }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow sx={{ bgcolor: 'grey.50' }}>
                    <TableCell sx={{ width: '15%' }}><Typography fontWeight="bold">Roll No</Typography></TableCell>
                    <TableCell sx={{ width: '40%' }}><Typography fontWeight="bold">Student Details</Typography></TableCell>
                    <TableCell sx={{ width: '15%' }}><Typography fontWeight="bold">Gender</Typography></TableCell>
                    <TableCell align="center" sx={{ width: '30%' }}>
                      <Typography fontWeight="bold">Attendance Status</Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {students.map((student) => {
                    const attendanceRecord = attendanceRecords.find(r => r.studentId === student.id);
                    const status = attendanceRecord?.status || 'present';

                    return (
                      <TableRow 
                        key={student.id} 
                        hover 
                        sx={{ 
                          '&:hover': { 
                            bgcolor: editMode ? alpha(theme.palette.action.hover, 0.5) : 'inherit',
                            cursor: editMode ? 'pointer' : 'default'
                          }
                        }}
                        onClick={() => {
                          if (editMode) {
                            handleAttendanceChange(student.id, status === 'present' ? 'absent' : 'present');
                          }
                        }}
                      >
                        <TableCell>
                          <Chip
                            label={student.rollNo}
                            color="primary"
                            variant="outlined"
                            size="small"
                            sx={{ fontWeight: 'bold' }}
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar sx={{ 
                              width: 40, 
                              height: 40, 
                              bgcolor: alpha(theme.palette.primary.main, 0.1),
                              color: 'primary.main',
                              fontSize: 14,
                              fontWeight: 'bold'
                            }}>
                              {student.name.charAt(0).toUpperCase()}
                            </Avatar>
                            <Box>
                              <Typography variant="body2" fontWeight="medium">
                                {student.name}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {student.email}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={student.gender}
                            size="small"
                            variant="outlined"
                            sx={{ 
                              borderColor: student.gender === 'Male' ? 'primary.main' : 'secondary.main',
                              color: student.gender === 'Male' ? 'primary.main' : 'secondary.main',
                              fontWeight: 'medium'
                            }}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Box sx={{ 
                            display: 'flex', 
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: editMode ? 2 : 1 
                          }}>
                            {editMode ? (
                              <>
                                <Button
                                  variant={status === 'present' ? 'contained' : 'outlined'}
                                  color="success"
                                  size="small"
                                  startIcon={<Check />}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleAttendanceChange(student.id, 'present');
                                  }}
                                  sx={{ 
                                    minWidth: 100,
                                    bgcolor: status === 'present' ? 'success.main' : 'transparent',
                                    '&:hover': {
                                      bgcolor: status === 'present' ? 'success.dark' : 'action.hover'
                                    }
                                  }}
                                >
                                  Present
                                </Button>
                                <Button
                                  variant={status === 'absent' ? 'contained' : 'outlined'}
                                  color="error"
                                  size="small"
                                  startIcon={<Close />}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleAttendanceChange(student.id, 'absent');
                                  }}
                                  sx={{ 
                                    minWidth: 100,
                                    bgcolor: status === 'absent' ? 'error.main' : 'transparent',
                                    '&:hover': {
                                      bgcolor: status === 'absent' ? 'error.dark' : 'action.hover'
                                    }
                                  }}
                                >
                                  Absent
                                </Button>
                              </>
                            ) : (
                              <Chip
                                label={status.toUpperCase()}
                                color={getStatusColor(status)}
                                icon={getStatusIcon(status)}
                                sx={{ 
                                  fontWeight: 'bold',
                                  px: 2,
                                  py: 1,
                                  fontSize: '0.875rem',
                                  '& .MuiChip-icon': {
                                    color: 'inherit',
                                    fontSize: '1rem'
                                  }
                                }}
                              />
                            )}
                          </Box>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}

      {/* No Class Selected State */}
      {!selectedClass && !loadingClasses && (
        <Box sx={{ 
          textAlign: 'center', 
          py: 10,
          px: 3,
          bgcolor: alpha(theme.palette.background.paper, 0.5),
          borderRadius: 2
        }}>
          <Avatar sx={{ 
            width: 100, 
            height: 100, 
            bgcolor: alpha(theme.palette.primary.main, 0.1),
            color: 'primary.main',
            mb: 3,
            mx: 'auto'
          }}>
            <ClassIcon sx={{ fontSize: 50 }} />
          </Avatar>
          <Typography variant="h5" gutterBottom fontWeight="bold">
            Select a Class to Begin
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 500, mx: 'auto' }}>
            Choose a class from the dropdown above to view students and mark attendance for today
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button
              variant="contained"
              startIcon={<Refresh />}
              onClick={handleRefresh}
              sx={{ mt: 2 }}
            >
              Refresh Classes
            </Button>
            <Button
              variant="outlined"
              onClick={() => console.log('Classes data:', classes)}
              sx={{ mt: 2 }}
            >
              Debug Info
            </Button>
          </Box>
        </Box>
      )}

      {/* No Students State */}
      {selectedClass && students.length === 0 && !loadingClasses && (
        <Box sx={{ 
          textAlign: 'center', 
          py: 10,
          px: 3,
          bgcolor: alpha(theme.palette.warning.main, 0.05),
          borderRadius: 2,
          border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`
        }}>
          <Avatar sx={{ 
            width: 100, 
            height: 100, 
            bgcolor: alpha(theme.palette.warning.main, 0.1),
            color: 'warning.main',
            mb: 3,
            mx: 'auto'
          }}>
            <Person sx={{ fontSize: 50 }} />
          </Avatar>
          <Typography variant="h5" gutterBottom fontWeight="bold">
            No Students Found
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 500, mx: 'auto' }}>
            This class doesn't have any students enrolled yet. Please add students to mark attendance.
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Class: {selectedClassObj?.name} - Section: {selectedClassObj?.section}
          </Typography>
        </Box>
      )}

      {/* Loading State */}
      {(loadingClasses || loadingSubjects) && (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          py: 10,
          bgcolor: alpha(theme.palette.background.paper, 0.5),
          borderRadius: 2
        }}>
          <Box sx={{ textAlign: 'center' }}>
            <CircularProgress size={60} />
            <Typography variant="h6" sx={{ mt: 2 }}>
              Loading data...
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Fetching classes and subjects
            </Typography>
          </Box>
        </Box>
      )}

      {/* Success Snackbar */}
      <Snackbar
        open={!!success}
        autoHideDuration={4000}
        onClose={() => setSuccess(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          severity="success" 
          onClose={() => setSuccess(null)}
          sx={{ 
            borderRadius: 2,
            boxShadow: 2,
            alignItems: 'center'
          }}
        >
          <Typography fontWeight="bold">{success}</Typography>
        </Alert>
      </Snackbar>

      {/* Saving Overlay */}
      {saving && (
        <Box sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          bgcolor: 'rgba(255, 255, 255, 0.8)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999
        }}>
          <Card sx={{ p: 4, borderRadius: 2, boxShadow: 3 }}>
            <Box sx={{ textAlign: 'center' }}>
              <CircularProgress size={60} />
              <Typography variant="h6" sx={{ mt: 3 }}>
                Saving Attendance...
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Please wait while we save the attendance records
              </Typography>
            </Box>
          </Card>
        </Box>
      )}
    </Box>
  );
};

export default Attendance;