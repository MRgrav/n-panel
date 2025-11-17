import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Divider,
  Box,
  Typography,
  useTheme,
  useMediaQuery,
  styled,
  Avatar,
  IconButton,
} from '@mui/material';
import {
  Dashboard,
  People,
  Policy,
  ContactMail,
  ExpandLess,
  ExpandMore,
  Settings,
  Payment,
  Business,
  Work,
  PersonAdd,
  PersonOff,
  Menu as MenuIcon,
  ChevronLeft,
} from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';
 import logo from '../../assets/images/nitya.png'

const drawerWidth = 280;

interface SidebarProps {
  mobileOpen?: boolean;
  onMobileToggle?: () => void;
}

const SidebarLogo = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(1, 1),
  marginBottom: theme.spacing(1),
}));

const Sidebar: React.FC<SidebarProps> = ({ mobileOpen = false, onMobileToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user, canAccessMaster, canAccessEmployee, canManagePolicies, canManageLeads } = useAuth();
  
  const [masterOpen, setMasterOpen] = useState(false);
  const [employeeOpen, setEmployeeOpen] = useState(false);

  const handleMasterClick = () => {
    setMasterOpen(!masterOpen);
  };

  const handleEmployeeClick = () => {
    setEmployeeOpen(!employeeOpen);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile && onMobileToggle) {
      onMobileToggle();
    }
  };

  const isActive = (path: string) => location.pathname === path;

  const menuItems = [
    {
      text: 'Dashboard',
      icon: <Dashboard />,
      path: '/dashboard',
      show: true,
    },
    {
      text: 'Master',
      icon: <Settings />,
      hasSubmenu: true,
      show: canAccessMaster(),
      submenuOpen: masterOpen,
      onToggle: handleMasterClick,
      submenu: [
        { text: 'Departments', icon: <Business />, path: '/master/departments' },
      ],
    },
    {
      text: 'Staff',
      icon: <People />,
      hasSubmenu: true,
      show: canAccessEmployee(),
      submenuOpen: employeeOpen,
      onToggle: handleEmployeeClick,
      submenu: [
        { text: 'Current Staff', icon: <PersonAdd />, path: '/employee' },
        { text: 'Ex Staff', icon: <PersonOff />, path: '/ex-employee' },
      ],
    },
    {
      text: 'Admissions',
      icon: <PersonAdd />,
      path: '/admissions',
      show: true,
    },
    {
      text: 'Students',
      icon: <People />,
      path: '/students',
      show: true,
    },
    {
      text: 'Attendance',
      icon: <Work />,
      path: '/attendance',
      show: true,
    },
    {
      text: 'Fees',
      icon: <Payment />,
      path: '/fees',
      show: true,
    },

    {
      text: 'Communication',
      icon: <ContactMail />,
      path: '/communication',
      show: true,
    },
    {
      text: 'Certificates & Marksheet',
      icon: <Policy />,
      path: '/certificates-mark-sheet',
      show: true,
    },
    {
      text: 'LMS',
      icon: <Settings />,
      path: '/lms',
      show: true,
    },
  ];

  const drawerContent = (
    <>
      <SidebarLogo>
        {/* <p className='text-2xl font-bold'>NMS Logo</p> */}
        <img className='w-20' src="https://www.naviadesk.in/wp-content/uploads/2024/09/NAVIADESK-logo.png"  alt="" />
      </SidebarLogo>
      
      <Divider sx={{ backgroundColor: 'rgba(255,255,255,0.1)', mx: 1 }} />
      
      <List sx={{ px: 2, pt: 2 }}>
        {menuItems.map((item) => {
          if (!item.show) return null;
          
          if (item.hasSubmenu) {
            return (
              <React.Fragment key={item.text}>
                <ListItem disablePadding sx={{ mb: 0.5 }}>
                  <ListItemButton
                    onClick={item.onToggle}
                    sx={{
                      borderRadius: '8px',
                      '&:hover': {
                        backgroundColor: 'rgba(255,255,255,0.1)',
                      },
                    }}
                  >
                    <ListItemIcon sx={{ color: 'white', minWidth: 36 }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText 
                      primary={item.text} 
                      primaryTypographyProps={{ fontSize: '0.95rem' }}
                    />
                    {item.submenuOpen ? (
                      <ExpandLess sx={{ color: 'white' }} />
                    ) : (
                      <ExpandMore sx={{ color: 'white' }} />
                    )}
                  </ListItemButton>
                </ListItem>
                <Collapse in={item.submenuOpen} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {item.submenu?.map((subItem) => (
                      <ListItem key={subItem.text} disablePadding sx={{ mb: 0.5 }}>
                        <ListItemButton
                          onClick={() => handleNavigation(subItem.path)}
                          sx={{
                            pl: 4,
                            borderRadius: '8px',
                            backgroundColor: isActive(subItem.path) 
                              ? 'rgba(255,255,255,0.2)' 
                              : 'transparent',
                            '&:hover': {
                              backgroundColor: 'rgba(255,255,255,0.1)',
                            },
                          }}
                        >
                          <ListItemIcon sx={{ color: 'white', minWidth: 32 }}>
                            {subItem.icon}
                          </ListItemIcon>
                          <ListItemText 
                            primary={subItem.text}
                            primaryTypographyProps={{ fontSize: '0.85rem' }}
                          />
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
              </React.Fragment>
            );
          }

          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => handleNavigation(item.path!)}
                sx={{
                  borderRadius: '8px',
                  backgroundColor: isActive(item.path!) 
                    ? 'rgba(255,255,255,0.2)' 
                    : 'transparent',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.1)',
                  },
                }}
              >
                <ListItemIcon sx={{ color: 'white', minWidth: 36 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text}
                  primaryTypographyProps={{ fontSize: '0.95rem' }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
      
      <Box sx={{ mt: 'auto', p: 2 }}>
        <Divider sx={{ backgroundColor: 'rgba(255,255,255,0.1)', mb: 2 }} />
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1.5,
          p: 1.5,
          borderRadius: '8px',
          backgroundColor: 'rgba(255,255,255,0.1)',
        }}>
          <Avatar 
            sx={{ 
              width: 40, 
              height: 40,
              bgcolor: 'primary.main',
            }}
          >
            {user?.name?.charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="body2" fontWeight="bold" color="white">
              {user?.name}
            </Typography>
            <Typography variant="caption" color="rgba(255,255,255,0.7)">
              {user?.role.replace('_', ' ').toUpperCase()}
            </Typography>
          </Box>
        </Box>
      </Box>
    </>
  );

  return (
    <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            background: 'linear-gradient(195deg, #1A2038 0%, #1A202C 100%)',
            color: 'white',
            borderRight: 'none',
          },
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
          <IconButton onClick={onMobileToggle} sx={{ color: 'white' }}>
            <ChevronLeft />
          </IconButton>
        </Box>
        {drawerContent}
      </Drawer>

      {/* Desktop drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            background: 'linear-gradient(195deg, #1A2038 0%, #1A202C 100%)',
            color: 'white',
            borderRight: 'none',
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
};

export default Sidebar;
