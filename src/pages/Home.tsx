import React from 'react';
import { Box, Typography, Button, Grid, Card, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box>
      <Typography variant="h3" component="h1" gutterBottom>
        Welcome to Oracle Database Incarnation Simulator
      </Typography>
      <Typography variant="h6" paragraph>
        Learn and experiment with Oracle database incarnations through interactive visualization
      </Typography>
      
      <Button
        variant="contained"
        color="primary"
        size="large"
        onClick={() => navigate('/simulator')}
        sx={{ mb: 4 }}
      >
        Start Simulating
      </Button>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom>
                Interactive Learning
              </Typography>
              <Typography>
                Experience hands-on learning with our interactive simulator that demonstrates real-world Oracle database incarnation scenarios.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom>
                Visual Representation
              </Typography>
              <Typography>
                Understand complex database incarnation concepts through intuitive visualizations and step-by-step guides.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom>
                Comprehensive Documentation
              </Typography>
              <Typography>
                Access detailed documentation and tutorials to enhance your understanding of Oracle database incarnations.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Home; 