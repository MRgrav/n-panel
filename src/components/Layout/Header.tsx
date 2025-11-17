import React, { useState } from 'react';
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
} from '@mui/material';
import { AccountCircle, ExitToApp, Menu as MenuIcon } from '@mui/icons-material';
import { logout } from '../../store/slices/authSlice';
import { useAuth } from '../../hooks/useAuth';
import CustomModal from '../customModal';


const drawerWidth = 280;

interface HeaderProps {
  onMobileMenuToggle?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMobileMenuToggle }) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [academicYear, setAcademicYear] = React.useState<string>('2023-2024');
  const [openModal, setOpenModal] = useState(false);  // State for modal visibility

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

  const handleAcademicYearChange = (event: any) => {
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

  // Generate academic years (current year and next 2 years)
  const currentYear = new Date().getFullYear();
  const academicYears = [
    `${currentYear-1}-${currentYear}`,
    `${currentYear}-${currentYear+1}`,
    `${currentYear+1}-${currentYear+2}`,
  ];

  return (
    <>
      <AppBar
        className="bg-gradient-to-br from-gray-700 to-[#04354B]"
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
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

      <CustomModal
        isOpen={openModal}
        onClose={handleCancelLogout}
        showCloseButton={false}
      >
        <Typography variant="h6" sx={{ mb: 2,textAlign:"center" }}>
          Are you sure you want to log out?
        </Typography>
        <Box sx={{ display: 'flex', alignItemsL:"center", justifyContent: 'flex-end', gap: 2 }}>
          <button onClick={handleCancelLogout} className='text-slate-800 shadow-slate-300 rounded-xl p-2 shadow-2xl'>
            Cancel
          </button>
          <button onClick={handleConfirmLogout} className='text-red-700 shadow-red-300 p-2 rounded-xl shadow-xl'>
            Logout
          </button>
        </Box>
      </CustomModal>
    </>
  );
};

export default Header;
