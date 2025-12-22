import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Box,
  Chip,
  useTheme,
  useMediaQuery,
  FormControl,
  InputLabel,
  Select,
  MenuItem as MuiMenuItem,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  TextField,
  Grid,
  Switch,
  FormControlLabel,
  FormGroup,
  Alert,
  Snackbar,
  CircularProgress,
  Badge,
  Paper,
  Divider,
  Card,
  CardContent,
  CardActions,
  IconButton as MuiIconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  SelectChangeEvent,
} from '@mui/material';
import {
  AccountCircle,
  ExitToApp,
  Menu as MenuIcon,
  Notifications,
  Add,
  Delete,
  Edit,
  Visibility,
  Close,
  Announcement,
  Event,
  Campaign,
  Warning,
  CheckCircle,
  FilterList,
  Clear,
  CalendarToday,
  Class,
  School,
  AccessTime,
  Person,
} from '@mui/icons-material';
import { logout } from '../../store/slices/authSlice';
import { useAuth } from '../../hooks/useAuth';
import CustomModal from '../customModal';
import { get, post, put, del } from '../../api/api';

const drawerWidth = 280;

interface HeaderProps {
  onMobileMenuToggle?: () => void;
}

interface Announcement {
  id: number;
  type: 'notice' | 'event' | 'alert';
  title: string;
  description: string;
  link?: string;
  media?: string;
  targetClass?: string;
  targetSection?: string;
  isSuspended: boolean;
  createdById: number;
  createdByRole: string;
  schoolId: number;
  createdAt: string;
  updatedAt: string;
}

interface Classroom {
  id: number;
  name: string;
  section: string;
  schoolId: number;
}

const Header: React.FC<HeaderProps> = ({ onMobileMenuToggle }) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [academicYear, setAcademicYear] = useState<string>('2023-2024');
  const [openModal, setOpenModal] = useState(false);
  const [announcementDrawerOpen, setAnnouncementDrawerOpen] = useState(false);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editAnnouncement, setEditAnnouncement] = useState<Announcement | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [announcementToDelete, setAnnouncementToDelete] = useState<number | null>(null);
  const [newAnnouncement, setNewAnnouncement] = useState({
    type: 'notice',
    title: '',
    description: '',
    targetClass: '',
    targetSection: '',
    schoolId:1
  });

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    notices: 0,
    events: 0,
    alerts: 0,
  });

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    setOpenModal(true);
    handleMenuClose();
  };

  const handleConfirmLogout = () => {
    dispatch(logout());
    setOpenModal(false);
  };

  const handleCancelLogout = () => {
    setOpenModal(false);
  };

  const handleAcademicYearChange = (event: SelectChangeEvent<string>) => {
    setAcademicYear(event.target.value);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'error';
      case 'director': return 'primary';
      case 'special_assignee': return 'warning';
      case 'staff': return 'success';
      default: return 'default';
    }
  };

  const getAnnouncementIcon = (type: string) => {
    switch (type) {
      case 'event': return <Event color="primary" />;
      case 'alert': return <Warning color="error" />;
      default: return <Announcement color="info" />;
    }
  };

  const getAnnouncementColor = (type: string) => {
    switch (type) {
      case 'event': return 'primary.main';
      case 'alert': return 'error.main';
      case 'notice': return 'info.main';
      default: return 'text.primary';
    }
  };

  const fetchAnnouncements = async () => {

    setLoading(true);
    try {
      const endpoint = filterType === 'all' 
        ? `/announcements?schoolId=${`1`}`
        : `/announcements?type=${filterType}&schoolId=${1}`;
      
      const response = await get(endpoint, {}, user.accessToken);
      setAnnouncements(response?.announcements || []);
      
      // Calculate stats
      const total = response?.announcements?.length || 0;
      const notices = response?.announcements?.filter((a: Announcement) => a.type === 'notice').length || 0;
      const events = response?.announcements?.filter((a: Announcement) => a.type === 'event').length || 0;
      const alerts = response?.announcements?.filter((a: Announcement) => a.type === 'alert').length || 0;
      
      setStats({ total, notices, events, alerts });
    } catch (error: any) {
      console.error('Error fetching announcements:', error);
      setError('Failed to fetch announcements');
    } finally {
      setLoading(false);
    }
  };

  // Fetch classrooms
  const fetchClassrooms = async () => {
    try {
      const response = await get('/classes', {}, user?.accessToken || '');
      setClassrooms(response?.classrooms || []);
    } catch (error: any) {
      console.error('Error fetching classrooms:', error);
    }
  };

  useEffect(() => {
    if (announcementDrawerOpen) {
      fetchAnnouncements();
      fetchClassrooms();
    }
  }, [announcementDrawerOpen, filterType]);

  // Create announcement
  const handleCreateAnnouncement = async () => {
    if (!newAnnouncement.title || !newAnnouncement.description) {
      setError('Title and description are required');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...newAnnouncement,
        schoolId: 1,
      };

      const response = await post('/announcements', payload, user?.accessToken || '');
      
      setSuccess('Announcement created successfully');
      fetchAnnouncements();
      resetCreateForm();
      setShowCreateForm(false);
    } catch (error: any) {
      console.error('Error creating announcement:', error);
      setError(error.message || 'Failed to create announcement');
    } finally {
      setLoading(false);
    }
  };

  // Update announcement
  const handleUpdateAnnouncement = async () => {
    if (!editAnnouncement || !editAnnouncement.title || !editAnnouncement.description) {
      setError('Title and description are required');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        type: editAnnouncement.type,
        title: editAnnouncement.title,
        description: editAnnouncement.description,
        targetClass: editAnnouncement.targetClass || null,
        targetSection: editAnnouncement.targetSection || null,
      };

      await put(`/announcements/${editAnnouncement.id}`, payload, user?.accessToken || '');
      
      setSuccess('Announcement updated successfully');
      fetchAnnouncements();
      setEditAnnouncement(null);
    } catch (error: any) {
      console.error('Error updating announcement:', error);
      setError(error.message || 'Failed to update announcement');
    } finally {
      setLoading(false);
    }
  };

  // Delete announcement
  const handleDeleteAnnouncement = async () => {
    if (!announcementToDelete) return;
      console.log("user?.accessToken",user?.accessToken)
    setLoading(true);
    try {
    const xxx=  await del(`/announcements/${announcementToDelete}`, user?.accessToken);
      console.log("first",xxx)
      setSuccess('Announcement deleted successfully');
      fetchAnnouncements();
      setDeleteDialogOpen(false);
      setAnnouncementToDelete(null);
    } catch (error: any) {
      console.error('Error deleting announcement:', error);
      setError(error.message || 'Failed to delete announcement');
    } finally {
      setLoading(false);
    }
  };

  const resetCreateForm = () => {
    setNewAnnouncement({
      type: 'notice',
      title: '',
      description: '',
      targetClass: '',
      targetSection: '',
    });
  };

  const handleEditClick = (announcement: Announcement) => {
    setEditAnnouncement(announcement);
  };

  const handleDeleteClick = (id: number) => {
    setAnnouncementToDelete(id);
    setDeleteDialogOpen(true);
  };

  const filteredAnnouncements = announcements.filter(announcement => {
    const matchesSearch = announcement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         announcement.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Generate academic years
  const currentYear = new Date().getFullYear();
  const academicYears = [
    `${currentYear-1}-${currentYear}`,
    `${currentYear}-${currentYear+1}`,
    `${currentYear+1}-${currentYear+2}`,
  ];

  return (
    <>
      <AppBar
        className="bg-#575FFE"
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          backdropFilter: 'blur(10px)',
          // bgcolor: '##575FFE', //not working
          backgroundColor: '#575FFE',
        }}
      >
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {isMobile && (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={onMobileMenuToggle}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
            )}

            {/* Academic Year Select */}
            <FormControl
              size="small"
              sx={{
                minWidth: 120,
                mr: 2,
                '& .MuiInputBase-root': {
                  color: 'white',
                  '& fieldset': {
                    borderColor: 'rgba(255,255,255,0.5)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'white',
                  },
                },
                '& .MuiSvgIcon-root': {
                  color: 'white',
                },
              }}
            >
              <InputLabel
                sx={{
                  color: 'white !important',
                  '&.Mui-focused': {
                    color: 'white',
                  },
                }}
              >
                Academic Year
              </InputLabel>
              <Select
                value={academicYear}
                onChange={handleAcademicYearChange}
                label="Academic Year"
                sx={{
                  '& .MuiSelect-select': {
                    py: 1,
                  },
                }}
              >
                {academicYears.map((year) => (
                  <MuiMenuItem key={year} value={year}>
                    {year}
                  </MuiMenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
            {/* Announcements Button */}
            <IconButton
              color="inherit"
              onClick={() => setAnnouncementDrawerOpen(true)}
              sx={{
                mr: 1,
                position: 'relative',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.1)',
                },
              }}
            >
              <Badge badgeContent={stats.total} color="error">
                <Notifications />
              </Badge>
            </IconButton>

            <Chip
              label={user?.role.replace('_', ' ').toUpperCase()}
              color={getRoleColor(user?.role || '') as any}
              size="small"
              sx={{
                color: 'white',
                fontWeight: 'bold',
                display: { xs: 'none', sm: 'flex' },
              }}
            />

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 500,
                  display: { xs: 'none', sm: 'block' },
                }}
              >
                {user?.email}
              </Typography>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenuOpen}
                color="inherit"
              >
                <Avatar sx={{ width: 32, height: 32, bgcolor: 'rgba(255,255,255,0.2)' }}>
                  <AccountCircle />
                </Avatar>
              </IconButton>
            </Box>
          </Box>

          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            {isMobile && (
              <MenuItem disabled>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <Typography variant="body2" fontWeight="bold">
                    {user?.email}
                  </Typography>
                  <Chip
                    label={user?.role.replace('_', ' ').toUpperCase()}
                    color={getRoleColor(user?.role || '') as any}
                    size="small"
                    sx={{ mt: 0.5 }}
                  />
                </Box>
              </MenuItem>
            )}
            <MenuItem onClick={handleLogout}>
              <ExitToApp sx={{ mr: 1 }} />
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Announcements Drawer */}
      <Drawer
        anchor="right"
        open={announcementDrawerOpen}
        onClose={() => setAnnouncementDrawerOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: { xs: '100%', sm: 600 },
            boxShadow: '-10px 0 30px rgba(0,0,0,0.1)',
            backdropFilter: 'blur(10px)',
            backgroundColor: 'rgba(255,255,255,0.95)',
          },
        }}
      >
        <Box sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
          {/* Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Announcement color="primary" sx={{ fontSize: 32 }} />
              <Box>
                <Typography variant="h5" fontWeight="bold">
                  Announcements
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Manage and view all announcements
                </Typography>
              </Box>
            </Box>
            <IconButton onClick={() => setAnnouncementDrawerOpen(false)}>
              <Close />
            </IconButton>
          </Box>

          {/* Stats Cards */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={3}>
              <Card sx={{ bgcolor: 'primary.light', color: 'white' }}>
                <CardContent sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h4" fontWeight="bold">
                    {stats.total}
                  </Typography>
                  <Typography variant="caption">Total</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={3}>
              <Card sx={{ bgcolor: 'info.light', color: 'white' }}>
                <CardContent sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h4" fontWeight="bold">
                    {stats.notices}
                  </Typography>
                  <Typography variant="caption">Notices</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={3}>
              <Card sx={{ bgcolor: 'warning.light', color: 'white' }}>
                <CardContent sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h4" fontWeight="bold">
                    {stats.events}
                  </Typography>
                  <Typography variant="caption">Events</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={3}>
              <Card sx={{ bgcolor: 'error.light', color: 'white' }}>
                <CardContent sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h4" fontWeight="bold">
                    {stats.alerts}
                  </Typography>
                  <Typography variant="caption">Alerts</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Filter and Search */}
          <Box sx={{ mb: 3 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Search announcements..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <FilterList fontSize="small" />
                      </InputAdornment>
                    ),
                    endAdornment: searchQuery && (
                      <InputAdornment position="end">
                        <IconButton size="small" onClick={() => setSearchQuery('')}>
                          <Clear fontSize="small" />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth size="small">
                  <Select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                  >
                    <MenuItem value="all">All Types</MenuItem>
                    <MenuItem value="notice">Notices</MenuItem>
                    <MenuItem value="event">Events</MenuItem>
                    <MenuItem value="alert">Alerts</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={2}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => setShowCreateForm(true)}
                  sx={{ height: '40px' }}
                >
                  Add
                </Button>
              </Grid>
            </Grid>
          </Box>

          {/* Create/Edit Form */}
          {(showCreateForm || editAnnouncement) && (
            <Card sx={{ mb: 3, bgcolor: 'background.paper' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {editAnnouncement ? 'Edit Announcement' : 'Create New Announcement'}
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Type</InputLabel>
                      <Select
                        value={editAnnouncement ? editAnnouncement.type : newAnnouncement.type}
                        onChange={(e) => {
                          if (editAnnouncement) {
                            setEditAnnouncement({ ...editAnnouncement, type: e.target.value as any });
                          } else {
                            setNewAnnouncement({ ...newAnnouncement, type: e.target.value as any });
                          }
                        }}
                        label="Type"
                      >
                        <MenuItem value="notice">Notice</MenuItem>
                        <MenuItem value="event">Event</MenuItem>
                        <MenuItem value="alert">Alert</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Class</InputLabel>
                      <Select
                        value={editAnnouncement ? editAnnouncement.targetClass || '' : newAnnouncement.targetClass}
                        onChange={(e) => {
                          if (editAnnouncement) {
                            setEditAnnouncement({ ...editAnnouncement, targetClass: e.target.value });
                          } else {
                            setNewAnnouncement({ ...newAnnouncement, targetClass: e.target.value });
                          }
                        }}
                        label="Class"
                      >
                        <MenuItem value="">All Classes</MenuItem>
                        {classrooms.map((classroom) => (
                          <MenuItem key={classroom.id} value={classroom.name}>
                            {classroom.name} - {classroom.section}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Section"
                      value={editAnnouncement ? editAnnouncement.targetSection || '' : newAnnouncement.targetSection}
                      onChange={(e) => {
                        if (editAnnouncement) {
                          setEditAnnouncement({ ...editAnnouncement, targetSection: e.target.value });
                        } else {
                          setNewAnnouncement({ ...newAnnouncement, targetSection: e.target.value });
                        }
                      }}
                      placeholder="Optional"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Title"
                      value={editAnnouncement ? editAnnouncement.title : newAnnouncement.title}
                      onChange={(e) => {
                        if (editAnnouncement) {
                          setEditAnnouncement({ ...editAnnouncement, title: e.target.value });
                        } else {
                          setNewAnnouncement({ ...newAnnouncement, title: e.target.value });
                        }
                      }}
                      placeholder="Enter announcement title"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      size="small"
                      label="Description"
                      value={editAnnouncement ? editAnnouncement.description : newAnnouncement.description}
                      onChange={(e) => {
                        if (editAnnouncement) {
                          setEditAnnouncement({ ...editAnnouncement, description: e.target.value });
                        } else {
                          setNewAnnouncement({ ...newAnnouncement, description: e.target.value });
                        }
                      }}
                      placeholder="Enter announcement description"
                    />
                  </Grid>
                </Grid>
              </CardContent>
              <CardActions sx={{ justifyContent: 'flex-end', gap: 1 }}>
                <Button
                  variant="outlined"
                  onClick={() => {
                    if (editAnnouncement) {
                      setEditAnnouncement(null);
                    } else {
                      setShowCreateForm(false);
                      resetCreateForm();
                    }
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  onClick={editAnnouncement ? handleUpdateAnnouncement : handleCreateAnnouncement}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : editAnnouncement ? 'Update' : 'Create'}
                </Button>
              </CardActions>
            </Card>
          )}

          {/* Announcements List */}
          <Box sx={{ flex: 1, overflow: 'auto' }}>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
                <CircularProgress />
              </Box>
            ) : filteredAnnouncements.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Announcement sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  No announcements found
                </Typography>
                {!showCreateForm && (
                  <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => setShowCreateForm(true)}
                    sx={{ mt: 2 }}
                  >
                    Create Announcement
                  </Button>
                )}
              </Box>
            ) : (
              <List>
                {filteredAnnouncements.map((announcement) => (
                  <React.Fragment key={announcement.id}>
                    <ListItem
                      sx={{
                        mb: 2,
                        p: 2,
                        bgcolor: 'background.paper',
                        borderRadius: 2,
                        borderLeft: `4px solid ${getAnnouncementColor(announcement.type)}`,
                        '&:hover': {
                          bgcolor: 'action.hover',
                        },
                      }}
                    >
                      <ListItemIcon>
                        {getAnnouncementIcon(announcement.type)}
                      </ListItemIcon>
                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                          <Box>
                            <Typography variant="subtitle1" fontWeight="bold">
                              {announcement.title}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                              <Chip
                                label={announcement.type}
                                size="small"
                                sx={{
                                  bgcolor: getAnnouncementColor(announcement.type),
                                  color: 'white',
                                }}
                              />
                              {announcement.targetClass && (
                                <Chip
                                  icon={<Class fontSize="small" />}
                                  label={`Class ${announcement.targetClass}`}
                                  size="small"
                                  variant="outlined"
                                />
                              )}
                              {announcement.targetSection && (
                                <Chip
                                  icon={<School fontSize="small" />}
                                  label={`Section ${announcement.targetSection}`}
                                  size="small"
                                  variant="outlined"
                                />
                              )}
                            </Box>
                          </Box>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <IconButton
                              size="small"
                              onClick={() => handleEditClick(announcement)}
                              sx={{ color: 'primary.main' }}
                            >
                              <Edit fontSize="small" />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => handleDeleteClick(announcement.id)}
                              sx={{ color: 'error.main' }}
                            >
                              <Delete fontSize="small" />
                            </IconButton>
                          </Box>
                        </Box>
                        <Typography variant="body2" color="text.secondary" paragraph>
                          {announcement.description}
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="caption" color="text.secondary">
                            <AccessTime fontSize="inherit" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                            {formatDate(announcement.createdAt)}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            <Person fontSize="inherit" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                            {announcement.createdByRole}
                          </Typography>
                        </Box>
                      </Box>
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))}
              </List>
            )}
          </Box>
        </Box>
      </Drawer>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Delete Announcement</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this announcement? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleDeleteAnnouncement}
            color="error"
            variant="contained"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Logout Modal */}
      <CustomModal
  isOpen={openModal}
  onClose={handleCancelLogout}
  width="500px"
  showCloseButton={false}
>
  <Box sx={{ textAlign: 'center', p: 4 }}>
    {/* Icon with gradient background */}
    <Box
      sx={{
        width: 80,
        height: 80,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 24px',
        boxShadow: '0 8px 25px rgba(255, 107, 107, 0.3)',
      }}
    >
      <ExitToApp sx={{ fontSize: 40, color: 'white' }} />
    </Box>
    
    {/* Title */}
    <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ color: 'text.primary' }}>
      Confirm Logout
    </Typography>
    
    {/* Description */}
    <Typography variant="body1" color="text.secondary" paragraph sx={{ mb: 3 }}>
      Are you sure you want to logout your account.
    </Typography>
    
    {/* Action Buttons */}
    <Box display="flex" gap={2} justifyContent="center">
      <Button
        variant="outlined"
        onClick={handleCancelLogout}
        sx={{
          borderRadius: 2,
          px: 4,
          py: 1,
          textTransform: 'none',
          fontWeight: 'bold',
          minWidth: 120,
          borderColor: 'grey.300',
          color: 'text.primary',
          '&:hover': {
            borderColor: 'primary.main',
            backgroundColor: 'action.hover',
          }
        }}
      >
        Cancel
      </Button>
      <Button
        variant="contained"
        onClick={handleConfirmLogout}
        startIcon={<ExitToApp />}
        sx={{
          borderRadius: 2,
          px: 4,
          py: 1,
          textTransform: 'none',
          fontWeight: 'bold',
          minWidth: 120,
          background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)',
          boxShadow: '0 4px 15px rgba(255, 107, 107, 0.4)',
          '&:hover': {
            background: 'linear-gradient(135deg, #ee5a52 0%, #d64545 100%)',
            boxShadow: '0 6px 20px rgba(255, 107, 107, 0.5)',
          }
        }}
      >
        Logout
      </Button>
    </Box>
  </Box>
</CustomModal>

      {/* Snackbar for notifications */}
      <Snackbar
        open={!!error || !!success}
        autoHideDuration={6000}
        onClose={() => {
          setError(null);
          setSuccess(null);
        }}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          severity={error ? 'error' : 'success'}
          onClose={() => {
            setError(null);
            setSuccess(null);
          }}
          sx={{ width: '100%' }}
        >
          {error || success}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Header;