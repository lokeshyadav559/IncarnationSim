import React from 'react';
import { Box, Typography, Button, Grid, Card, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box>
      <Typography variant="h3" component="h1" gutterBottom>
        Welcome to Oracle Database Simulator
      </Typography>
      <Typography variant="h6" paragraph>
        Learn and experiment with Oracle database incarnations and backup strategies through interactive visualization
      </Typography>
      
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => navigate('/simulator')}
          >
            Incarnation Simulator
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            onClick={() => navigate('/backup-simulator')}
          >
            Backup Simulator
          </Button>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom>
                Incarnation Simulator
              </Typography>
              <Typography>
                Visualize and understand Oracle database incarnations through interactive graphs and real-time scenarios.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom>
                Backup Simulator
              </Typography>
              <Typography>
                Explore different backup strategies with an interactive timeline. Click icons to view details.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom>
                Interactive Learning
              </Typography>
              <Typography>
                Hover and click elements to discover more. Get real-time feedback on your actions.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Home; 