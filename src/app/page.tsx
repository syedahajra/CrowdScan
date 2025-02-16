'use client'; // Ensures client-side rendering

import UploadComponent from '@/components/upload';
import * as React from 'react';
import Layout from '@/components/layout';
import { Typography } from '@mui/material';

const Home = () => {
  return (
    <Layout>
      <Typography variant="h4">Welcome to Crowd Scan</Typography>
      <UploadComponent />
    </Layout>
  );
};

export default Home;
