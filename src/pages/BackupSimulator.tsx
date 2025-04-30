import React, { useState } from 'react';
import { Box, Typography, Grid, Card, CardContent, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Divider, Tooltip, Slider, Alert, CircularProgress, Snackbar, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';

// Define backup types and event interface
const BACKUP_TYPES = [
  { type: 'FULL', label: 'Full Backup', icon: '★' },
  { type: 'INCR_L0', label: 'Incremental L0', icon: '▲' },
  { type: 'INCR_L1', label: 'Incremental L1', icon: '▼' },
  { type: 'DIFFERENTIAL', label: 'Differential', icon: '⬟' },
  { type: 'CUMULATIVE', label: 'Cumulative', icon: '⬢' },
  { type: 'ARCHIVELOG', label: 'Archivelog Backup', icon: '◼' },
  { type: 'CONTROLFILE', label: 'Control File Backup', icon: '⬤' },
];

interface BackupEvent {
  id: string;
  type: string;
  timestamp: string;
  details?: string;
  expired?: boolean;
  status?: 'in progress' | 'completed';
  parentId?: string | null;
}

const BackupSimulator: React.FC = () => {
  const [backupEvents, setBackupEvents] = useState<BackupEvent[]>([]);
  const [retention, setRetention] = useState<number>(5);
  const [retentionAlert, setRetentionAlert] = useState<string | null>(null);
  const [isBackingUp, setIsBackingUp] = useState<boolean>(false);
  const [dependencyWarning, setDependencyWarning] = useState<string | null>(null);
  const [selectedBackup, setSelectedBackup] = useState<BackupEvent | null>(null);
  const [detailsOpen, setDetailsOpen] = useState<boolean>(false);

  // Find the latest Level 0 backup that is not expired
  const getLatestLevel0 = () => {
    return [...backupEvents].reverse().find(e => e.type === 'INCR_L0' && !e.expired && e.status === 'completed');
  };

  // Find the latest completed incremental backup (L0 or L1) that is not expired
  const getLatestIncremental = () => {
    return [...backupEvents].reverse().find(e => (e.type === 'INCR_L0' || e.type === 'INCR_L1') && !e.expired && e.status === 'completed');
  };

  const handleBackup = (type: string) => {
    // Dependency checks for incremental backups
    if (type === 'INCR_L1') {
      const latestL0 = getLatestLevel0();
      if (!latestL0) {
        setDependencyWarning('Cannot perform Incremental Level 1 backup: No completed Level 0 backup found.');
        return;
      }
    }
    if (type === 'INCR_L0' || type === 'INCR_L1') {
      // For L1, parent is latest L0 or L1; for L0, parent is null
      const parent = type === 'INCR_L1' ? getLatestIncremental() : null;
      createBackup(type, parent?.id || null);
    } else {
      createBackup(type, null);
    }
  };

  const createBackup = (type: string, parentId: string | null) => {
    setIsBackingUp(true);
    const backupType = BACKUP_TYPES.find(t => t.type === type);
    const now = new Date();
    const newEvent: BackupEvent = {
      id: `${type}_${now.getTime()}`,
      type,
      timestamp: now.toLocaleString(),
      details: backupType?.label || type,
      expired: false,
      status: 'in progress',
      parentId,
    };
    let newEvents = [...backupEvents, newEvent];
    // Apply retention policy
    if (newEvents.length > retention) {
      const numToExpire = newEvents.length - retention;
      newEvents = newEvents.map((event, idx) =>
        idx < numToExpire ? { ...event, expired: true } : { ...event, expired: false }
      );
      setRetentionAlert(`${numToExpire} backup(s) expired due to retention policy.`);
      setTimeout(() => setRetentionAlert(null), 4000);
    } else {
      newEvents = newEvents.map(event => ({ ...event, expired: false }));
    }
    setBackupEvents(newEvents);
    // Simulate backup duration
    setTimeout(() => {
      setBackupEvents(currentEvents =>
        currentEvents.map(event =>
          event.id === newEvent.id ? { ...event, status: 'completed' } : event
        )
      );
      setIsBackingUp(false);
    }, 2000);
  };

  const handleRetentionChange = (event: Event, value: number | number[]) => {
    const newRetention = Array.isArray(value) ? value[0] : value;
    setRetention(newRetention);
    // Re-apply retention policy
    let newEvents = [...backupEvents];
    if (newEvents.length > newRetention) {
      const numToExpire = newEvents.length - newRetention;
      newEvents = newEvents.map((event, idx) =>
        idx < numToExpire ? { ...event, expired: true } : { ...event, expired: false }
      );
      setRetentionAlert(`${numToExpire} backup(s) expired due to retention policy.`);
      setTimeout(() => setRetentionAlert(null), 4000);
    } else {
      newEvents = newEvents.map(event => ({ ...event, expired: false }));
    }
    setBackupEvents(newEvents);
  };

  const handleIconClick = (event: BackupEvent) => {
    setSelectedBackup(event);
    setDetailsOpen(true);
  };

  const handleDetailsClose = () => {
    setDetailsOpen(false);
    setSelectedBackup(null);
  };

  return (
    <Box sx={{ p: { xs: 1, md: 3 }, background: '#f7f9fb', minHeight: '100vh' }}>
      <Typography variant="h3" align="center" sx={{ fontWeight: 700, mb: 4, letterSpacing: 1 }} gutterBottom>
        Backup Simulator
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card elevation={4} sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Backup Timeline / Graph</Typography>
              <Box sx={{ minHeight: 200, background: '#e6f0fa', borderRadius: 2, mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                {backupEvents.length === 0 ? (
                  <Typography variant="body2" color="textSecondary">[No backups yet]</Typography>
                ) : (
                  backupEvents.slice(-10).map((event) => {
                    const backupType = BACKUP_TYPES.find(t => t.type === event.type);
                    return (
                      <Tooltip key={event.id} title={`${backupType?.label || event.type}: ${event.timestamp}${event.expired ? ' (Expired)' : ''}${event.parentId ? `\nDepends on: ${event.parentId}` : ''}`} arrow>
                        <span
                          style={{ fontSize: 32, margin: '0 8px', opacity: event.expired ? 0.3 : 1, textDecoration: event.expired ? 'line-through' : 'none', position: 'relative', display: 'inline-block', cursor: 'pointer' }}
                          onClick={() => handleIconClick(event)}
                        >
                          {event.status === 'in progress' ? (
                            <CircularProgress size={32} sx={{ position: 'absolute', top: 0, left: 0, zIndex: 1 }} />
                          ) : null}
                          <span style={{ visibility: event.status === 'in progress' ? 'hidden' : 'visible' }}>{backupType?.icon || '?'}</span>
                        </span>
                      </Tooltip>
                    );
                  })
                )}
              </Box>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>Backup Actions</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
                {BACKUP_TYPES.map((bt) => (
                  <Button key={bt.type} variant="contained" onClick={() => handleBackup(bt.type)} disabled={isBackingUp}>{bt.label}</Button>
                ))}
              </Box>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>Retention Policy</Typography>
              <Box sx={{ width: 300, mb: 2 }}>
                <Slider
                  value={retention}
                  min={1}
                  max={20}
                  step={1}
                  marks
                  valueLabelDisplay="auto"
                  onChange={handleRetentionChange}
                  aria-labelledby="retention-slider"
                />
                <Typography variant="body2">Retain last <strong>{retention}</strong> backups</Typography>
              </Box>
              {retentionAlert && <Alert severity="info" sx={{ mb: 2 }}>{retentionAlert}</Alert>}
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>Backup History</Typography>
              <TableContainer component={Paper}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Type</TableCell>
                      <TableCell>Time</TableCell>
                      <TableCell>Details</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Depends On</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {backupEvents.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} align="center">No backups performed yet.</TableCell>
                      </TableRow>
                    ) : (
                      backupEvents.slice().reverse().map((event) => {
                        const backupType = BACKUP_TYPES.find(t => t.type === event.type);
                        return (
                          <TableRow key={event.id} sx={{ opacity: event.expired ? 0.4 : 1 }}>
                            <TableCell>{backupType?.icon} {backupType?.label || event.type}</TableCell>
                            <TableCell>{event.timestamp}</TableCell>
                            <TableCell>{event.details}</TableCell>
                            <TableCell>{event.expired ? 'Expired' : (event.status === 'in progress' ? 'In Progress' : 'Active')}</TableCell>
                            <TableCell>{event.parentId ? event.parentId : '-'}</TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              <Snackbar
                open={!!dependencyWarning}
                autoHideDuration={4000}
                onClose={() => setDependencyWarning(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                message={dependencyWarning}
              />
              <Dialog open={detailsOpen} onClose={handleDetailsClose}>
                <DialogTitle>Backup Details</DialogTitle>
                <DialogContent>
                  {selectedBackup && (
                    <DialogContentText>
                      <strong>Type:</strong> {BACKUP_TYPES.find(t => t.type === selectedBackup.type)?.label || selectedBackup.type}<br />
                      <strong>Time:</strong> {selectedBackup.timestamp}<br />
                      <strong>Status:</strong> {selectedBackup.expired ? 'Expired' : (selectedBackup.status === 'in progress' ? 'In Progress' : 'Active')}<br />
                      <strong>Depends On:</strong> {selectedBackup.parentId ? selectedBackup.parentId : 'None'}<br />
                      <strong>ID:</strong> {selectedBackup.id}<br />
                    </DialogContentText>
                  )}
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleDetailsClose}>Close</Button>
                </DialogActions>
              </Dialog>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card elevation={4}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Educational Info</Typography>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="body2" paragraph>
                <strong>Full Backup:</strong> Backs up all datafiles.
              </Typography>
              <Typography variant="body2" paragraph>
                <strong>Incremental Backup:</strong> Level 0 is a baseline full backup. Level 1 backs up changes since the last Level 0 or Level 1.
              </Typography>
              <Typography variant="body2" paragraph>
                <strong>Differential vs Cumulative:</strong> Differential backs up changes since the last backup of the same level. Cumulative backs up changes since the last Level 0.
              </Typography>
              <Typography variant="body2" paragraph>
                <strong>Archivelog Backup:</strong> Backs up archived redo logs.
              </Typography>
              <Typography variant="body2" paragraph>
                <strong>Control File Backup:</strong> Backs up the control file.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default BackupSimulator; 