import React from 'react';
import { Box, Paper, Typography, Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';

interface BackupEvent {
  id: string;
  type: string;
  timestamp: string;
  details?: string;
  expired?: boolean;
  status?: 'in progress' | 'completed';
  parentId?: string | null;
}

interface TimelineProps {
  events: BackupEvent[];
  onEventClick: (event: BackupEvent) => void;
}

const TimelineContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  background: '#f8faff',
  position: 'relative',
  minHeight: '250px',
  overflowX: 'auto',
  overflowY: 'hidden'
}));

const TimelineLine = styled('div')({
  position: 'absolute',
  left: '40px',
  right: '40px',
  top: '50%',
  height: '2px',
  background: '#ccd6f6',
  zIndex: 1
});

const TimelineEvent = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isExpired' && prop !== 'hasParent'
})<{ isExpired?: boolean; hasParent?: boolean }>(({ theme, isExpired, hasParent }) => ({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: theme.spacing(1),
  cursor: 'pointer',
  opacity: isExpired ? 0.4 : 1,
  '&:hover': {
    '& .timeline-icon': {
      transform: 'scale(1.1)',
      boxShadow: '0 0 10px rgba(0,0,0,0.2)'
    }
  },
  '&::before': hasParent ? {
    content: '""',
    position: 'absolute',
    top: '50%',
    left: '-20px',
    width: '20px',
    height: '20px',
    borderLeft: '2px dashed #7986cb',
    borderBottom: '2px dashed #7986cb',
    transform: 'translateY(-50%)'
  } : {}
}));

const TimelineIcon = styled(Box)(({ theme }) => ({
  width: '40px',
  height: '40px',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '20px',
  transition: 'all 0.3s ease',
  zIndex: 2,
  background: 'white',
  border: '2px solid',
  marginBottom: theme.spacing(1)
}));

const TimelineDate = styled(Typography)({
  fontSize: '0.75rem',
  color: '#666',
  textAlign: 'center',
  maxWidth: '100px',
  wordWrap: 'break-word'
});

const getIconColor = (type: string) => {
  switch (type) {
    case 'FULL':
      return '#e91e63';
    case 'INCR_L0':
      return '#2196f3';
    case 'INCR_L1':
      return '#4caf50';
    case 'DIFFERENTIAL':
      return '#ff9800';
    case 'CUMULATIVE':
      return '#9c27b0';
    case 'ARCHIVELOG':
      return '#795548';
    case 'CONTROLFILE':
      return '#607d8b';
    default:
      return '#999';
  }
};

const BackupTimeline: React.FC<TimelineProps> = ({ events, onEventClick }) => {
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return `${date.toLocaleDateString()}\n${date.toLocaleTimeString()}`;
  };

  return (
    <TimelineContainer>
      <TimelineLine />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'center',
          gap: 4,
          position: 'relative',
          padding: '20px 40px',
          minWidth: events.length * 120
        }}
      >
        {events.map((event, index) => {
          const backupType = event.type;
          const iconColor = getIconColor(backupType);
          
          return (
            <TimelineEvent
              key={event.id}
              isExpired={event.expired}
              hasParent={!!event.parentId}
              onClick={() => onEventClick(event)}
            >
              <Tooltip
                title={
                  `${backupType}\n${event.timestamp}\n${event.expired ? '(Expired)' : ''}\n${
                    event.status === 'in progress' ? '(In Progress)' : ''
                  }${event.parentId ? `\nDepends on: ${event.parentId}` : ''}`
                }
                arrow
              >
                <TimelineIcon
                  className="timeline-icon"
                  sx={{
                    borderColor: iconColor,
                    color: iconColor,
                    background: event.status === 'in progress' ? '#f5f5f5' : 'white'
                  }}
                >
                  {event.status === 'in progress' ? (
                    <Box
                      sx={{
                        width: '20px',
                        height: '20px',
                        border: '2px solid',
                        borderColor: `${iconColor} transparent ${iconColor} transparent`,
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                        '@keyframes spin': {
                          '0%': {
                            transform: 'rotate(0deg)',
                          },
                          '100%': {
                            transform: 'rotate(360deg)',
                          },
                        },
                      }}
                    />
                  ) : (
                    BACKUP_TYPES.find(t => t.type === event.type)?.icon || '?'
                  )}
                </TimelineIcon>
              </Tooltip>
              <TimelineDate>
                {formatTimestamp(event.timestamp)}
              </TimelineDate>
            </TimelineEvent>
          );
        })}
      </Box>
    </TimelineContainer>
  );
};

export default BackupTimeline;

const BACKUP_TYPES = [
  { type: 'FULL', label: 'Full Backup', icon: '★' },
  { type: 'INCR_L0', label: 'Incremental L0', icon: '▲' },
  { type: 'INCR_L1', label: 'Incremental L1', icon: '▼' },
  { type: 'DIFFERENTIAL', label: 'Differential', icon: '⬟' },
  { type: 'CUMULATIVE', label: 'Cumulative', icon: '⬢' },
  { type: 'ARCHIVELOG', label: 'Archivelog Backup', icon: '◼' },
  { type: 'CONTROLFILE', label: 'Control File Backup', icon: '⬤' },
]; 