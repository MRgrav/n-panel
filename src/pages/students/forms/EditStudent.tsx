// EditStudent.tsx
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  InputAdornment,
} from '@mui/material';
import { put } from '../../../api/api';
import { useAuth } from '../../../hooks/useAuth';


interface EditStudentProps {
  open: boolean;
  student: any;
  onClose: () => void;
  onSave: () => void;
}

const EditStudent: React.FC<EditStudentProps> = ({ open, student, onClose, onSave }) => {
  const [loading, setLoading] = useState(false);
      const {user} = useAuth()
      const token = user?.accessToken || '';
    
  const [formData, setFormData] = useState({
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
    admissionDate: '',
    admissionReceiptNo: '',
    admissionReceiptLink: '',
  });

  useEffect(() => {
    if (student) {
      setFormData({
        name: student.name || '',
        email: student.email || '',
        dateOfBirth: student.dateOfBirth ? student.dateOfBirth.split('T')[0] : '',
        gender: student.gender?.toLowerCase() || 'male',
        previousSchoolName: student.previousSchoolName || '',
        previousClass: student.previousClass || '',
        previousGrade: student.previousGrade || '',
        grade: student.grade || '',
        totalAdmissionAmount: student.totalAdmissionAmount || 0,
        monthlyFees: student.monthlyFees || 0,
        admissionDate: student.admissionDate ? student.admissionDate.split('T')[0] : '',
        admissionReceiptNo: student.admissionReceiptNo || '',
        admissionReceiptLink: student.admissionReceiptLink || '',
      });
    }
  }, [student]);

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!student?.id) return;
    
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
      };

      await put(`/students/${student.id}`, payload, token);
      onSave();
      onClose();
    } catch (error: any) {
      console.error('Error updating student:', error);
      alert(error.response?.data?.message || 'Error updating student');
    } finally {
      setLoading(false);
    }
  };

  const classes = ['Nursery', 'KG', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th'];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h5" fontWeight="bold">
          Edit Student - {student?.rollNo || 'N/A'}
        </Typography>
      </DialogTitle>
      
      <DialogContent>
        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Full Name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              required
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              required
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Date of Birth"
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => handleChange('dateOfBirth', e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
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
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Previous School"
              value={formData.previousSchoolName}
              onChange={(e) => handleChange('previousSchoolName', e.target.value)}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Previous Class</InputLabel>
              <Select
                value={formData.previousClass}
                label="Previous Class"
                onChange={(e) => handleChange('previousClass', e.target.value)}
              >
                <MenuItem value="">Select previous class</MenuItem>
                {classes.map((cls) => (
                  <MenuItem key={cls} value={cls}>{cls}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Previous Grade"
              value={formData.previousGrade}
              onChange={(e) => handleChange('previousGrade', e.target.value)}
              placeholder="e.g., A, 95%"
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Current Class</InputLabel>
              <Select
                value={formData.grade}
                label="Current Class"
                onChange={(e) => handleChange('grade', e.target.value)}
                required
              >
                {classes.map((cls) => (
                  <MenuItem key={cls} value={cls}>{cls}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Roll Number"
              value={student?.rollNo || ''}
              disabled
              helperText="Roll number cannot be changed"
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Admission Amount"
              type="number"
              value={formData.totalAdmissionAmount}
              onChange={(e) => handleChange('totalAdmissionAmount', Number(e.target.value))}
              InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Monthly Fees"
              type="number"
              value={formData.monthlyFees}
              onChange={(e) => handleChange('monthlyFees', Number(e.target.value))}
              InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Admission Date"
              type="date"
              value={formData.admissionDate}
              onChange={(e) => handleChange('admissionDate', e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
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
      </DialogContent>
      
      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          loading={loading}
          disabled={!formData.name || !formData.email || !formData.grade}
        >
          Update Student
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditStudent;