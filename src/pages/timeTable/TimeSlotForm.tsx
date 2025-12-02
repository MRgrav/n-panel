// TimeSlotForm.tsx
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
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  subject: string;
  teacher: string;
  type: 'class' | 'break' | 'lunch' | 'activity';
}

interface TimeSlotFormProps {
  open: boolean;
  slot: TimeSlot | null;
  onClose: () => void;
  onSave: (slot: TimeSlot) => void;
  day?: string;
  className?: string;
}

const TimeSlotForm: React.FC<TimeSlotFormProps> = ({ 
  open, 
  slot, 
  onClose, 
  onSave, 
  day = 'monday',
  className = 'Class' 
}) => {
  const [formData, setFormData] = useState({
    startTime: new Date(),
    endTime: new Date(),
    subject: '',
    teacher: '',
    type: 'class' as 'class' | 'break' | 'lunch' | 'activity',
  });

  const subjects = [
    'English', 'Mathematics', 'Science', 'Social Studies', 'Hindi',
    'Computer', 'Art & Craft', 'Music', 'PT', 'EVS', 'Sanskrit'
  ];

  const teachers = [
    'Ms. Sharma', 'Mr. Verma', 'Ms. Patel', 'Mr. Singh', 'Ms. Gupta',
    'Ms. Reddy', 'Mr. Kumar', 'Mr. Sharma', 'Ms. Kapoor', 'Mr. Joshi', 'Dr. Mehta'
  ];

  useEffect(() => {
    if (slot) {
      // Parse time strings to Date objects safely
      const [startHours, startMinutes] = slot.startTime.split(':');
      const [endHours, endMinutes] = slot.endTime.split(':');
      
      const startDate = new Date();
      startDate.setHours(parseInt(startHours || '9'), parseInt(startMinutes || '0'), 0, 0);
      
      const endDate = new Date();
      endDate.setHours(parseInt(endHours || '10'), parseInt(endMinutes || '0'), 0, 0);
      
      setFormData({
        startTime: startDate,
        endTime: endDate,
        subject: slot.subject || '',
        teacher: slot.teacher || '',
        type: slot.type || 'class',
      });
    } else {
      // Set default times
      const defaultStart = new Date();
      defaultStart.setHours(9, 0, 0, 0);
      
      const defaultEnd = new Date();
      defaultEnd.setHours(9, 45, 0, 0);
      
      setFormData({
        startTime: defaultStart,
        endTime: defaultEnd,
        subject: '',
        teacher: '',
        type: 'class',
      });
    }
  }, [slot]);

  const handleSubmit = () => {
    const timeSlot: TimeSlot = {
      id: slot?.id || `slot-${Date.now()}`,
      startTime: `${formData.startTime.getHours().toString().padStart(2, '0')}:${formData.startTime.getMinutes().toString().padStart(2, '0')}`,
      endTime: `${formData.endTime.getHours().toString().padStart(2, '0')}:${formData.endTime.getMinutes().toString().padStart(2, '0')}`,
      subject: formData.subject,
      teacher: formData.teacher,
      type: formData.type,
    };
    
    onSave(timeSlot);
    onClose();
  };

  const isBreakType = formData.type === 'break' || formData.type === 'lunch';

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Typography variant="h5" fontWeight="bold">
            {slot ? 'Edit Time Slot' : 'Add Time Slot'}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {className} - {(day || 'Monday').charAt(0).toUpperCase() + (day || 'monday').slice(1)}
          </Typography>
        </DialogTitle>
        
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Slot Type</InputLabel>
                <Select
                  value={formData.type}
                  label="Slot Type"
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    type: e.target.value as any,
                    subject: e.target.value === 'break' ? 'Short Break' : 
                            e.target.value === 'lunch' ? 'Lunch Break' : prev.subject
                  }))}
                >
                  <MenuItem value="class">Class</MenuItem>
                  <MenuItem value="break">Break</MenuItem>
                  <MenuItem value="lunch">Lunch</MenuItem>
                  <MenuItem value="activity">Activity</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={6}>
              <TimePicker
                label="Start Time"
                value={formData.startTime}
                onChange={(newValue) => newValue && setFormData(prev => ({ ...prev, startTime: newValue }))}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </Grid>

            <Grid item xs={6}>
              <TimePicker
                label="End Time"
                value={formData.endTime}
                onChange={(newValue) => newValue && setFormData(prev => ({ ...prev, endTime: newValue }))}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </Grid>

            {!isBreakType && (
              <>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>
                      {formData.type === 'class' ? 'Subject' : 'Activity Name'}
                    </InputLabel>
                    <Select
                      value={formData.subject}
                      label={formData.type === 'class' ? 'Subject' : 'Activity Name'}
                      onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                    >
                      {formData.type === 'class' ? (
                        subjects.map((subject) => (
                          <MenuItem key={subject} value={subject}>{subject}</MenuItem>
                        ))
                      ) : (
                        [
                          'Class Activity',
                          'Sports',
                          'Assembly',
                          'Club Activity',
                          'Other Activity'
                        ].map((activity) => (
                          <MenuItem key={activity} value={activity}>{activity}</MenuItem>
                        ))
                      )}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Teacher</InputLabel>
                    <Select
                      value={formData.teacher}
                      label="Teacher"
                      onChange={(e) => setFormData(prev => ({ ...prev, teacher: e.target.value }))}
                    >
                      {teachers.map((teacher) => (
                        <MenuItem key={teacher} value={teacher}>{teacher}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </>
            )}

            {isBreakType && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Break Name"
                  value={formData.subject}
                  onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                  placeholder="e.g., Short Break, Lunch Break"
                />
              </Grid>
            )}
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleSubmit}
            disabled={!formData.startTime || !formData.endTime}
          >
            {slot ? 'Update' : 'Add'} Time Slot
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
};

export default TimeSlotForm;