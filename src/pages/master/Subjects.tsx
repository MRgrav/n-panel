// Subjects.tsx
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Alert,
  Chip,
  Autocomplete,
  Typography,
  CircularProgress,
} from '@mui/material';
import { get, post, put, del } from '../../api/api';
import { useAuth } from '../../hooks/useAuth';
import DataTable from '../../components/Common/DataTable';

interface Teacher {
  id: number;
  name: string;
  email: string;
}

interface Subject {
  id: number;
  name: string;
  code: string;
  description: string;
  status?: 'active' | 'inactive';
  createdAt: string;
  schoolId: number;
  teachers: Teacher[];
  school: {
    id: number;
    name: string;
    schoolCode: string;
  };
}

interface StaffTeacher {
  id: number;
  name: string;
  employeeId: string;
  designation: string;
  email: string;
  role: string;
}

const Subjects: React.FC = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [teachers, setTeachers] = useState<StaffTeacher[]>([]);
  const [loading, setLoading] = useState(false);
  const [teachersLoading, setTeachersLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editingSub, setEditingSub] = useState<Subject | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    status: 'active' as 'active' | 'inactive',
    teacherIds: [] as number[],
  });

  const { user } = useAuth();
  const token = user?.accessToken || '';

const columns: Column[] = [
  { 
    id: 'name', 
    label: 'Subject', 
    minWidth: 200,
    format: (value: any, row: Subject) => (
      <Box>
        <Typography variant="subtitle2" fontWeight="bold">
          {row.name}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Code: {row.code}
        </Typography>
      </Box>
    )
  },
  { 
    id: 'description', 
    label: 'Description', 
    minWidth: 250,
    format: (value: any) => (
      <Typography variant="body2" color="text.secondary">
        {value || 'No description'}
      </Typography>
    )
  },
  { 
    id: 'teachers', 
    label: 'Teachers', 
    minWidth: 200,
    format: (value: Teacher[]) => {
      if (!value || value.length === 0) {
        return (
          <Typography variant="caption" color="text.secondary">
            No teachers assigned
          </Typography>
        );
      }
      
      return (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {value.map((teacher) => (
            <Chip
              key={teacher.id}
              label={teacher.name}
              size="small"
              color="primary"
              variant="outlined"
              sx={{ 
                fontSize: '0.7rem',
                height: 24,
                '& .MuiChip-label': { px: 1 }
              }}
            />
          ))}
        </Box>
      );
    }
  },
  { 
    id: 'createdAt', 
    label: 'Created', 
    minWidth: 150,
    format: (value: string) => (
      <Typography variant="body2" color="text.secondary">
        {new Date(value).toLocaleDateString()}
      </Typography>
    )
  },
];

  const fetchSubjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await get('/subjects', {}, token);
      // Handle the response structure - it might be response.subjects or just response
      const subjectsData = response?.subjects || response || [];
      setSubjects(subjectsData);
    } catch (error: any) {
      console.error('Error fetching subjects:', error);
      setError('Failed to fetch subjects. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchTeachers = async () => {
    setTeachersLoading(true);
    try {
      const response = await get('/staff', {}, token);
      // Handle different response structures
      const staffData = response?.staff || response || [];
      // Filter only teachers
      const teacherStaff = staffData.filter(
        (staff: any) => staff.role === 'TEACHER'
      );
      setTeachers(teacherStaff);
    } catch (error: any) {
      console.error('Error fetching teachers:', error);
    } finally {
      setTeachersLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
    fetchTeachers();
  }, []);

  const handleAdd = () => {
    setEditingSub(null);
    setFormData({
      name: '',
      code: '',
      description: '',
      status: 'active',
      teacherIds: [],
    });
    setError(null);
    setSuccess(null);
    setOpen(true);
  };

  const handleEdit = (sub: Subject) => {
    setEditingSub(sub);
    setFormData({
      name: sub.name,
      code: sub.code,
      description: sub.description || '',
      status: sub.status || 'active',
      teacherIds: sub.teachers?.map(t => t.id) || [],
    });
    setError(null);
    setSuccess(null);
    setOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this subject?')) {
      return;
    }

    try {
      await del(`/subjects/${id}`, token);
      setSuccess('Subject deleted successfully');
      fetchSubjects();
    } catch (error: any) {
      console.error('Error deleting subject:', error);
      setError('Failed to delete subject. Please try again.');
    }
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      setError('Subject name is required');
      return;
    }

    if (!formData.code.trim()) {
      setError('Subject code is required');
      return;
    }

    setError(null);
    setSuccess(null);

    try {
      const payload = {
        name: formData.name.trim(),
        code: formData.code.trim(),
        description: formData.description.trim(),
        schoolId: "0001",
        teacherId: formData.teacherIds,
        ...(formData.status && { status: formData.status })
      };

      if (editingSub) {
        // Update existing subject
        await put(`/subjects/${editingSub.id}`, payload, token);
        setSuccess('Subject updated successfully');
      } else {
        // Create new subject
        await post('/subjects', payload, token);
        setSuccess('Subject added successfully');
      }

      setOpen(false);
      fetchSubjects();
    } catch (error: any) {
      console.error('Error saving subject:', error);
      setError(error.response?.data?.message || 'Failed to save subject. Please try again.');
    }
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setFormData({
      name: '',
      code: '',
      description: '',
      status: 'active',
      teacherIds: [],
    });
    setError(null);
    setSuccess(null);
  };

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}

      <DataTable
        title="Subjects"
        columns={columns}
        data={subjects}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={(row) => handleDelete(row.id)}
        searchPlaceholder="Search subjects..."
        searchableFields={['name', 'code', 'description']}
        showSerialNo={true}
      />

      <Dialog open={open} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Typography variant="h6" fontWeight="bold">
            {editingSub ? 'Edit Subject' : 'Add New Subject'}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Subject Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              margin="normal"
              required
              autoFocus
            />
            
            <TextField
              fullWidth
              label="Subject Code"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              margin="normal"
              required
              helperText="Unique code for the subject"
            />
            
            <TextField
              fullWidth
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              margin="normal"
              multiline
              rows={3}
              helperText="Optional description about the subject"
            />

            <FormControl fullWidth margin="normal">
              <InputLabel>Status</InputLabel>
              <Select
                label="Status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
              <Autocomplete
                multiple
                options={teachers}
                getOptionLabel={(option) => `${option.name} (${option.employeeId})`}
                value={teachers.filter(teacher => formData.teacherIds.includes(teacher.id))}
                onChange={(_, newValue) => {
                  setFormData({ 
                    ...formData, 
                    teacherIds: newValue.map(teacher => teacher.id) 
                  });
                }}
                loading={teachersLoading}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Assign Teachers"
                    placeholder="Select teachers..."
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {teachersLoading ? <CircularProgress color="inherit" size={20} /> : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
                renderOption={(props, option) => (
                  <MenuItem {...props}>
                    <Box>
                      <Typography variant="body2">{option.name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {option.designation} • {option.employeeId}
                      </Typography>
                    </Box>
                  </MenuItem>
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      {...getTagProps({ index })}
                      key={option.id}
                      label={option.name}
                      size="small"
                    />
                  ))
                }
              />
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                Select teachers who will teach this subject
              </Typography>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleCloseDialog} color="inherit">
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained"
            disabled={!formData.name.trim() || !formData.code.trim()}
          >
            {editingSub ? 'Update Subject' : 'Add Subject'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Subjects;