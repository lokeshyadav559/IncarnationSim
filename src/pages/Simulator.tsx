import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useMediaQuery,
} from '@mui/material';
import { AddCircle, Replay, SaveAlt } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import IncarnationGraph from '../components/IncarnationGraph';
import RecoveryPanel from '../components/RecoveryPanel';
import { DatabaseIncarnation } from '../types/database';

const Simulator: React.FC = () => {
  const [incarnations, setIncarnations] = useState<DatabaseIncarnation[]>([]);
  const [selectedIncarnation, setSelectedIncarnation] = useState<string>('');
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'));

  const handleCreateIncarnation = (withResetlogs: boolean = false) => {
    const newIncarnation: DatabaseIncarnation = {
      id: `INC_${incarnations.length + 1}`,
      timestamp: new Date().toISOString(),
      status: 'ACTIVE',
      parentId: selectedIncarnation || null,
      metadata: {
        description: withResetlogs ? 'Created with RESETLOGS' : 'Normal incarnation',
        controlFile: {
          exists: true,
          timestamp: new Date().toISOString(),
          resetlogs: withResetlogs,
        },
        archiveLogs: [
          {
            sequence: 1,
            firstChange: 1,
            nextChange: 1000,
            status: 'APPLIED',
          },
        ],
        datafiles: [
          {
            name: 'system01.dbf',
            status: 'ONLINE',
            checkpointChange: 1,
          },
        ],
        redoLogs: [
          {
            group: 1,
            status: 'CURRENT',
            sequence: 1,
            firstChange: 1,
            nextChange: 1000
          },
        ],
      },
    };
    setIncarnations([...incarnations, newIncarnation]);
    setSelectedIncarnation(newIncarnation.id);
  };

  const handleRevertIncarnation = () => {
    if (selectedIncarnation) {
      setIncarnations(incarnations.map(inc => ({
        ...inc,
        status: inc.id === selectedIncarnation ? 'ACTIVE' : 'INACTIVE'
      })));
    }
  };

  const handleRecoveryComplete = (newIncarnation: DatabaseIncarnation) => {
    setIncarnations([...incarnations, newIncarnation]);
    setSelectedIncarnation(newIncarnation.id);
  };

  const currentIncarnation = incarnations.find(inc => inc.id === selectedIncarnation);

  return (
    <Box sx={{ p: { xs: 1, md: 3 }, background: '#f7f9fb', minHeight: '100vh' }}>
      <Typography
        variant="h3"
        align="center"
        sx={{ fontWeight: 700, mb: 4, letterSpacing: 1 }}
        gutterBottom
      >
        Oracle Database Incarnation Simulator
      </Typography>
      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12} md={8}>
          <Card elevation={4} sx={{ mb: { xs: 2, md: 0 } }}>
            <CardHeader
              title={<Typography variant="h6">Incarnation Graph</Typography>}
              sx={{ pb: 0, background: '#f0f4f8' }}
            />
            <CardContent>
              <Box sx={{ minHeight: 350, height: { xs: 300, md: 400 } }}>
                <IncarnationGraph incarnations={incarnations} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Box
            sx={{
              position: isMdUp ? 'sticky' : 'static',
              top: isMdUp ? theme.spacing(3) : 'auto',
              zIndex: 2,
            }}
          >
            <Card elevation={4} sx={{ mb: 3 }}>
              <CardHeader
                title={<Typography variant="h6">Incarnation Management</Typography>}
                sx={{ background: '#f0f4f8', pb: 0 }}
              />
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<AddCircle />}
                      onClick={() => handleCreateIncarnation(false)}
                      fullWidth
                      sx={{ mb: 1 }}
                    >
                      Create New Incarnation
                    </Button>
                    <Button
                      variant="outlined"
                      color="secondary"
                      startIcon={<SaveAlt />}
                      onClick={() => handleCreateIncarnation(true)}
                      fullWidth
                      sx={{ mb: 2 }}
                    >
                      Create with RESETLOGS
                    </Button>
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel>Select Incarnation</InputLabel>
                      <Select
                        value={selectedIncarnation}
                        onChange={(e) => setSelectedIncarnation(e.target.value)}
                        label="Select Incarnation"
                        size="small"
                      >
                        {incarnations.map((inc) => (
                          <MenuItem
                            key={inc.id}
                            value={inc.id}
                            sx={{
                              fontWeight: inc.status === 'ACTIVE' ? 700 : 400,
                              color: inc.status === 'ACTIVE' ? theme.palette.primary.main : 'inherit',
                            }}
                          >
                            {inc.id} - {new Date(inc.timestamp).toLocaleString()}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  {selectedIncarnation && (
                    <Grid item xs={12}>
                      <Button
                        variant="outlined"
                        color="primary"
                        startIcon={<Replay />}
                        onClick={handleRevertIncarnation}
                        fullWidth
                      >
                        Revert to Selected Incarnation
                      </Button>
                    </Grid>
                  )}
                </Grid>
              </CardContent>
            </Card>
            {currentIncarnation && (
              <RecoveryPanel
                currentIncarnation={currentIncarnation}
                onRecoveryComplete={handleRecoveryComplete}
              />
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Simulator; 