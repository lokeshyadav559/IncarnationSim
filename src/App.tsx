import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, Container } from '@mui/material';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Simulator from './pages/Simulator';
import Documentation from './pages/Documentation';
import customPalette from './theme/palette';
import { Analytics } from '@vercel/analytics/react';

function App() {
  return (
    <ThemeProvider theme={customPalette}>
      <CssBaseline />
      <Analytics />
      <Router>
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navigation />
          <Container component="main" sx={{ mt: 4, mb: 4, flex: 1 }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/simulator" element={<Simulator />} />
              <Route path="/documentation" element={<Documentation />} />
            </Routes>
          </Container>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App; 