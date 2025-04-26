import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Tabs,
  Tab,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Grid,
  Divider
} from '@mui/material';
import { RecoveryService } from '../services/recoveryService';
import { RecoveryOptions, RecoveryType, DatabaseIncarnation } from '../types/database';

interface RecoveryPanelProps {
  currentIncarnation: DatabaseIncarnation;
  onRecoveryComplete: (newIncarnation: DatabaseIncarnation) => void;
}

const RecoveryPanel: React.FC<RecoveryPanelProps> = ({ currentIncarnation, onRecoveryComplete }) => {
  const [selectedTab, setSelectedTab] = useState<RecoveryType>('COMPLETE');
  const [targetTime, setTargetTime] = useState<string>('');
  const [targetSCN, setTargetSCN] = useState<string>('');
  const [resetlogs, setResetlogs] = useState<boolean>(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [isRecovering, setIsRecovering] = useState<boolean>(false);

  const recoveryService = RecoveryService.getInstance();

  const handleTabChange = (event: React.SyntheticEvent, newValue: RecoveryType) => {
    setSelectedTab(newValue);
    setMessage(null);
  };

  const handleRecovery = async () => {
    setIsRecovering(true);
    setMessage(null);

    try {
      const options: RecoveryOptions = {
        type: selectedTab,
        resetlogs,
      };

      if (selectedTab === 'PITR' || selectedTab === 'INCOMPLETE' || selectedTab === 'FLASHBACK') {
        if (targetTime) {
          options.targetTime = targetTime;
        }
        if (targetSCN) {
          options.targetSCN = parseInt(targetSCN, 10);
        }
      }

      recoveryService.setCurrentIncarnation(currentIncarnation);
      const result = await recoveryService.performRecovery(options);

      if (result.success && result.newIncarnation) {
        setMessage({ type: 'success', text: result.message });
        onRecoveryComplete(result.newIncarnation);
      } else {
        setMessage({ type: 'error', text: result.message });
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error?.message || 'Unknown error occurred' });
    } finally {
      setIsRecovering(false);
    }
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Database Recovery
      </Typography>
      <Divider sx={{ mb: 2 }} />

      <Box sx={{ display: 'flex', justifyContent: { xs: 'flex-start', sm: 'center' } }}>
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          sx={{ mb: 2, maxWidth: { xs: '100%', sm: 600 } }}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
        >
          <Tab label="Complete Recovery" value="COMPLETE" />
          <Tab label="Incomplete Recovery" value="INCOMPLETE" />
          <Tab label="Point-in-Time Recovery" value="PITR" />
          <Tab label="Flashback Recovery" value="FLASHBACK" />
        </Tabs>
      </Box>

      <Grid container spacing={2}>
        {(selectedTab === 'PITR' || selectedTab === 'INCOMPLETE' || selectedTab === 'FLASHBACK') && (
          <>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Target Time"
                type="datetime-local"
                value={targetTime}
                onChange={(e) => setTargetTime(e.target.value)}
                InputLabelProps={{ shrink: true }}
                helperText="Optional: Specify a target time for recovery."
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Target SCN"
                value={targetSCN}
                onChange={(e) => setTargetSCN(e.target.value)}
                type="number"
                helperText="Optional: Specify a target SCN for recovery."
              />
            </Grid>
          </>
        )}

        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Reset Logs</InputLabel>
            <Select
              value={resetlogs ? 'true' : 'false'}
              onChange={(e) => setResetlogs(e.target.value === 'true')}
              label="Reset Logs"
            >
              <MenuItem value="true">Yes</MenuItem>
              <MenuItem value="false">No</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {message && (
          <Grid item xs={12}>
            <Alert severity={message.type}>
              {message.text}
            </Alert>
          </Grid>
        )}

        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleRecovery}
            disabled={isRecovering}
            fullWidth
          >
            {isRecovering ? 'Recovering...' : 'Perform Recovery'}
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default RecoveryPanel; 