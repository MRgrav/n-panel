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
} from '@mui/material';

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
  const [existingStudent, setExistingStudent] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    type: 'new' as 'new' | 'existing',
    existingRollNumber: '',
    fullName: '',
    email: '',
    dateOfBirth: '',
    gender: 'male' as 'male' | 'female' | 'other',
    previousSchool: '',
    previousClass: '',
    previousGrade: '',
    promotedToClass: '',
    admissionAmount: 0,
    monthlyFees: 0,
    admissionDate: new Date().toISOString().split('T')[0],
    admissionReceiptNo: '',
  });

  const classes = ['Nursery', 'KG', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th'];

  useEffect(() => {
    // Auto-fill fees based on class
    const feeStructure: { [key: string]: { admission: number; monthly: number } } = {
      'Nursery': { admission: 5000, monthly: 1000 },
      'KG': { admission: 6000, monthly: 1200 },
      // Add more classes as needed
    };
    
    const fees = feeStructure[formData.promotedToClass] || { admission: 0, monthly: 0 };
    setFormData(prev => ({
      ...prev,
      admissionAmount: fees.admission,
      monthlyFees: fees.monthly
    }));
  }, [formData.promotedToClass]);

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
    if (!formData.existingRollNumber) return;
    
    setLoading(true);
    try {
      // API call to fetch existing student
      const res = await api.get(`/students/roll/${formData.existingRollNumber}`);
      setExistingStudent(res.data);
      
      // Auto-fill form with existing student data
      setFormData(prev => ({
        ...prev,
        fullName: res.data.fullName,
        email: res.data.email,
        dateOfBirth: res.data.dateOfBirth,
        gender: res.data.gender,
        previousSchool: res.data.previousSchool,
        previousClass: res.data.previousClass,
        previousGrade: res.data.previousGrade,
      }));
    } catch (error) {
      console.error('Error fetching student:', error);
      setExistingStudent(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await api.post('/students', {
        ...formData,
        rollNumber: formData.type === 'existing' ? formData.existingRollNumber : generateRollNumber(),
        status: 'active'
      });
      onSave();
      onClose();
      resetForm();
    } catch (error) {
      console.error('Error creating student:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setActiveStep(0);
    setFormData({
      type: 'new',
      existingRollNumber: '',
      fullName: '',
      email: '',
      dateOfBirth: '',
      gender: 'male',
      previousSchool: '',
      previousClass: '',
      previousGrade: '',
      promotedToClass: '',
      admissionAmount: 0,
      monthlyFees: 0,
      admissionDate: new Date().toISOString().split('T')[0],
      admissionReceiptNo: '',
    });
    setExistingStudent(null);
  };

  const generateRollNumber = () => {
    return `STU${Date.now()}`;
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <FormLabel component="legend">Student Type</FormLabel>
            <RadioGroup
              value={formData.type}
              onChange={(e) => handleChange('type', e.target.value)}
              sx={{ mt: 2 }}
            >
              <FormControlLabel value="new" control={<Radio />} label="New Student" />
              <FormControlLabel value="existing" control={<Radio />} label="Existing Student" />
            </RadioGroup>

            {formData.type === 'existing' && (
              <Box mt={3}>
                <Grid container spacing={2} alignItems="flex-end">
                  <Grid item xs={9}>
                    <TextField
                      fullWidth
                      label="Roll Number"
                      value={formData.existingRollNumber}
                      onChange={(e) => handleChange('existingRollNumber', e.target.value)}
                      placeholder="Enter existing student roll number"
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <LoadingButton
                      fullWidth
                      variant="contained"
                      onClick={handleExistingStudentSearch}
                      loading={loading}
                    >
                      Search
                    </LoadingButton>
                  </Grid>
                </Grid>
                
                {existingStudent && (
                  <Alert severity="success" sx={{ mt: 2 }}>
                    Student found: {existingStudent.fullName} - Class: {existingStudent.promotedToClass}
                  </Alert>
                )}
                
                {formData.existingRollNumber && !existingStudent && !loading && (
                  <Alert severity="warning" sx={{ mt: 2 }}>
                    No student found with this roll number.
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
                value={formData.fullName}
                onChange={(e) => handleChange('fullName', e.target.value)}
                required
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
                value={formData.previousSchool}
                onChange={(e) => handleChange('previousSchool', e.target.value)}
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
                placeholder="e.g., A+, 95%"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Promoted To Class</InputLabel>
                <Select
                  value={formData.promotedToClass}
                  label="Promoted To Class"
                  onChange={(e) => handleChange('promotedToClass', e.target.value)}
                  required
                >
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
                value={formData.admissionAmount}
                onChange={(e) => handleChange('admissionAmount', Number(e.target.value))}
                InputProps={{ startAdornment: <Typography>₹</Typography> }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Monthly Fees"
                type="number"
                value={formData.monthlyFees}
                onChange={(e) => handleChange('monthlyFees', Number(e.target.value))}
                InputProps={{ startAdornment: <Typography>₹</Typography> }}
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
              <Button variant="outlined" component="label">
                Upload Admission Receipt
                <input type="file" hidden accept="image/*,.pdf" />
              </Button>
            </Grid>
          </Grid>
        );

      case 4:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>Review Student Information</Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="subtitle2">Full Name:</Typography>
                <Typography>{formData.fullName}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2">Email:</Typography>
                <Typography>{formData.email}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2">Date of Birth:</Typography>
                <Typography>{formData.dateOfBirth}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2">Gender:</Typography>
                <Typography>{formData.gender}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2">Previous Class:</Typography>
                <Typography>{formData.previousClass}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2">Promoted To:</Typography>
                <Typography>{formData.promotedToClass}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2">Admission Amount:</Typography>
                <Typography>₹{formData.admissionAmount}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2">Monthly Fees:</Typography>
                <Typography>₹{formData.monthlyFees}</Typography>
              </Grid>
            </Grid>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h5" fontWeight="bold">
          Add New Student
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
          <Button variant="contained" onClick={handleNext}>
            Next
          </Button>
        ) : (
          
            Submit
        )}
      </DialogActions>
    </Dialog>
  );
};

export default AddStudent;