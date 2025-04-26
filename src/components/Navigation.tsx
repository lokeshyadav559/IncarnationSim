import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const Navigation: React.FC = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Oracle Incarnation Simulator
        </Typography>
        <Box>
          <Button
            color="inherit"
            component={RouterLink}
            to="/"
          >
            Home
          </Button>
          <Button
            color="inherit"
            component={RouterLink}
            to="/simulator"
          >
            Simulator
          </Button>
          <Button
            color="inherit"
            component={RouterLink}
            to="/documentation"
          >
            Documentation
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navigation; 