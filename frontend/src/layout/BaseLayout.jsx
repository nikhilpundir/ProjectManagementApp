import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import { Box, Drawer, CssBaseline, AppBar as MuiAppBar, Toolbar, List, Typography, Divider, IconButton, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { Menu as MenuIcon, ChevronLeft as ChevronLeftIcon, ChevronRight as ChevronRightIcon, Home as HomeIcon, Work as WorkIcon, CheckCircle as CheckCircleIcon, People as PeopleIcon, Login as LoginIcon, Logout as LogoutIcon } from '@mui/icons-material';
import { Outlet, useNavigate } from 'react-router';

const drawerWidth = 240;

// Styled Main component
const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: open ? 0 : `-${drawerWidth}px`,
  })
);

// Styled AppBar component
const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

// Styled DrawerHeader component
const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

export default function PersistentDrawerLeft({ userRole, isLoggedIn=true, onLogout }) {
  const theme = useTheme();
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);

  // Define the navigation list with role-based visibility
  const navigationList = [
    {
      id: 'Home',
      label: 'Home',
      path: 'home',
      icon: <HomeIcon />,
      roles: ['admin', 'manager', 'user'], // All roles can access
    },
    {
      id: 'Projects',
      label: 'Projects',
      path: 'projects',
      icon: <WorkIcon />,
      roles: ['admin', 'manager'], // Only admin and manager roles
    },
    {
      id: 'Tasks',
      label: 'Tasks',
      path: 'tasks',
      icon: <CheckCircleIcon />,
      roles: ['admin', 'manager', 'user'], // All roles can access
    },
    {
      id: 'Users',
      label: 'Users',
      path: 'users',
      icon: <PeopleIcon />,
      roles: ['admin'], // Only admin role
    },
    // Add Login/Logout items
    {
      id: 'Login',
      label: 'Login',
      path: 'login',
      icon: <LoginIcon />,
      roles: ['guest'], // Visible to guest (not logged-in) users
      condition: !isLoggedIn, // Only show Login if the user is not logged in
    },
    {
      id: 'Logout',
      label: 'Logout',
      path: 'logout',
      icon: <LogoutIcon />,
      roles: ['admin', 'manager', 'user'], // Visible to logged-in users
      condition: isLoggedIn, // Only show Logout if the user is logged in
    }
  ];

  // Filter navigation items based on the user's role and login state
  const filteredNavigationList = navigationList.filter(
    (item) => item.roles.includes(userRole) && (item.condition === undefined || item.condition)
  );

  const handleLogout = () => {
    // Call the logout function to clear authentication state (e.g., remove tokens, clear user data, etc.)
    onLogout();
    // Optionally, navigate to a login page or home page
    navigate('/login');
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      {/* AppBar */}
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: 'none' }) }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Project Management App
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {filteredNavigationList.map((item) => (
            <ListItem key={item.id} disablePadding>
              <ListItemButton
                onClick={() => {
                  if (item.id === 'Logout') {
                    handleLogout(); // Handle logout logic
                  } else {
                    navigate(item.path); // Navigate for all other items
                  }
                }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* Main Content */}
      <Main open={open}>
        <DrawerHeader />
        <Outlet />
      </Main>
    </Box>
  );
}
