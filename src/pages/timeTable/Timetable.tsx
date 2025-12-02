// Timetable.tsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  ToggleButton,
  ToggleButtonGroup,
  IconButton,
  Dialog,
  TextField,
  CircularProgress,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  ViewWeek as WeekViewIcon,
  ViewDay as DayViewIcon,
  Schedule as ScheduleIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import TimeSlotForm from './TimeSlotForm';

// Interfaces
interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  subject: string;
  teacher: string;
  type: 'class' | 'break' | 'lunch' | 'activity';
}

interface DaySchedule {
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday';
  date?: string;
  isHalfDay?: boolean;
  timeSlots: TimeSlot[];
}

interface ClassTimetable {
  classId: string;
  className: string;
  schedule: DaySchedule[];
}

interface TimetableFilters {
  selectedClass: string;
  viewMode: 'weekly' | 'daily';
  selectedDay?: string;
}

// Styled Components
const TimeSlotCard = styled(Card, {
  shouldForwardProp: (prop) => prop !== 'slottype',
})<{ slottype?: string }>(({ theme, slottype }) => ({
  height: '100%',
  borderLeft: `4px solid ${
    slottype === 'break' 
      ? theme.palette.warning.main 
      : slottype === 'lunch'
      ? theme.palette.error.main
      : theme.palette.primary.main
  }`,
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[4],
  },
}));

const DayColumn = styled(Paper, {
  shouldForwardProp: (prop) => prop !== 'ishalfday',
})<{ ishalfday?: string }>(({ theme, ishalfday }) => ({
  padding: theme.spacing(2),
  background: ishalfday === 'true' 
    ? 'linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)'
    : theme.palette.background.paper,
  border: ishalfday === 'true' ? `2px dashed ${theme.palette.primary.main}` : 'none',
  minHeight: '400px',
}));

const Timetable: React.FC = () => {
  const [timetables, setTimetables] = useState<ClassTimetable[]>([]);
  const [filters, setFilters] = useState<TimetableFilters>({
    selectedClass: '',
    viewMode: 'weekly',
    selectedDay: 'monday'
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [selectedDay, setSelectedDay] = useState<string>('monday');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  // Sample data
  const sampleTimetables: ClassTimetable[] = [
    {
      classId: 'class-1',
      className: 'Class 1',
      schedule: [
        {
          day: 'monday',
          timeSlots: [
            { id: '1', startTime: '09:00', endTime: '09:45', subject: 'English', teacher: 'Ms. Sharma', type: 'class' },
            { id: '2', startTime: '09:45', endTime: '10:30', subject: 'Mathematics', teacher: 'Mr. Verma', type: 'class' },
            { id: '3', startTime: '10:30', endTime: '10:45', subject: 'Short Break', teacher: '', type: 'break' },
            { id: '4', startTime: '10:45', endTime: '11:30', subject: 'Science', teacher: 'Ms. Patel', type: 'class' },
          ]
        },
        {
          day: 'saturday',
          isHalfDay: true,
          timeSlots: [
            { id: '1', startTime: '09:00', endTime: '09:40', subject: 'English', teacher: 'Ms. Sharma', type: 'class' },
            { id: '2', startTime: '09:40', endTime: '10:20', subject: 'Mathematics', teacher: 'Mr. Verma', type: 'class' },
          ]
        }
      ]
    },
    {
      classId: 'class-3',
      className: 'Class 3',
      schedule: [
        {
          day: 'monday',
          timeSlots: [
            { id: '1', startTime: '09:00', endTime: '10:00', subject: 'English', teacher: 'Ms. Kapoor', type: 'class' },
            { id: '2', startTime: '10:00', endTime: '11:00', subject: 'Mathematics', teacher: 'Mr. Joshi', type: 'class' },
          ]
        }
      ]
    }
  ];

  const classes = [
    'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 
    'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10'
  ];

  const days = [
    { key: 'monday', label: 'Monday' },
    { key: 'tuesday', label: 'Tuesday' },
    { key: 'wednesday', label: 'Wednesday' },
    { key: 'thursday', label: 'Thursday' },
    { key: 'friday', label: 'Friday' },
    { key: 'saturday', label: 'Saturday' },
  ];

  useEffect(() => {
    // Simulate API call
    setLoading(true);
    setTimeout(() => {
      setTimetables(sampleTimetables);
      setLoading(false);
    }, 1000);
  }, []);

  const handleFilterChange = (key: keyof TimetableFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const getCurrentTimetable = () => {
    return timetables.find(t => t.className === filters.selectedClass);
  };

  const getDaySchedule = (day: string) => {
    const timetable = getCurrentTimetable();
    return timetable?.schedule.find(s => s.day === day);
  };

  const formatTime = (time: string) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours || '0');
    const ampm = hour >= 12 ? 'pm' : 'am';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes}${ampm}`;
  };

  const getSlotColor = (type: string) => {
    switch (type) {
      case 'break': return 'warning';
      case 'lunch': return 'error';
      case 'activity': return 'success';
      default: return 'primary';
    }
  };

  const handleAddTimeSlot = (day: string) => {
    setSelectedSlot(null);
    setSelectedDay(day);
    setOpenDialog(true);
  };

  const handleEditTimeSlot = (slot: TimeSlot, day: string) => {
    setSelectedSlot(slot);
    setSelectedDay(day);
    setOpenDialog(true);
  };

  const handleSaveTimeSlot = (slot: TimeSlot) => {
    // Implementation for saving time slot
    console.log('Saving time slot:', slot, 'for day:', selectedDay);
    // Add your API call here
  };

  const renderWeeklyView = () => {
    const timetable = getCurrentTimetable();
    
    return (
      <Grid container spacing={2}>
        {days.map((day) => {
          const daySchedule = timetable?.schedule.find(s => s.day === day.key);
          const isHalfDay = daySchedule?.isHalfDay;
          
          return (
            <Grid item xs={12} md={6} lg={2} key={day.key}>
              <DayColumn 
                elevation={2} 
                ishalfday={isHalfDay?.toString()}
              >
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6" fontWeight="bold">
                    {day.label}
                  </Typography>
                  {isHalfDay && (
                    <Chip 
                      label="Half Day" 
                      size="small" 
                      color="primary" 
                      variant="outlined" 
                    />
                  )}
                </Box>

                {daySchedule ? (
                  <Box sx={{ maxHeight: '500px', overflowY: 'auto' }}>
                    {daySchedule.timeSlots.map((slot) => (
                      <TimeSlotCard 
                        key={slot.id} 
                        slottype={slot.type}
                        sx={{ mb: 1.5, cursor: 'pointer' }}
                        onClick={() => handleEditTimeSlot(slot, day.key)}
                      >
                        <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                          <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                            <Typography variant="caption" color="text.secondary" fontWeight="bold">
                              {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                            </Typography>
                            <Chip
                              label={slot.type.toUpperCase()}
                              color={getSlotColor(slot.type) as any}
                              size="small"
                            />
                          </Box>
                          
                          {slot.type === 'class' && (
                            <>
                              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                                {slot.subject}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                Teacher: {slot.teacher}
                              </Typography>
                            </>
                          )}
                          
                          {(slot.type === 'break' || slot.type === 'lunch') && (
                            <Typography variant="subtitle2" fontWeight="bold" color="text.secondary">
                              {slot.subject}
                            </Typography>
                          )}
                          
                          {slot.type === 'activity' && (
                            <>
                              <Typography variant="subtitle2" fontWeight="bold">
                                {slot.subject}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {slot.teacher}
                              </Typography>
                            </>
                          )}
                        </CardContent>
                      </TimeSlotCard>
                    ))}
                  </Box>
                ) : (
                  <Box 
                    display="flex" 
                    flexDirection="column"
                    justifyContent="center" 
                    alignItems="center" 
                    height={200}
                    border="2px dashed"
                    borderColor="divider"
                    borderRadius={1}
                    sx={{ cursor: 'pointer' }}
                    onClick={() => handleAddTimeSlot(day.key)}
                  >
                    <AddIcon color="action" />
                    <Typography color="text.secondary" align="center" mt={1}>
                      No schedule
                      <br />
                      <Typography variant="caption">
                        Click to add schedule
                      </Typography>
                    </Typography>
                  </Box>
                )}

                {daySchedule && (
                  <Button
                    fullWidth
                    startIcon={<AddIcon />}
                    onClick={() => handleAddTimeSlot(day.key)}
                    sx={{ mt: 2 }}
                    size="small"
                  >
                    Add Slot
                  </Button>
                )}
              </DayColumn>
            </Grid>
          );
        })}
      </Grid>
    );
  };

  const renderDailyView = () => {
    const daySchedule = getDaySchedule(filters.selectedDay || 'monday');
    
    if (!daySchedule) {
      return (
        <Box display="flex" justifyContent="center" alignItems="center" height={400}>
          <Box textAlign="center">
            <ScheduleIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No schedule found for {filters.selectedDay}
            </Typography>
            <Button 
              variant="contained" 
              startIcon={<AddIcon />}
              onClick={() => handleAddTimeSlot(filters.selectedDay || 'monday')}
            >
              Create Schedule
            </Button>
          </Box>
        </Box>
      );
    }

    return (
      <Paper elevation={2} sx={{ p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h5" fontWeight="bold" textTransform="capitalize">
            {filters.selectedDay} Schedule
            {daySchedule.isHalfDay && (
              <Chip 
                label="Half Day" 
                color="primary" 
                variant="outlined" 
                sx={{ ml: 2 }}
              />
            )}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {filters.selectedClass}
          </Typography>
        </Box>

        <Grid container spacing={2}>
          {daySchedule.timeSlots.map((slot) => (
            <Grid item xs={12} key={slot.id}>
              <TimeSlotCard 
                slottype={slot.type}
                sx={{ cursor: 'pointer' }}
                onClick={() => handleEditTimeSlot(slot, filters.selectedDay || 'monday')}
              >
                <CardContent>
                  <Grid container alignItems="center" spacing={2}>
                    <Grid item xs={12} sm={2}>
                      <Typography variant="h6" fontWeight="bold" color="primary">
                        {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={1}>
                      <Chip
                        label={slot.type.toUpperCase()}
                        color={getSlotColor(slot.type) as any}
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      {slot.type === 'class' && (
                        <>
                          <Typography variant="h6" gutterBottom>
                            {slot.subject}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Teacher: {slot.teacher}
                          </Typography>
                        </>
                      )}
                      {(slot.type === 'break' || slot.type === 'lunch') && (
                        <Typography variant="h6" color="text.secondary">
                          {slot.subject}
                        </Typography>
                      )}
                      {slot.type === 'activity' && (
                        <>
                          <Typography variant="h6">
                            {slot.subject}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {slot.teacher}
                          </Typography>
                        </>
                      )}
                    </Grid>
                    <Grid item xs={12} sm={3} container justifyContent="flex-end">
                      <IconButton 
                        size="small" 
                        color="primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditTimeSlot(slot, filters.selectedDay || 'monday');
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                </CardContent>
              </TimeSlotCard>
            </Grid>
          ))}
        </Grid>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleAddTimeSlot(filters.selectedDay || 'monday')}
          sx={{ mt: 3 }}
        >
          Add Time Slot
        </Button>
      </Paper>
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            School Timetable
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage class schedules and periods
          </Typography>
        </Box>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Select Class</InputLabel>
              <Select
                value={filters.selectedClass}
                label="Select Class"
                onChange={(e) => handleFilterChange('selectedClass', e.target.value)}
              >
                <MenuItem value="">Select a class</MenuItem>
                {classes.map((cls) => (
                  <MenuItem key={cls} value={cls}>{cls}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <ToggleButtonGroup
              value={filters.viewMode}
              exclusive
              onChange={(_, value) => value && handleFilterChange('viewMode', value)}
              fullWidth
            >
              <ToggleButton value="weekly">
                <WeekViewIcon sx={{ mr: 1 }} />
                Weekly View
              </ToggleButton>
              <ToggleButton value="daily">
                <DayViewIcon sx={{ mr: 1 }} />
                Daily View
              </ToggleButton>
            </ToggleButtonGroup>
          </Grid>

          {filters.viewMode === 'daily' && (
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Select Day</InputLabel>
                <Select
                  value={filters.selectedDay}
                  label="Select Day"
                  onChange={(e) => handleFilterChange('selectedDay', e.target.value)}
                >
                  {days.map((day) => (
                    <MenuItem key={day.key} value={day.key}>
                      {day.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          )}
        </Grid>
      </Paper>

      {/* Timetable Content */}
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height={400}>
          <CircularProgress />
        </Box>
      ) : !filters.selectedClass ? (
        <Paper sx={{ p: 6, textAlign: 'center' }}>
          <ScheduleIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Select a class to view timetable
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Choose a class from the dropdown above to see the schedule
          </Typography>
        </Paper>
      ) : filters.viewMode === 'weekly' ? (
        renderWeeklyView()
      ) : (
        renderDailyView()
      )}

      {/* TimeSlot Form Dialog */}
      <TimeSlotForm
        open={openDialog}
        slot={selectedSlot}
        onClose={() => setOpenDialog(false)}
        onSave={handleSaveTimeSlot}
        day={selectedDay}
        className={filters.selectedClass}
      />
    </Box>
  );
};

export default Timetable;