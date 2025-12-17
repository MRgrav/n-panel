// AddStudent.tsx
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stepper,
  Step,
  StepLabel,
  Box,
  Typography,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormLabel,
  Alert,
  InputAdornment,
} from '@mui/material';
import { get, post } from '../../../api/api';
import { useAuth } from '../../../hooks/useAuth';

interface AddStudentProps {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
}

const steps = [
  'Student Type',
  'Personal Details',
  'Academic History',
  'Admission Details',
  'Review & Submit'
];

const AddStudent: React.FC<AddStudentProps> = ({ open, onClose, onSave }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [existingStudent, setExistingStudent] = useState<any>(null);

  const { user } = useAuth()
  const token = user?.accessToken || '';
  
  const [formData, setFormData] = useState({
    type: 'new' as 'new' | 'existing',
    existingRollNumber: '',
    name: '',
    email: '',
    dateOfBirth: '',
    gender: 'male' as 'male' | 'female' | 'other',
    previousSchoolName: '',
    previousClass: '',
    previousGrade: '',
    grade: '',
    totalAdmissionAmount: 0,
    monthlyFees: 0,
    admissionDate: new Date().toISOString().split('T')[0],
    admissionReceiptNo: '',
    admissionReceiptLink: '',
    schoolId: '0001', 
    role: 'STUDENT' as const,
  });

  const classes = ['Nursery', 'KG', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th'];

  useEffect(() => {
    const feeStructure: { [key: string]: { admission: number; monthly: number } } = {
      'Nursery': { admission: 5000, monthly: 1000 },
      'KG': { admission: 6000, monthly: 1200 },
      '1st': { admission: 7000, monthly: 1500 },
      '2nd': { admission: 8000, monthly: 1600 },
      '3rd': { admission: 9000, monthly: 1700 },
      '4th': { admission: 10000, monthly: 1800 },
      '5th': { admission: 11000, monthly: 1900 },
      '6th': { admission: 12000, monthly: 2000 },
      '7th': { admission: 13000, monthly: 2100 },
      '8th': { admission: 14000, monthly: 2200 },
      '9th': { admission: 15000, monthly: 2300 },
      '10th': { admission: 16000, monthly: 2400 },
      '11th': { admission: 17000, monthly: 2500 },
      '12th': { admission: 18000, monthly: 2600 },
    };
    
    const fees = feeStructure[formData.grade] || { admission: 0, monthly: 0 };
    setFormData(prev => ({
      ...prev,
      totalAdmissionAmount: fees.admission,
      monthlyFees: fees.monthly
    }));
  }, [formData.grade]);

  const handleNext = () => {
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleExistingStudentSearch = async () => {
    if (!formData.existingRollNumber) {
      alert('Please enter a roll number');
      return;
    }
    
    setSearchLoading(true);
    try {
      const res = await get(`/students/student?rollNo=${formData.existingRollNumber}`, {}, token);
      const student = res; 
      setExistingStudent(student);
      
      setFormData(prev => ({
        ...prev,
        name: student.name || '',
        email: student.email || '',
        dateOfBirth: student.dateOfBirth ? student.dateOfBirth.split('T')[0] : '',
        gender: (student.gender?.toLowerCase() || 'male') as 'male' | 'female' | 'other',
        previousSchoolName: student.previousSchoolName || '',
        previousClass: student.previousClass || '',
        previousGrade: student.previousGrade || '',
        grade: student.grade || '',
        totalAdmissionAmount: student.totalAdmissionAmount || 0,
        monthlyFees: student.monthlyFees || 0,
        admissionDate: student.admissionDate ? student.admissionDate.split('T')[0] : '',
        admissionReceiptNo: student.admissionReceiptNo || '',
      }));
    } catch (error: any) {
      console.error('Error fetching student:', error);
      if (error.response?.status === 404) {
        alert('No student found with this roll number');
      } else {
        alert('Error searching for student');
      }
      setExistingStudent(null);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        grade: formData.grade,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender.charAt(0).toUpperCase() + formData.gender.slice(1),
        previousSchoolName: formData.previousSchoolName,
        previousClass: formData.previousClass,
        previousGrade: formData.previousGrade,
        promotedToClass: formData.grade, 
        totalAdmissionAmount: formData.totalAdmissionAmount,
        monthlyFees: formData.monthlyFees,
        admissionDate: formData.admissionDate,
        admissionReceiptNo: formData.admissionReceiptNo,
        admissionReceiptLink: formData.admissionReceiptLink,
        schoolId: formData.schoolId,
        role: formData.role,
        ...(formData.type === 'existing' && formData.existingRollNumber && {
          rollNo: formData.existingRollNumber
        })
      };

      await post('/students', payload, token);
      onSave();
      onClose();
      resetForm();
    } catch (error: any) {
      console.error('Error creating student:', error);
      alert(error.response?.data?.message || 'Error creating student');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setActiveStep(0);
    setFormData({
      type: 'new',
      existingRollNumber: '',
      name: '',
      email: '',
      dateOfBirth: '',
      gender: 'male',
      previousSchoolName: '',
      previousClass: '',
      previousGrade: '',
      grade: '',
      totalAdmissionAmount: 0,
      monthlyFees: 0,
      admissionDate: new Date().toISOString().split('T')[0],
      admissionReceiptNo: '',
      admissionReceiptLink: '',
      schoolId: 1,
      role: 'STUDENT',
    });
    setExistingStudent(null);
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <FormLabel component="legend" sx={{ mb: 2, fontWeight: 'bold' }}>Student Type</FormLabel>
            <RadioGroup
              value={formData.type}
              onChange={(e) => {
                handleChange('type', e.target.value);
                if (e.target.value === 'new') {
                  setExistingStudent(null);
                  handleChange('existingRollNumber', '');
                }
              }}
              sx={{ mt: 2 }}
            >
              <FormControlLabel value="new" control={<Radio />} label="New Student" />
              <FormControlLabel value="existing" control={<Radio />} label="Existing Student" />
            </RadioGroup>

            {formData.type === 'existing' && (
              <Box mt={3}>
                <Grid container spacing={2} alignItems="flex-end">
                  <Grid item xs={8}>
                    <TextField
                      fullWidth
                      label="Roll Number"
                      value={formData.existingRollNumber}
                      onChange={(e) => handleChange('existingRollNumber', e.target.value)}
                      placeholder="Enter existing student roll number"
                      disabled={!!existingStudent}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={handleExistingStudentSearch}
                      disabled={!formData.existingRollNumber || !!existingStudent}
                    >
                      {searchLoading ? 'Searching...' : existingStudent ? 'Found' : 'Search'}
                    </Button>
                  </Grid>
                </Grid>
                
                {existingStudent && (
                  <Alert severity="success" sx={{ mt: 2 }}>
                    Student found: {existingStudent.name} - Class: {existingStudent.grade}
                  </Alert>
                )}
              </Box>
            )}
          </Box>
        );

      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Full Name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                required
                disabled={!!existingStudent}
                error={!formData.name}
                helperText={!formData.name ? 'Name is required' : ''}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                required
                disabled={!!existingStudent}
                error={!formData.email}
                helperText={!formData.email ? 'Email is required' : ''}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Date of Birth"
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Gender</InputLabel>
                <Select
                  value={formData.gender}
                  label="Gender"
                  onChange={(e) => handleChange('gender', e.target.value)}
                >
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        );

      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Previous School Name"
                value={formData.previousSchoolName}
                onChange={(e) => handleChange('previousSchoolName', e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Previous Class</InputLabel>
                <Select
                  value={formData.previousClass}
                  label="Previous Class"
                  onChange={(e) => handleChange('previousClass', e.target.value)}
                >
                  {classes.map((cls) => (
                    <MenuItem key={cls} value={cls}>{cls}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Previous Grade/Score"
                value={formData.previousGrade}
                onChange={(e) => handleChange('previousGrade', e.target.value)}
                placeholder="e.g., A, 95%"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Promoted To Class</InputLabel>
                <Select
                  value={formData.grade}
                  label="Promoted To Class"
                  onChange={(e) => handleChange('grade', e.target.value)}
                  error={!formData.grade}
                >
                  <MenuItem value="">Select class</MenuItem>
                  {classes.map((cls) => (
                    <MenuItem key={cls} value={cls}>{cls}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        );

      case 3:
        return (
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Total Admission Amount"
                type="number"
                value={formData.totalAdmissionAmount}
                onChange={(e) => handleChange('totalAdmissionAmount', Number(e.target.value))}
                InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Monthly Fees"
                type="number"
                value={formData.monthlyFees}
                onChange={(e) => handleChange('monthlyFees', Number(e.target.value))}
                InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Admission Date"
                type="date"
                value={formData.admissionDate}
                onChange={(e) => handleChange('admissionDate', e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Admission Receipt No"
                value={formData.admissionReceiptNo}
                onChange={(e) => handleChange('admissionReceiptNo', e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Admission Receipt Link"
                value={formData.admissionReceiptLink}
                onChange={(e) => handleChange('admissionReceiptLink', e.target.value)}
                placeholder="https://example.com/receipt.pdf"
              />
            </Grid>
          </Grid>
        );

      case 4:
        return (
          <Box>
            <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>Review Student Information</Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="text.secondary">Full Name:</Typography>
                <Typography variant="body1">{formData.name}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="text.secondary">Email:</Typography>
                <Typography variant="body1">{formData.email}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="text.secondary">Date of Birth:</Typography>
                <Typography variant="body1">{formData.dateOfBirth}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="text.secondary">Gender:</Typography>
                <Typography variant="body1">{formData.gender}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="text.secondary">Previous Class:</Typography>
                <Typography variant="body1">{formData.previousClass}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="text.secondary">Promoted To:</Typography>
                <Typography variant="body1">{formData.grade}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="text.secondary">Admission Amount:</Typography>
                <Typography variant="body1">₹{formData.totalAdmissionAmount}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="text.secondary">Monthly Fees:</Typography>
                <Typography variant="body1">₹{formData.monthlyFees}</Typography>
              </Grid>
            </Grid>
          </Box>
        );

      default:
        return null;
    }
  };

  const isStepValid = () => {
    switch (activeStep) {
      case 0:
        return true;
      case 1:
        return !!formData.name && !!formData.email && !!formData.dateOfBirth;
      case 2:
        return !!formData.grade;
      case 3:
        return true;
      case 4:
        return true;
      default:
        return false;
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h5" fontWeight="bold">
          {formData.type === 'existing' ? 'Register Existing Student' : 'Add New Student'}
        </Typography>
      </DialogTitle>
      
      <DialogContent>
        <Stepper activeStep={activeStep} sx={{ mb: 4, mt: 2 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {renderStepContent(activeStep)}
      </DialogContent>

      <DialogActions sx={{ p: 3, gap: 1 }}>
        <Button onClick={onClose}>Cancel</Button>
        
        {activeStep > 0 && (
          <Button onClick={handleBack}>Back</Button>
        )}
        
        {activeStep < steps.length - 1 ? (
          <Button 
            variant="contained" 
            onClick={handleNext}
            disabled={!isStepValid()}
          >
            Next
          </Button>
        ) : (
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!formData.name || !formData.email || !formData.grade || loading}
          >
            {loading ? 'Submitting...' : 'Submit'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default AddStudent;