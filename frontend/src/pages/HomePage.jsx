import React from 'react';
import { Box, Grid, Typography, Avatar, Paper, Card, CardContent } from '@mui/material';

const userData = {
  admin: {
    name: 'Admin User',
    role: 'Admin',
    projects: 10,
    tasks: 45,
    users: 120,
    avatar: '/path-to-avatar/admin.png', // Add path to your avatar image
  },
  manager: {
    name: 'Manager User',
    role: 'Manager',
    projects: 8,
    tasks: 30,
    avatar: '/path-to-avatar/manager.png',
  },
  user: {
    name: 'Regular User',
    role: 'User',
    tasks: 12,
    avatar: '/path-to-avatar/user.png',
  }
};

// This function returns the data based on the role
const getRoleData = (role) => {
  switch (role) {
    case 'admin':
      return userData.admin;
    case 'manager':
      return userData.manager;
    case 'user':
      return userData.user;
    default:
      return {};
  }
};

const Homepage = ({ role }) => {
  const user = getRoleData(role);

  return (
    <Box sx={{ padding: 3 }}>
      <Grid container spacing={3}>
        {/* Greeting and Avatar */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ padding: 2, display: 'flex', alignItems: 'center' }}>
            <Avatar src={user.avatar} sx={{ width: 56, height: 56, marginRight: 2 }} />
            <Typography variant="h6">Hello, {user.name}</Typography>
          </Paper>
        </Grid>

        {/* Role Specific Data */}
        <Grid item xs={12} md={8}>
          <Grid container spacing={3}>
            {role === 'admin' && (
              <>
                <Grid item xs={12} md={4}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6">Projects</Typography>
                      <Typography variant="h4">{user.projects}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6">Tasks</Typography>
                      <Typography variant="h4">{user.tasks}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6">Users</Typography>
                      <Typography variant="h4">{user.users}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </>
            )}

            {role === 'manager' && (
              <>
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6">Projects</Typography>
                      <Typography variant="h4">{user.projects}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6">Tasks</Typography>
                      <Typography variant="h4">{user.tasks}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </>
            )}

            {role === 'user' && (
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">Tasks</Typography>
                    <Typography variant="h4">{user.tasks}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Homepage;
