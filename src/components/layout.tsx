import React, { ReactNode } from 'react';
import Sidebar from '@/components/sidebar';
import { Box, Container } from '@mui/material';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      <Container sx={{ marginLeft: '250px', paddingTop: '30px' }}>
        {children}
      </Container>
    </Box>
  );
};

export default Layout;
