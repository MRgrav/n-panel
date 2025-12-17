import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Container,
  Grid,
  TextField,
  MenuItem,
  Button,
  Card,
  CardContent,
  Stepper,
  Step,
  StepLabel,
  Paper,
  IconButton,
  Alert,
  CircularProgress,
  Avatar,
  Chip,
  Divider,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
} from '@mui/material';
import {
  Person,
  AccountBalance,
  Description,
  CloudUpload,
  ArrowBack,
  ArrowForward,
  CheckCircle,
  Email,
  Phone,
  LocationOn,
  School,
  Work,
  CalendarToday,
  Edit,
  Save,
  Cancel,
} from '@mui/icons-material';
import { get, put } from '../../api/api';
import { useAuth } from '../../hooks/useAuth';


const UpdateEmployee: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const { user } = useAuth();
  const token = user?.accessToken || '';

  const steps = ['Basic Info', 'Employment Details', 'Bank & Documents', 'Review'];

  const [formData, setFormData] = useState({
    id: 0,
    employeeId: '',
    title: '',
    name: '',
    gender: '',
    employeeType: '',
    role: '',
    designation: '',
    dateOfBirth: '',
    dateOfJoining: '',
    fatherHusbandName: '',
    qualification: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    location: '',
    aadharNumber: '',
    panNumber: '',
    mobile: '',
    alternateMobile: '',
    email: '',
    alternateEmail: '',
    brokerBranch: '',
    bankName: '',
    bankBranchName: '',
    bankAccountNumber: '',
    ifscCode: '',
    jobOfferLetterUrl: '',
    joiningLetterUrl: '',
    ndaUrl: '',
    experienceLetterUrl: '',
    relievingLetterUrl: '',
    salarySlipUrl: '',
    aadhaarCardUrl: '',
    panCardUrl: '',
    cancelledChequeUrl: '',
    passportUrl: '',
    sscCertificateUrl: '',
    hscCertificateUrl: '',
    graduationCertificateUrl: '',
    hiredAt: '',
    schoolId: 1,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [originalData, setOriginalData] = useState<any>(null);
  const [hasChanges, setHasChanges] = useState(false);

  const titles = ['Mr.', 'Mrs.', 'Miss.', 'Dr.', 'Prof.'];
  const genders = ['Male', 'Female', 'Other'];
  const employeeTypes = ['Full-Time', 'Part-Time', 'Contract', 'Intern'];
  const roles = ['TEACHER', 'ADMIN', 'ACCOUNTANT', 'PRINCIPAL', 'SUPERVISOR', 'OTHER'];
  const brokerBranches = ['Central', 'North', 'South', 'East', 'West'];

  useEffect(() => {
    fetchEmployeeData();
  }, [id]);

  const fetchEmployeeData = async () => {
    if (!id) {
      setError('Employee ID is required');
      setFetching(false);
      return;
    }

    setFetching(true);
    setError(null);
    
    try {
      const response = await get(`/staff/${id}`, {}, token);
      const employeeData = response?.data || response;
      
      if (!employeeData) {
        throw new Error('Employee not found');
      }

      // Format dates for input fields
      const formattedData = {
        ...employeeData,
        dateOfBirth: employeeData.dateOfBirth ? employeeData.dateOfBirth.split('T')[0] : '',
        dateOfJoining: employeeData.dateOfJoining ? employeeData.dateOfJoining.split('T')[0] : '',
        hiredAt: employeeData.hiredAt ? employeeData.hiredAt.split('T')[0] : '',
      };

      setFormData(formattedData);
      setOriginalData(formattedData);
      
    } catch (error: any) {
      console.error('Error fetching employee:', error);
      setError(error.response?.data?.message || 'Failed to fetch employee data');
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    // Check for changes
    if (originalData) {
      const changed = JSON.stringify(formData) !== JSON.stringify(originalData);
      setHasChanges(changed);
    }
  }, [formData, originalData]);

  const handleNext = () => {
    if (validateStep()) {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const handleSelectChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      try {
        const file = files[0];
        if (file.size > 5 * 1024 * 1024) {
          setError('File size should be less than 5MB');
          return;
        }
        
        // For now, store the file name
        // In production, upload to server and get URL
        const fileName = `updated_${Date.now()}_${file.name}`;
        setFormData(prev => ({ 
          ...prev, 
          [`${name}Url`]: `https://files.nityadesk.com/docs/${fileName}` 
        }));
        
        setSuccess(`${name.replace('Url', '')} updated successfully`);
        
      } catch (err) {
        setError('Error uploading file');
        console.error(err);
      }
    }
  };

  const validateField = (name: string, value: string) => {
    let error = '';

    switch (name) {
      case 'name':
        error = value.trim().length < 2 ? 'Name must be at least 2 characters' : '';
        break;
      case 'email':
        error = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? 'Invalid email format' : '';
        break;
      case 'mobile':
        error = !/^\d{10}$/.test(value) ? 'Mobile must be 10 digits' : '';
        break;
      case 'aadharNumber':
        error = !/^\d{12}$/.test(value) ? 'Aadhar must be 12 digits' : '';
        break;
      case 'panNumber':
        error = !/^[A-Z]{5}\d{4}[A-Z]{1}$/.test(value) ? 'Invalid PAN format' : '';
        break;
      case 'pincode':
        error = !/^\d{6}$/.test(value) ? 'Pincode must be 6 digits' : '';
        break;
      case 'ifscCode':
        error = !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(value) ? 'Invalid IFSC code' : '';
        break;
      case 'bankAccountNumber':
        error = !/^\d{9,18}$/.test(value) ? 'Account number must be 9-18 digits' : '';
        break;
    }

    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const validateStep = () => {
    const stepValidations = [
      // Step 0: Basic Info
      () => {
        const required = ['title', 'name', 'gender', 'mobile', 'email', 'dateOfBirth'];
        const newErrors: Record<string, string> = {};
        required.forEach(field => {
          if (!formData[field as keyof typeof formData]?.trim()) {
            newErrors[field] = 'This field is required';
          }
        });
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
      },
      // Step 1: Employment Details
      () => {
        const required = ['employeeType', 'role', 'designation', 'dateOfJoining', 'address', 'city', 'state', 'pincode'];
        const newErrors: Record<string, string> = {};
        required.forEach(field => {
          if (!formData[field as keyof typeof formData]?.trim()) {
            newErrors[field] = 'This field is required';
          }
        });
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
      },
      // Step 2: Bank & Documents (no validation)
      () => true,
      // Step 3: Review (no validation)
      () => true,
    ];

    return stepValidations[activeStep]();
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    const requiredFields = [
      'title', 'name', 'gender', 'employeeType', 'role', 'designation',
      'dateOfBirth', 'dateOfJoining', 'mobile', 'email', 'address',
      'city', 'state', 'pincode', 'aadharNumber', 'panNumber'
    ];

    requiredFields.forEach(field => {
      if (!formData[field as keyof typeof formData]?.trim()) {
        newErrors[field] = 'This field is required';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      setError('Please fill all required fields');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const payload = {
        ...formData,
        dateOfBirth: formData.dateOfBirth ? new Date(formData.dateOfBirth).toISOString() : null,
        dateOfJoining: formData.dateOfJoining ? new Date(formData.dateOfJoining).toISOString() : null,
        // Remove fields that shouldn't be sent in update
        id: undefined,
        employeeId: undefined,
        hiredAt: undefined,
        school: undefined,
        schoolId: '0001', // Keep school ID
      };

      await put(`/staff/${id}`, payload, token);
      setSuccess('Employee updated successfully!');
      
      // Update original data
      setOriginalData(formData);
      setHasChanges(false);
      
    } catch (error: any) {
      console.error('Error updating employee:', error);
      setError(error.response?.data?.message || 'Failed to update employee');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    if (originalData) {
      setFormData(originalData);
      setErrors({});
      setSuccess(null);
      setError(null);
    }
  };

  const handleCancel = () => {
    navigate('/employee');
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h6" fontWeight="bold" sx={{ color: 'primary.main' }}>
                <Person sx={{ mr: 1, verticalAlign: 'middle' }} />
                Basic Information
              </Typography>
              <Chip 
                label={`ID: ${formData.employeeId}`} 
                color="primary" 
                variant="outlined"
                size="small"
              />
            </Box>
            
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  select
                  fullWidth
                  label="Title"
                  name="title"
                  value={formData.title}
                  onChange={handleSelectChange}
                  error={!!errors.title}
                  helperText={errors.title}
                  variant="outlined"
                  size="small"
                >
                  <MenuItem value="">Select Title</MenuItem>
                  {titles.map(title => (
                    <MenuItem key={title} value={title}>{title}</MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  error={!!errors.name}
                  helperText={errors.name}
                  variant="outlined"
                  size="small"
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  select
                  fullWidth
                  label="Gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleSelectChange}
                  error={!!errors.gender}
                  helperText={errors.gender}
                  variant="outlined"
                  size="small"
                >
                  <MenuItem value="">Select Gender</MenuItem>
                  {genders.map(gender => (
                    <MenuItem key={gender} value={gender}>{gender}</MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  label="Date of Birth"
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  error={!!errors.dateOfBirth}
                  helperText={errors.dateOfBirth}
                  variant="outlined"
                  size="small"
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  label="Mobile"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  error={!!errors.mobile}
                  helperText={errors.mobile}
                  variant="outlined"
                  size="small"
                  InputProps={{
                    startAdornment: <Phone fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />,
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={!!errors.email}
                  helperText={errors.email}
                  variant="outlined"
                  size="small"
                  InputProps={{
                    startAdornment: <Email fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />,
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Alternate Mobile"
                  name="alternateMobile"
                  value={formData.alternateMobile}
                  onChange={handleChange}
                  variant="outlined"
                  size="small"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Alternate Email"
                  name="alternateEmail"
                  type="email"
                  value={formData.alternateEmail}
                  onChange={handleChange}
                  variant="outlined"
                  size="small"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Father/Husband Name"
                  name="fatherHusbandName"
                  value={formData.fatherHusbandName}
                  onChange={handleChange}
                  variant="outlined"
                  size="small"
                />
              </Grid>
            </Grid>
          </Box>
        );

      case 1:
        return (
          <Box>
            <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ color: 'primary.main', mb: 3 }}>
              <Work sx={{ mr: 1, verticalAlign: 'middle' }} />
              Employment Details
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  select
                  fullWidth
                  label="Employee Type"
                  name="employeeType"
                  value={formData.employeeType}
                  onChange={handleSelectChange}
                  error={!!errors.employeeType}
                  helperText={errors.employeeType}
                  variant="outlined"
                  size="small"
                >
                  <MenuItem value="">Select Type</MenuItem>
                  {employeeTypes.map(type => (
                    <MenuItem key={type} value={type}>{type}</MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  select
                  fullWidth
                  label="Role"
                  name="role"
                  value={formData.role}
                  onChange={handleSelectChange}
                  error={!!errors.role}
                  helperText={errors.role}
                  variant="outlined"
                  size="small"
                >
                  <MenuItem value="">Select Role</MenuItem>
                  {roles.map(role => (
                    <MenuItem key={role} value={role}>{role}</MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  label="Designation"
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  error={!!errors.designation}
                  helperText={errors.designation}
                  variant="outlined"
                  size="small"
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  label="Date of Joining"
                  name="dateOfJoining"
                  type="date"
                  value={formData.dateOfJoining}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  error={!!errors.dateOfJoining}
                  helperText={errors.dateOfJoining}
                  variant="outlined"
                  size="small"
                  InputProps={{
                    startAdornment: <CalendarToday fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />,
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  label="Qualification"
                  name="qualification"
                  value={formData.qualification}
                  onChange={handleChange}
                  variant="outlined"
                  size="small"
                  InputProps={{
                    startAdornment: <School fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />,
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  label="Location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  variant="outlined"
                  size="small"
                  InputProps={{
                    startAdornment: <LocationOn fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />,
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  multiline
                  rows={3}
                  error={!!errors.address}
                  helperText={errors.address}
                  variant="outlined"
                  size="small"
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  label="City"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  error={!!errors.city}
                  helperText={errors.city}
                  variant="outlined"
                  size="small"
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  label="State"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  error={!!errors.state}
                  helperText={errors.state}
                  variant="outlined"
                  size="small"
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  label="Pincode"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  error={!!errors.pincode}
                  helperText={errors.pincode}
                  variant="outlined"
                  size="small"
                />
              </Grid>

              <Grid item xs={12} sm={6} md={6}>
                <TextField
                  fullWidth
                  label="Aadhar Number"
                  name="aadharNumber"
                  value={formData.aadharNumber}
                  onChange={handleChange}
                  error={!!errors.aadharNumber}
                  helperText={errors.aadharNumber}
                  variant="outlined"
                  size="small"
                />
              </Grid>

              <Grid item xs={12} sm={6} md={6}>
                <TextField
                  fullWidth
                  label="PAN Number"
                  name="panNumber"
                  value={formData.panNumber}
                  onChange={handleChange}
                  error={!!errors.panNumber}
                  helperText={errors.panNumber}
                  variant="outlined"
                  size="small"
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  select
                  fullWidth
                  label="Broker Branch"
                  name="brokerBranch"
                  value={formData.brokerBranch}
                  onChange={handleSelectChange}
                  variant="outlined"
                  size="small"
                >
                  <MenuItem value="">Select Branch</MenuItem>
                  {brokerBranches.map(branch => (
                    <MenuItem key={branch} value={branch}>{branch}</MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>
          </Box>
        );

      case 2:
        return (
          <Box>
            <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ color: 'primary.main', mb: 3 }}>
              <AccountBalance sx={{ mr: 1, verticalAlign: 'middle' }} />
              Bank & Documents
            </Typography>
            
            <Box sx={{ mb: 4 }}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Bank Details
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    label="Bank Name"
                    name="bankName"
                    value={formData.bankName}
                    onChange={handleChange}
                    variant="outlined"
                    size="small"
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    label="Bank Branch"
                    name="bankBranchName"
                    value={formData.bankBranchName}
                    onChange={handleChange}
                    variant="outlined"
                    size="small"
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    label="Account Number"
                    name="bankAccountNumber"
                    value={formData.bankAccountNumber}
                    onChange={handleChange}
                    error={!!errors.bankAccountNumber}
                    helperText={errors.bankAccountNumber}
                    variant="outlined"
                    size="small"
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    label="IFSC Code"
                    name="ifscCode"
                    value={formData.ifscCode}
                    onChange={handleChange}
                    error={!!errors.ifscCode}
                    helperText={errors.ifscCode}
                    variant="outlined"
                    size="small"
                  />
                </Grid>
              </Grid>
            </Box>

            <Divider sx={{ my: 3 }} />

            <Box>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Documents
              </Typography>
              <Grid container spacing={2}>
                {[
                  { name: 'jobOfferLetterUrl', label: 'Job Offer Letter' },
                  { name: 'joiningLetterUrl', label: 'Joining Letter' },
                  { name: 'ndaUrl', label: 'NDA' },
                  { name: 'experienceLetterUrl', label: 'Experience Letter' },
                  { name: 'relievingLetterUrl', label: 'Relieving Letter' },
                  { name: 'salarySlipUrl', label: 'Salary Slip' },
                  { name: 'aadhaarCardUrl', label: 'Aadhar Card' },
                  { name: 'panCardUrl', label: 'PAN Card' },
                  { name: 'cancelledChequeUrl', label: 'Cancelled Cheque' },
                  { name: 'passportUrl', label: 'Passport' },
                  { name: 'sscCertificateUrl', label: 'SSC Certificate' },
                  { name: 'hscCertificateUrl', label: 'HSC Certificate' },
                  { name: 'graduationCertificateUrl', label: 'Graduation Certificate' },
                ].map((doc, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Paper
                      variant="outlined"
                      sx={{
                        p: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%',
                        borderRadius: 2,
                        transition: 'all 0.2s',
                        '&:hover': {
                          borderColor: 'primary.main',
                          boxShadow: 1,
                        }
                      }}
                    >
                      {formData[doc.name as keyof typeof formData] ? (
                        <>
                          <Chip
                            label="Uploaded"
                            color="success"
                            size="small"
                            icon={<CheckCircle />}
                            sx={{ mb: 1 }}
                          />
                          <Typography variant="caption" color="text.secondary" noWrap sx={{ maxWidth: '100%' }}>
                            {String(formData[doc.name as keyof typeof formData]).split('/').pop()}
                          </Typography>
                        </>
                      ) : (
                        <>
                          <Chip
                            label="Not Uploaded"
                            color="default"
                            size="small"
                            variant="outlined"
                            sx={{ mb: 1 }}
                          />
                          <Typography variant="caption" color="text.secondary">
                            No document
                          </Typography>
                        </>
                      )}
                      
                      <label htmlFor={`upload-${doc.name}`} style={{ width: '100%', marginTop: 8 }}>
                        <input
                          id={`upload-${doc.name}`}
                          name={doc.name.replace('Url', '')}
                          type="file"
                          onChange={handleFileChange}
                          style={{ display: 'none' }}
                          accept=".pdf,.jpg,.jpeg,.png"
                        />
                        <Button
                          variant="outlined"
                          component="span"
                          startIcon={<CloudUpload />}
                          fullWidth
                          size="small"
                          sx={{
                            textTransform: 'none',
                            borderRadius: 2,
                          }}
                        >
                          {formData[doc.name as keyof typeof formData] ? 'Update' : 'Upload'}
                        </Button>
                      </label>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Box>
        );

      case 3:
        return (
          <Box>
            <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ color: 'primary.main', mb: 3 }}>
              <Description sx={{ mr: 1, verticalAlign: 'middle' }} />
              Review Changes
            </Typography>
            
            {hasChanges ? (
              <>
                <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
                  You have made changes to the employee details. Review them below before saving.
                </Alert>

                <Paper sx={{ p: 3, mb: 3, borderRadius: 2, backgroundColor: 'grey.50' }}>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom color="primary">
                    Personal Information
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">Name</Typography>
                      <Typography variant="body1">
                        {formData.title} {formData.name}
                        {originalData?.name !== formData.name && (
                          <Chip 
                            label="Changed" 
                            color="warning" 
                            size="small" 
                            sx={{ ml: 1 }}
                          />
                        )}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">Gender</Typography>
                      <Typography variant="body1">
                        {formData.gender}
                        {originalData?.gender !== formData.gender && (
                          <Chip 
                            label="Changed" 
                            color="warning" 
                            size="small" 
                            sx={{ ml: 1 }}
                          />
                        )}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">Mobile</Typography>
                      <Typography variant="body1">
                        {formData.mobile}
                        {originalData?.mobile !== formData.mobile && (
                          <Chip 
                            label="Changed" 
                            color="warning" 
                            size="small" 
                            sx={{ ml: 1 }}
                          />
                        )}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">Email</Typography>
                      <Typography variant="body1">
                        {formData.email}
                        {originalData?.email !== formData.email && (
                          <Chip 
                            label="Changed" 
                            color="warning" 
                            size="small" 
                            sx={{ ml: 1 }}
                          />
                        )}
                      </Typography>
                    </Grid>
                  </Grid>
                </Paper>

                <Paper sx={{ p: 3, mb: 3, borderRadius: 2, backgroundColor: 'grey.50' }}>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom color="primary">
                    Employment Information
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">Employee ID</Typography>
                      <Chip label={formData.employeeId} color="primary" size="small" />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">Role</Typography>
                      <Typography variant="body1">
                        {formData.role}
                        {originalData?.role !== formData.role && (
                          <Chip 
                            label="Changed" 
                            color="warning" 
                            size="small" 
                            sx={{ ml: 1 }}
                          />
                        )}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">Designation</Typography>
                      <Typography variant="body1">
                        {formData.designation}
                        {originalData?.designation !== formData.designation && (
                          <Chip 
                            label="Changed" 
                            color="warning" 
                            size="small" 
                            sx={{ ml: 1 }}
                          />
                        )}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">Employee Type</Typography>
                      <Typography variant="body1">
                        {formData.employeeType}
                        {originalData?.employeeType !== formData.employeeType && (
                          <Chip 
                            label="Changed" 
                            color="warning" 
                            size="small" 
                            sx={{ ml: 1 }}
                          />
                        )}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary">Address</Typography>
                      <Typography variant="body1">
                        {formData.address}, {formData.city}, {formData.state} - {formData.pincode}
                      </Typography>
                    </Grid>
                  </Grid>
                </Paper>
              </>
            ) : (
              <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
                <CheckCircle sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  No Changes Made
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  All employee details are up to date. You can go back to make changes or return to employee list.
                </Typography>
              </Paper>
            )}
          </Box>
        );

      default:
        return null;
    }
  };

  if (fetching) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Box textAlign="center">
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Loading employee data...
          </Typography>
        </Box>
      </Container>
    );
  }

  if (error && !formData.employeeId) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
          {error}
        </Alert>
        <Button
          variant="contained"
          onClick={() => navigate('/employee')}
          startIcon={<ArrowBack />}
        >
          Back to Employees
        </Button>
      </Container>
    );
  }

  return (
 <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Card sx={{ borderRadius: 3, boxShadow: '0 8px 32px rgba(0,0,0,0.08)' }}>
        <CardContent sx={{ p: 4 }}>
          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Add New Employee
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Fill in the employee details step by step
            </Typography>
          </Box>

          {/* Stepper */}
          <Stepper activeStep={activeStep} sx={{ mb: 5 }}>
            {steps.map((label, index) => (
              <Step key={label}>
                <StepLabel 
                  StepIconProps={{
                    sx: {
                      '&.Mui-completed': { color: 'success.main' },
                      '&.Mui-active': { color: 'primary.main' },
                    }
                  }}
                >
                  {label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>

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
          
          {success && (
            <Alert 
              severity="success" 
              sx={{ mb: 3, borderRadius: 2 }} 
              onClose={() => setSuccess(null)}
            >
              {success}
            </Alert>
          )}

          {/* Form Content */}
          {renderStepContent()}

          {/* Navigation Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 5 }}>
            <Button
              variant="outlined"
              onClick={handleBack}
              disabled={activeStep === 0 || loading}
              startIcon={<ArrowBack />}
              sx={{
                borderRadius: 2,
                px: 4,
                py: 1.5,
                textTransform: 'none',
                fontWeight: 'bold',
              }}
            >
              Back
            </Button>
            
            {activeStep === steps.length - 1 ? (
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={loading}
                sx={{
                  borderRadius: 2,
                  px: 4,
                  py: 1.5,
                  textTransform: 'none',
                  fontWeight: 'bold',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5a6fd8 0%, #6a3d92 100%)',
                    boxShadow: '0 6px 20px rgba(102, 126, 234, 0.6)',
                  },
                  '&:disabled': {
                    background: 'grey.300',
                  }
                }}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <CheckCircle />}
              >
                {loading ? 'Saving...' : 'Submit Employee'}
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleNext}
                sx={{
                  borderRadius: 2,
                  px: 4,
                  py: 1.5,
                  textTransform: 'none',
                  fontWeight: 'bold',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5a6fd8 0%, #6a3d92 100%)',
                    boxShadow: '0 6px 20px rgba(102, 126, 234, 0.6)',
                  }
                }}
                endIcon={<ArrowForward />}
              >
                Next
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default UpdateEmployee;