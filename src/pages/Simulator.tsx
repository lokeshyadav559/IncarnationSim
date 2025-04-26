import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Alert,
} from '@mui/material';
import {
  Storage as StorageIcon,
  Description as DescriptionIcon,
  History as HistoryIcon,
  Backup as BackupIcon,
} from '@mui/icons-material';
import IncarnationGraph from '../components/IncarnationGraph';
import { DatabaseIncarnation } from '../types/database';

const Simulator: React.FC = () => {
  const [incarnations, setIncarnations] = useState<DatabaseIncarnation[]>([]);
  const [selectedIncarnation, setSelectedIncarnation] = useState<string>('');
  const [activeTab, setActiveTab] = useState(0);

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

  const renderIncarnationDetails = (incarnation: DatabaseIncarnation) => {
    return (
      <List>
        <ListItem>
          <ListItemIcon>
            <DescriptionIcon />
          </ListItemIcon>
          <ListItemText
            primary="Control File"
            secondary={
              incarnation.metadata.controlFile?.exists
                ? `Exists (Resetlogs: ${incarnation.metadata.controlFile.resetlogs ? 'Yes' : 'No'})`
                : 'Not Created'
            }
          />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <HistoryIcon />
          </ListItemIcon>
          <ListItemText
            primary="Archive Logs"
            secondary={
              incarnation.metadata.archiveLogs?.length
                ? `${incarnation.metadata.archiveLogs.length} logs available`
                : 'No archive logs'
            }
          />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <StorageIcon />
          </ListItemIcon>
          <ListItemText
            primary="Datafiles"
            secondary={
              incarnation.metadata.datafiles?.length
                ? `${incarnation.metadata.datafiles.length} files (${incarnation.metadata.datafiles.filter(f => f.status === 'ONLINE').length} online)`
                : 'No datafiles'
            }
          />
        </ListItem>
      </List>
    );
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Database Incarnation Simulator
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, height: '500px' }}>
            <IncarnationGraph incarnations={incarnations} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
              <Tab label="Actions" />
              <Tab label="Details" />
            </Tabs>

            {activeTab === 0 && (
              <Box sx={{ mt: 2 }}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Select Incarnation</InputLabel>
                  <Select
                    value={selectedIncarnation}
                    onChange={(e) => setSelectedIncarnation(e.target.value)}
                    label="Select Incarnation"
                  >
                    {incarnations.map((inc) => (
                      <MenuItem key={inc.id} value={inc.id}>
                        {inc.id} - {inc.status}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleCreateIncarnation(false)}
                  sx={{ mr: 1, mb: 1 }}
                  fullWidth
                >
                  Create New Incarnation
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => handleCreateIncarnation(true)}
                  sx={{ mr: 1, mb: 1 }}
                  fullWidth
                >
                  Create with RESETLOGS
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleRevertIncarnation}
                  disabled={!selectedIncarnation}
                  fullWidth
                >
                  Revert to Selected
                </Button>

                {selectedIncarnation && (
                  <Alert severity="info" sx={{ mt: 2 }}>
                    Selected incarnation: {selectedIncarnation}
                  </Alert>
                )}
              </Box>
            )}

            {activeTab === 1 && selectedIncarnation && (
              <Box sx={{ mt: 2 }}>
                {renderIncarnationDetails(incarnations.find(inc => inc.id === selectedIncarnation)!)}
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Simulator; 