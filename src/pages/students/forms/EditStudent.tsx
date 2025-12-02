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
} from '@mui/material';
import api from '../../../api/api';


interface EditStudentProps {
  open: boolean;
  student: any;
  onClose: () => void;
  onSave: () => void;
}

const EditStudent: React.FC<EditStudentProps> = ({ open, student, onClose, onSave }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
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
    admissionDate: '',
    admissionReceiptNo: '',
    status: 'active' as 'active' | 'inactive',
  });

  useEffect(() => {
    if (student) {
      setFormData({
        fullName: student.fullName || '',
        email: student.email || '',
        dateOfBirth: student.dateOfBirth || '',
        gender: student.gender || 'male',
        previousSchool: student.previousSchool || '',
        previousClass: student.previousClass || '',
        previousGrade: student.previousGrade || '',
        promotedToClass: student.promotedToClass || '',
        admissionAmount: student.admissionAmount || 0,
        monthlyFees: student.monthlyFees || 0,
        admissionDate: student.admissionDate || '',
        admissionReceiptNo: student.admissionReceiptNo || '',
        status: student.status || 'active',
      });
    }
  }, [student]);

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await api.put(`/students/${student.id}`, formData);
      onSave();
      onClose();
    } catch (error) {
      console.error('Error updating student:', error);
    } finally {
      setLoading(false);
    }
  };

  const classes = ['Nursery', 'KG', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th'];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h5" fontWeight="bold">
          Edit Student - {student?.rollNumber}
        </Typography>
      </DialogTitle>
      
      <DialogContent>
        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Full Name"
              value={formData.fullName}
              onChange={(e) => handleChange('fullName', e.target.value)}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
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
              value={formData.previousSchool}
              onChange={(e) => handleChange('previousSchool', e.target.value)}
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
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Promoted To Class</InputLabel>
              <Select
                value={formData.promotedToClass}
                label="Promoted To Class"
                onChange={(e) => handleChange('promotedToClass', e.target.value)}
              >
                {classes.map((cls) => (
                  <MenuItem key={cls} value={cls}>{cls}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={formData.status}
                label="Status"
                onChange={(e) => handleChange('status', e.target.value)}
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Admission Amount"
              type="number"
              value={formData.admissionAmount}
              onChange={(e) => handleChange('admissionAmount', Number(e.target.value))}
              InputProps={{ startAdornment: <Typography>₹</Typography> }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Monthly Fees"
              type="number"
              value={formData.monthlyFees}
              onChange={(e) => handleChange('monthlyFees', Number(e.target.value))}
              InputProps={{ startAdornment: <Typography>₹</Typography> }}
            />
          </Grid>
        </Grid>
      </DialogContent>
      
      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose}>Cancel</Button>
       
          Update Student
        
      </DialogActions>
    </Dialog>
  );
};

export default EditStudent;