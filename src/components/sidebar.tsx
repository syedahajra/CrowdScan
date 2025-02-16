'use client'; // Make sure the component is treated as a client component
import React from 'react';
import { Box, List, ListItem, ListItemText, Divider } from '@mui/material';
import { useRouter } from 'next/navigation'; // Use `next/navigation` instead of `next/router`
import DashboardIcon from '@mui/icons-material/Dashboard';
import SearchIcon from '@mui/icons-material/Search';
import DatabaseIcon from '@mui/icons-material/Storage';
import RecentActorsIcon from '@mui/icons-material/History';

// Define the menu items
const menuItems = [
  { label: 'Dashboard', path: '/', icon: <DashboardIcon /> },
  { label: 'Search', path: '/', icon: <SearchIcon /> },
  { label: 'Database', path: '/', icon: <DatabaseIcon /> },
  { label: 'Recent', path: '/', icon: <RecentActorsIcon /> },
];

const Sidebar = () => {
  const router = useRouter(); // Initialize the router

  // Handle navigation
  const handleNavigation = (path: string) => {
    router.push(path);  // Programmatically navigate to the page
  };

  return (
    <Box
      sx={{
        width: 250,
        height: '100vh',
        bgcolor: '#f4f4f4',
        boxShadow: 2,
        position: 'fixed',
        top: 0,
        left: 0,
        paddingTop: 2,
      }}
    >
      <List>
        {/* Map over menuItems to dynamically create list items */}
        {menuItems.map((item, index) => (
          <React.Fragment key={index}>
            {index !== 0 && <Divider />}  {/* Add divider except before the first item */}
            <ListItem onClick={() => handleNavigation(item.path)} >
              {item.icon}
              <ListItemText primary={item.label} sx={{ marginLeft: 2 }} />
            </ListItem>
          </React.Fragment>
        ))}
      </List>
    </Box>
  );
};

export default Sidebar;
