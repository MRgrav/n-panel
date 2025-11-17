import React, { useState } from 'react';
import { Box, Toolbar, useTheme, useMediaQuery } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const drawerWidth = 280;

const Layout: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleMobileToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      minHeight: '100vh', 
      bgcolor: '#f8fafc',
      backgroundImage: 'radial-gradient(at 4% 10%, rgba(239, 246, 255, 0.5) 0px, transparent 50%), radial-gradient(at 100% 80%, rgba(226, 232, 240, 0.5) 0px, transparent 50%)',
    }}>
      <Sidebar mobileOpen={mobileOpen} onMobileToggle={handleMobileToggle} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Header onMobileMenuToggle={handleMobileToggle} />
        <Toolbar />
        <Box sx={{ 
          p: { xs: 2, sm: 3 },
          minHeight: 'calc(100vh - 64px)',
        }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;