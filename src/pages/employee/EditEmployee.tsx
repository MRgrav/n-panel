import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

import {
  Box,
  Typography,
  Container,
  Grid,
  TextField,
  MenuItem,
  Button,
  Card,
  CardHeader,
  CardContent,
  Divider,
  Tabs,
  Tab,
  Avatar,
  IconButton,
  Paper,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Person,
  AccountBalance,
  Description,
  Close,
  Delete,
  Visibility,
  CloudUpload,
} from '@mui/icons-material';
import api, { REACT_APP_BASE_URL } from '../../api/api';

interface Designation {
  _id: string;
  designation: string;
}

interface Location {
  _id: string;
  locationName: string;
}

interface BrokerBranch {
  _id: string;
  branchName: string;
}

interface Role {
  _id: string;
  role: string;
}

interface EmployeeData {
  [key: string]: any; // Index signature
  employeeType: string;
  title: string;
  role: string;
  name: string;
  employeeId: string;
  employeePassword: string;
  gender: string;
  address: string;
  pincode: string;
  designation: string;
  city: string;
  state: string;
  panNumber: string;
  panCard: string;
  aadharNumber: string;
  aadharCard: string;
  dateOfBirth: string;
  joiningOfDate: string;
  number: string;
  email: string;
  alternateEmail: string;
  alternateNumber: string;
  department: string;
  branch: string;
  bankBranchName: string;
  location: string;
  fatherOrHusbandName: string;
  bqp: string;
  qualification: string;
  pf_no: string;
  bankName: string;
  bankAccount: string;
  ifscCode: string;
  jobOfferLetter: string;
  joiningLetter: string;
  nda: string;
  experienceLetter: string;
  relievingLetter: string;
  salarySlip: string;
  cancelledCheque: string;
  passport: string;
  photo: string;
  sscCertificate: string;
  hscCertificate: string;
  graduationCertificate: string;
}

const EditEmployee = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [openPreview, setOpenPreview] = useState(false);
  const [previewFile, setPreviewFile] = useState<string | null>(null);
  const [previewType, setPreviewType] = useState<'image' | 'pdf' | 'other'>('image');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [role, setRole] = useState<Role[]>([]);
  const [designation, setDesignation] = useState<Designation[]>([]);
  const [location, setLocation] = useState<Location[]>([]);
  const [brokerBranch, setBrokerBranch] = useState<BrokerBranch[]>([]);

  const [inputData, setInputData] = useState<EmployeeData>({
    employeeType: '',
    title: '',
    role: '',
    name: '',
    employeeId: '',
    employeePassword: '',
    gender: '',
    address: '',
    pincode: '',
    designation: '',
    city: '',
    state: '',
    panNumber: '',
    panCard: '',
    aadharNumber: '',
    aadharCard: '',
    dateOfBirth: '',
    joiningOfDate: '',
    number: '',
    email: '',
    alternateEmail: '',
    alternateNumber: '',
    department: '',
    branch: '',
    bankBranchName: '',
    location: '',
    fatherOrHusbandName: '',
    bqp: '',
    qualification: '',
    pf_no: '',
    bankName: '',
    bankAccount: '',
    ifscCode: '',
    jobOfferLetter: '',
    joiningLetter: '',
    nda: '',
    experienceLetter: '',
    relievingLetter: '',
    salarySlip: '',
    cancelledCheque: '',
    passport: '',
    photo: '',
    sscCertificate: '',
    hscCertificate: '',
    graduationCertificate: '',
  });

  const [errors, setErrors] = useState({
    employeeType: '',
    title: '',
    name: '',
    gender: '',
    address: '',
    pincode: '',
    city: '',
    state: '',
    panNumber: '',
    aadharNumber: '',
    dateOfBirth: '',
    joiningOfDate: '',
    number: '',
    email: '',
    designation: '',
    branch: '',
    bankBranchName: '',
    location: '',
    fatherOrHusbandName: '',
    qualification: '',
    // pf_no: '',
    bankName: '',
    bankAccount: '',
    ifscCode: '',
    employeeId: '',
  });

  const titles = ['Mr', 'Mrs', 'Miss'];
  const genders = ['Male', 'Female', 'Other'];
  const employeeTypes = ['Full Time', 'Part Time', 'Intern', 'Special Assignee'];

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    validateField(name, value);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      try {
        const file = files[0];
        if (file.size > 5 * 1024 * 1024) { // 5MB limit
          setError('File size should be less than 5MB');
          return;
        }
        const base64 = await convertToBase64(file);
        setInputData((prevData) => ({
          ...prevData,
          [name]: base64,
        }));
      } catch (err) {
        setError('Error uploading file');
        console.error(err);
      }
    }
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const removeFile = (fieldName: string) => {
    setInputData((prevData) => ({
      ...prevData,
      [fieldName]: '',
    }));
  };

  const openFilePreview = (fileData: string) => {
    if (!fileData) return;
    
    setPreviewFile(fileData);
    
    if (fileData.startsWith('data:image')) {
      setPreviewType('image');
    } else if (fileData.startsWith('data:application/pdf')) {
      setPreviewType('pdf');
    } else {
      setPreviewType('other');
    }
    
    setOpenPreview(true);
  };

  const validateField = (name: string, value: string) => {
    let error = '';

    switch (name) {
      case 'name':
        error = value.trim().length < 1 ? 'Name is required' : '';
        break;
      case 'employeeType':
        error = value.length < 1 ? 'Employee Type is required' : '';
        break;
      case 'gender':
        error = value.length < 1 ? 'Select gender' : '';
        break;
      case 'email':
        error = !value.trim() ? 'Email is required' : !isValidEmail(value) ? 'Email is not valid' : '';
        break;
      case 'title':
        error = value.trim() === '' ? 'Title is required' : '';
        break;
      case 'number':
        error = !value.trim() 
          ? 'Mobile is required!' 
          : !/^\d{10}$/.test(value) 
            ? 'Mobile must be 10 digits long!' 
            : '';
        break;
      case 'aadharNumber':
        error = !value.trim()
          ? 'Aadhar Number is required!'
          : !/^\d{12}$/.test(value)
            ? 'Aadhar Number must be 12 digits long!'
            : '';
        break;
      case 'panNumber':
        error = !value.trim()
          ? 'PAN Number is required!'
          : !/^[A-Z]{5}\d{4}[A-Z]{1}$/.test(value)
            ? 'Invalid PAN Number format!'
            : '';
        break;
      case 'ifscCode':
        error = !value.trim()
          ? 'IFSC Code is required!'
          : !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(value)
            ? 'Invalid IFSC Code format!'
            : '';
        break;
      case 'bankAccount':
        error = !value.trim()
          ? 'Bank Account Number is required!'
          : !/^\d{9,18}$/.test(value)
            ? 'Bank Account Number must be 9-18 digits long!'
            : '';
        break;
      case 'pincode':
        error = !value.trim()
          ? 'Pincode is required!'
          : !/^\d{6}$/.test(value)
            ? 'Pincode must be 6 digits long!'
            : '';
        break;
      case 'city':
        error = value.trim() === '' ? 'City is required' : '';
        break;
      case 'state':
        error = value.trim() === '' ? 'State is required' : '';
        break;
      case 'address':
        error = value.trim() === '' ? 'Address is required' : '';
        break;
      case 'dateOfBirth':
        error = value.trim() === '' ? 'Date of Birth is required' : '';
        break;
      case 'joiningOfDate':
        error = value.trim() === '' ? 'Date of joining is required' : '';
        break;
      case 'fatherOrHusbandName':
        error = value.trim() === '' ? 'Father/ Husband Name is required' : '';
        break;
      case 'designation':
        error = value.trim() === '' ? 'Designation is required' : '';
        break;
      case 'branch':
        error = value.trim() === '' ? 'Branch is required' : '';
        break;
      case 'location':
        error = value.trim() === '' ? 'Location is required' : '';
        break;
      case 'bankName':
        error = value.trim() === '' ? 'Bank Name is required' : '';
        break;
      case 'qualification':
        error = value.trim() === '' ? 'Qualification is required' : '';
        break;
      case 'bankBranchName':
        error = value.trim() === '' ? 'Bank Branch Name is required' : '';
        break;
    //   case 'pf_no':
    //     error = value.trim() === '' ? 'PF Number is required' : '';
    //     break;
      default:
        break;
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const fetchData = async () => {
    try {
      const response = await fetch(`https://api.postalpincode.in/pincode/${inputData.pincode}`);
      if (response.ok) {
        const data = await response.json();
        if (data[0]?.Status === 'Success') {
          const city = data[0]?.PostOffice?.[0]?.District || '';
          const state = data[0]?.PostOffice?.[0]?.State || '';
          setInputData(prev => ({
            ...prev,
            city,
            state,
          }));
        } else {
          setErrors(prev => ({
            ...prev,
            pincode: 'Invalid pincode'
          }));
        }
      }
    } catch (error) {
      console.error(error);
      setError('Failed to fetch location data');
    }
  };

  useEffect(() => {
    if (inputData?.pincode?.length === 6 && /^\d{6}$/.test(inputData?.pincode)) {
      fetchData();
    }
  }, [inputData?.pincode]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        
        // Fetch employee data
        if (id) {
          const employeeResponse = await api.get(`/staff/${id}`);
          setInputData(employeeResponse.data.staff);
        }

        // Fetch designation
        const designationResponse = await axios.get(`${REACT_APP_BASE_URL}designation`);
        setDesignation(designationResponse.data.designation);

        // Fetch location
        const locationResponse = await axios.get(`${REACT_APP_BASE_URL}location`);
        setLocation(locationResponse.data.locations);

        // Fetch broker branch
        const brokerBranchResponse = await axios.get(`${REACT_APP_BASE_URL}broker-branch`);
        setBrokerBranch(brokerBranchResponse.data.brokerBranch);

        // Fetch roles
        const rolesResponse = await axios.get(`${REACT_APP_BASE_URL}roles`);
        if (rolesResponse.data) {
          setRole(rolesResponse.data.roles);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to fetch initial data');
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [id]);

  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };

    // Validate required fields
    const requiredFields: (keyof typeof inputData)[] = [
      'employeeType', 'title', 'name', 'gender', 'address', 'pincode',
      'city', 'state', 'panNumber', 'aadharNumber', 'dateOfBirth',
      'joiningOfDate', 'number', 'email', 'designation', 'branch',
      'bankBranchName', 'location', 'fatherOrHusbandName', 'qualification',
       'bankName', 'bankAccount', 'ifscCode'
    ];

    requiredFields.forEach(field => {
      if (!inputData[field]?.trim()) {
        newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      setError('Please fill all required fields');
      return;
    }

    try {
      setLoading(true);
      const response = await api.put(`staff/${id}`, inputData);
      if (response.status === 200 || response.status === 202) {
        navigate('/employee');
      }
    } catch (error: any) {
      console.error(error?.response);
      const err = error?.response?.data?.message || 'Failed to update employee';
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const renderBasicDetails = () => (
    <Grid container spacing={3}>
      {/* Employee ID */}
      <Grid item xs={12} sm={6} md={4}>
        <TextField
          fullWidth
          label="Employee ID"
          name="employeeId"
          value={inputData.employeeId}
          onChange={handleChange}
          InputProps={{
            readOnly: true,
          }}
          error={!!errors.employeeId}
          helperText={errors.employeeId}
        />
      </Grid>

      {/* Title */}
      <Grid item xs={12} sm={6} md={4}>
        <TextField
          select
          fullWidth
          label="Title"
          name="title"
          value={inputData.title}
          onChange={handleChange}
          error={!!errors.title}
          helperText={errors.title}
        >
          <MenuItem value="">Select Title</MenuItem>
          {titles.map((title) => (
            <MenuItem key={title} value={title}>
              {title}
            </MenuItem>
          ))}
        </TextField>
      </Grid>

      {/* Name */}
      <Grid item xs={12} sm={6} md={4}>
        <TextField
          fullWidth
          label="Name"
          name="name"
          value={inputData.name}
          onChange={handleChange}
          error={!!errors.name}
          helperText={errors.name}
        />
      </Grid>

      {/* Gender */}
      <Grid item xs={12} sm={6} md={4}>
        <TextField
          select
          fullWidth
          label="Gender"
          name="gender"
          value={inputData.gender}
          onChange={handleChange}
          error={!!errors.gender}
          helperText={errors.gender}
        >
          <MenuItem value="">Select Gender</MenuItem>
          {genders.map((gender) => (
            <MenuItem key={gender} value={gender.toLowerCase()}>
              {gender}
            </MenuItem>
          ))}
        </TextField>
      </Grid>

      {/* Employee Type */}
      <Grid item xs={12} sm={6} md={4}>
        <TextField
          select
          fullWidth
          label="Employee Type"
          name="employeeType"
          value={inputData.employeeType}
          onChange={handleChange}
          error={!!errors.employeeType}
          helperText={errors.employeeType}
        >
          <MenuItem value="">Select Employee Type</MenuItem>
          {employeeTypes.map((type) => (
            <MenuItem key={type} value={type}>
              {type}
            </MenuItem>
          ))}
        </TextField>
      </Grid>

      {/* Role */}
      <Grid item xs={12} sm={6} md={4}>
        <TextField
          select
          fullWidth
          label="Role"
          name="role"
          value={inputData.role}
          onChange={handleChange}
          error={!inputData.role}
          helperText={!inputData.role ? 'Role is required' : ''}
        >
          <MenuItem value="">Select Role</MenuItem>
          {role.map((item) => (
            <MenuItem key={item._id} value={item.role}>
              {item.role}
            </MenuItem>
          ))}
        </TextField>
      </Grid>

      {/* Address */}
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Address"
          name="address"
          value={inputData.address}
          onChange={handleChange}
          multiline
          rows={3}
          error={!!errors.address}
          helperText={errors.address}
        />
      </Grid>

      {/* Pincode */}
      <Grid item xs={12} sm={6} md={3}>
        <TextField
          fullWidth
          label="Pincode"
          name="pincode"
          value={inputData.pincode}
          onChange={handleChange}
          error={!!errors.pincode}
          helperText={errors.pincode}
        />
      </Grid>

      {/* City */}
      <Grid item xs={12} sm={6} md={3}>
        <TextField
          fullWidth
          label="City"
          name="city"
          value={inputData.city}
          onChange={handleChange}
          error={!!errors.city}
          helperText={errors.city}
          InputLabelProps={{ shrink: true }}

        />
      </Grid>

      {/* State */}
      <Grid item xs={12} sm={6} md={3}>
        <TextField
          fullWidth
          label="State"
          name="state"
          value={inputData.state}
          onChange={handleChange}
          error={!!errors.state}
          helperText={errors.state}
          InputLabelProps={{ shrink: true }}

        />
      </Grid>

      {/* Date of Birth */}
      <Grid item xs={12} sm={6} md={3}>
        <TextField
          fullWidth
          label="Date of Birth"
          name="dateOfBirth"
          type="date"
          value={inputData.dateOfBirth}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
          error={!!errors.dateOfBirth}
          helperText={errors.dateOfBirth}
        />
      </Grid>

      {/* Date of Joining */}
      <Grid item xs={12} sm={6} md={3}>
        <TextField
          fullWidth
          label="Date of Joining"
          name="joiningOfDate"
          type="date"
          value={inputData.joiningOfDate}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
          error={!!errors.joiningOfDate}
          helperText={errors.joiningOfDate}
        />
      </Grid>

      {/* Designation */}
      <Grid item xs={12} sm={6} md={3}>
        <TextField
          select
          fullWidth
          label="Designation"
          name="designation"
          value={inputData.designation}
          onChange={handleChange}
          error={!!errors.designation}
          helperText={errors.designation}
        >
          <MenuItem value="">Select Designation</MenuItem>
          {designation.map((item) => (
            <MenuItem key={item._id} value={item.designation}>
              {item.designation}
            </MenuItem>
          ))}
        </TextField>
      </Grid>

      {/* Aadhar Number */}
      <Grid item xs={12} sm={6} md={3}>
        <TextField
          fullWidth
          label="Aadhar Number"
          name="aadharNumber"
          value={inputData.aadharNumber}
          onChange={handleChange}
          error={!!errors.aadharNumber}
          helperText={errors.aadharNumber}
        />
      </Grid>

      {/* PAN Number */}
      <Grid item xs={12} sm={6} md={3}>
        <TextField
          fullWidth
          label="PAN Number"
          name="panNumber"
          value={inputData.panNumber}
          onChange={handleChange}
          error={!!errors.panNumber}
          helperText={errors.panNumber}
        />
      </Grid>

      {/* Mobile */}
      <Grid item xs={12} sm={6} md={3}>
        <TextField
          fullWidth
          label="Mobile"
          name="number"
          value={inputData.number}
          onChange={handleChange}
          error={!!errors.number}
          helperText={errors.number}
        />
      </Grid>

      {/* Alternate Mobile */}
      <Grid item xs={12} sm={6} md={3}>
        <TextField
          fullWidth
          label="Alternate Mobile"
          name="alternateNumber"
          value={inputData.alternateNumber}
          onChange={handleChange}
        />
      </Grid>

      {/* Email */}
      <Grid item xs={12} sm={6} md={3}>
        <TextField
          fullWidth
          label="Email"
          name="email"
          value={inputData.email}
          onChange={handleChange}
          error={!!errors.email}
          helperText={errors.email}
        />
      </Grid>

      {/* Alternate Email */}
      <Grid item xs={12} sm={6} md={3}>
        <TextField
          fullWidth
          label="Alternate Email"
          name="alternateEmail"
          value={inputData.alternateEmail}
          onChange={handleChange}
        />
      </Grid>

      {/* Broker Branch */}
      <Grid item xs={12} sm={6} md={3}>
        <TextField
          select
          fullWidth
          label="Broker Branch"
          name="branch"
          value={inputData.branch}
          onChange={handleChange}
          error={!!errors.branch}
          helperText={errors.branch}
        >
          <MenuItem value="">Select Branch</MenuItem>
          {brokerBranch.map((item) => (
            <MenuItem key={item._id} value={item.branchName}>
              {item.branchName}
            </MenuItem>
          ))}
        </TextField>
      </Grid>

      {/* Location */}
      <Grid item xs={12} sm={6} md={3}>
        <TextField
          select
          fullWidth
          label="Location"
          name="location"
          value={inputData.location}
          onChange={handleChange}
          error={!!errors.location}
          helperText={errors.location}
        >
          <MenuItem value="">Select Location</MenuItem>
          {location.map((item) => (
            <MenuItem key={item._id} value={item.locationName}>
              {item.locationName}
            </MenuItem>
          ))}
        </TextField>
      </Grid>

      {/* Father/Husband Name */}
      <Grid item xs={12} sm={6} md={3}>
        <TextField
          fullWidth
          label="Father/Husband Name"
          name="fatherOrHusbandName"
          value={inputData.fatherOrHusbandName}
          onChange={handleChange}
          error={!!errors.fatherOrHusbandName}
          helperText={errors.fatherOrHusbandName}
        />
      </Grid>

      {/* Qualification */}
      <Grid item xs={12} sm={6} md={3}>
        <TextField
          fullWidth
          label="Qualification"
          name="qualification"
          value={inputData.qualification}
          onChange={handleChange}
          error={!!errors.qualification}
          helperText={errors.qualification}
        />
      </Grid>

      {/* PF Number */}
      <Grid item xs={12} sm={6} md={3}>
        <TextField
          fullWidth
          label="PF Number"
          name="pf_no"
          value={inputData.pf_no}
          onChange={handleChange}
          error={!!errors.pf_no}
          helperText={errors.pf_no}
        />
      </Grid>
    </Grid>
  );

  const renderBankDetails = () => (
    <Grid container spacing={3}>
      {/* Bank Name */}
      <Grid item xs={12} sm={6} md={4}>
        <TextField
          fullWidth
          label="Bank Name"
          name="bankName"
          value={inputData.bankName}
          onChange={handleChange}
          error={!!errors.bankName}
          helperText={errors.bankName}
        />
      </Grid>

      {/* Bank Branch Name */}
      <Grid item xs={12} sm={6} md={4}>
        <TextField
          fullWidth
          label="Bank Branch Name"
          name="bankBranchName"
          value={inputData.bankBranchName}
          onChange={handleChange}
          error={!!errors.bankBranchName}
          helperText={errors.bankBranchName}
        />
      </Grid>

      {/* Bank Account */}
      <Grid item xs={12} sm={6} md={4}>
        <TextField
          fullWidth
          label="Bank Account Number"
          name="bankAccount"
          value={inputData.bankAccount}
          onChange={handleChange}
          error={!!errors.bankAccount}
          helperText={errors.bankAccount}
        />
      </Grid>

      {/* IFSC Code */}
      <Grid item xs={12} sm={6} md={4}>
        <TextField
          fullWidth
          label="IFSC Code"
          name="ifscCode"
          value={inputData.ifscCode}
          onChange={handleChange}
          error={!!errors.ifscCode}
          helperText={errors.ifscCode}
        />
      </Grid>
    </Grid>
  );

  const renderDocumentSection = (title: string, fields: {name: string, label: string}[]) => (
    <Box sx={{ mb: 4 }}>
      <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main', mt: 2 }}>
        {title}
      </Typography>
      <Grid container spacing={2}>
        {fields.map((field) => (
          <Grid item xs={12} sm={6} md={4} key={field.name}>
            <Paper
              variant="outlined"
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
              }}
            >
              {inputData[field.name] ? (
                <>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Chip
                      label={field.label}
                      color="primary"
                      size="small"
                      sx={{ mr: 1 }}
                    />
                    <IconButton
                      size="small"
                      onClick={() => openFilePreview(inputData[field.name])}
                    >
                      <Visibility fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => removeFile(field.name)}
                    >
                      <Delete fontSize="small" color="error" />
                    </IconButton>
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    Document uploaded
                  </Typography>
                </>
              ) : (
                <>
                  <label htmlFor={`upload-${field.name}`}>
                    <input
                      id={`upload-${field.name}`}
                      name={field.name}
                      type="file"
                      onChange={handleFileChange}
                      style={{ display: 'none' }}
                      accept={field.name.includes('image') ? 'image/*' : field.name.includes('pdf') ? '.pdf' : '*'}
                    />
                    <Button
                      variant="outlined"
                      component="span"
                      startIcon={<CloudUpload />}
                      sx={{ mb: 1 }}
                    >
                      Upload {field.label}
                    </Button>
                  </label>
                  <Typography variant="caption" color="text.secondary">
                    No document uploaded
                  </Typography>
                </>
              )}
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  const renderDocumentDetails = () => (
    <>
      {renderDocumentSection('Employer Documents', [
        { name: 'jobOfferLetter', label: 'Job Offer Letter' },
        { name: 'joiningLetter', label: 'Joining Letter' },
        { name: 'nda', label: 'NDA' },
      ])}

      {renderDocumentSection('Ex-Employee Documents', [
        { name: 'experienceLetter', label: 'Experience Letter' },
        { name: 'relievingLetter', label: 'Relieving Letter' },
        { name: 'salarySlip', label: 'Salary Slip' },
      ])}

      {renderDocumentSection('KYC Documents', [
        { name: 'aadharCard', label: 'Aadhar Card' },
        { name: 'panCard', label: 'PAN Card' },
        { name: 'cancelledCheque', label: 'Cancelled Cheque' },
        { name: 'passport', label: 'Passport' },
        { name: 'sscCertificate', label: 'SSC Certificate' },
        { name: 'hscCertificate', label: 'HSC Certificate' },
        { name: 'graduationCertificate', label: 'Graduation Certificate' },
      ])}
    </>
  );

  if (loading && !inputData.employeeId) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <Typography variant="h6">Loading employee data...</Typography>
      </Container>
    );
  }

  if (error && !inputData.employeeId) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <Typography variant="h6" color="error">{error}</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Card>
        <CardHeader
          title="Update Employee Details"
          titleTypographyProps={{ variant: 'h5', fontWeight: 'bold' }}
          sx={{ backgroundColor: 'primary.main', color: 'white' }}
          action={
            <TextField
              select
              variant="outlined"
              size="small"
              sx={{ 
                backgroundColor: 'white',
                minWidth: 200,
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'transparent',
                  },
                  '&:hover fieldset': {
                    borderColor: 'transparent',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'transparent',
                  },
                },
              }}
              name="role"
              value={inputData.role}
              onChange={handleChange}
              error={!inputData.role}
            >
              <MenuItem value="">Select Role</MenuItem>
              {role.map((item) => (
                <MenuItem key={item._id} value={item.role}>
                  {item.role}
                </MenuItem>
              ))}
            </TextField>
          }
        />
        <CardContent>
          {error && (
            <Typography color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}

          <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }}>
            <Tab label="Basic Details" icon={<Person />} />
            <Tab label="Bank Details" icon={<AccountBalance />} />
            <Tab label="Document Details" icon={<Description />} />
          </Tabs>

          <form onSubmit={handleSubmit}>
            {activeTab === 0 && renderBasicDetails()}
            {activeTab === 1 && renderBankDetails()}
            {activeTab === 2 && renderDocumentDetails()}

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => navigate('/employee')}
                sx={{ mr: 2 }}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                variant="contained" 
                color="primary"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save'}
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>

      {/* Document Preview Dialog */}
      <Dialog open={openPreview} onClose={() => setOpenPreview(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Document Preview
          <IconButton
            aria-label="close"
            onClick={() => setOpenPreview(false)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {previewType === 'image' && (
            <img src={previewFile || ''} alt="Preview" style={{ width: '100%', height: 'auto', maxHeight: '70vh', objectFit: 'contain' }} />
          )}
          {previewType === 'pdf' && (
            <iframe
              src={previewFile || ''}
              width="100%"
              height="600px"
              title="PDF Preview"
            />
          )}
          {previewType === 'other' && (
            <Typography>This file type cannot be previewed. Please download the file to view it.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPreview(false)}>Close</Button>
          <Button 
            component="a"
            href={previewFile || ''}
            download
            variant="contained"
            color="primary"
          >
            Download
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default EditEmployee;