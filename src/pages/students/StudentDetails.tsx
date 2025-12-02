import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  Typography,
  Chip,
  Box,
  Avatar,
  Divider,
} from '@mui/material';

interface StudentDetailsProps {
  open: boolean;
  student: any;
  onClose: () => void;
}

const StudentDetails: React.FC<StudentDetailsProps> = ({ open, student, onClose }) => {
  if (!student) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
            {student.fullName?.charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="h5" fontWeight="bold">
              {student.fullName}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Roll No: {student.rollNumber}
            </Typography>
          </Box>
        </Box>
      </DialogTitle>
      
      <DialogContent>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Divider />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Email
            </Typography>
            <Typography variant="body1" gutterBottom>
              {student.email}
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Date of Birth
            </Typography>
            <Typography variant="body1" gutterBottom>
              {new Date(student.dateOfBirth).toLocaleDateString()}
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Gender
            </Typography>
            <Typography variant="body1" gutterBottom>
              {student.gender}
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Status
            </Typography>
            <Chip
              label={student.status}
              color={student.status === 'active' ? 'success' : 'default'}
              size="small"
            />
          </Grid>
          
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              Academic Information
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Previous School
            </Typography>
            <Typography variant="body1" gutterBottom>
              {student.previousSchool || 'N/A'}
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Previous Class
            </Typography>
            <Typography variant="body1" gutterBottom>
              {student.previousClass || 'N/A'}
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Previous Grade
            </Typography>
            <Typography variant="body1" gutterBottom>
              {student.previousGrade || 'N/A'}
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Promoted To Class
            </Typography>
            <Chip label={student.promotedToClass} color="primary" />
          </Grid>
          
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              Admission Details
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Admission Amount
            </Typography>
            <Typography variant="body1" gutterBottom>
              ₹{student.admissionAmount}
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Monthly Fees
            </Typography>
            <Typography variant="body1" gutterBottom>
              ₹{student.monthlyFees}
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Admission Date
            </Typography>
            <Typography variant="body1" gutterBottom>
              {new Date(student.admissionDate).toLocaleDateString()}
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Admission Receipt No
            </Typography>
            <Typography variant="body1" gutterBottom>
              {student.admissionReceiptNo || 'N/A'}
            </Typography>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default StudentDetails;