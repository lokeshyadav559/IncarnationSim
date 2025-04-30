import React from 'react';
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  Alert,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const Documentation: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Oracle Database 19c Documentation
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        This simulator demonstrates Oracle Database 19c concepts and scenarios through two interactive tools:
        the Incarnation Simulator and the Backup Simulator.
      </Alert>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>About the Simulators</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography paragraph>
            The Oracle Database Simulator provides two interactive learning tools:
          </Typography>
          <List>
            <ListItem>
              <ListItemText
                primary="Incarnation Simulator"
                secondary="Learn about database incarnations, RESETLOGS operations, and recovery scenarios through interactive visualization"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Backup Simulator"
                secondary="Explore different backup strategies, understand backup dependencies, and learn about retention policies"
              />
            </ListItem>
          </List>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>What is a Database Incarnation?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography paragraph>
            In Oracle Database 19c, a database incarnation represents a specific version of a database
            that is created when you perform a point-in-time recovery or reset the database using
            RESETLOGS. Each incarnation has its own unique incarnation number and SCN (System Change Number)
            range.
          </Typography>
          <Typography paragraph>
            Key characteristics of database incarnations:
          </Typography>
          <List>
            <ListItem>
              <ListItemText
                primary="Incarnation Number"
                secondary="A unique identifier assigned to each incarnation of the database"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="SCN Range"
                secondary="Each incarnation has its own range of SCNs, starting from 1"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Control File"
                secondary="The control file tracks the current incarnation and its parent"
              />
            </ListItem>
          </List>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Backup Types and Strategies</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography paragraph>
            Oracle Database supports various backup types, each serving different purposes:
          </Typography>
          <List>
            <ListItem>
              <ListItemText
                primary="Full Backup"
                secondary="A complete backup of all datafiles in the database"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Incremental Backup"
                secondary="Level 0: Baseline full backup. Level 1: Changes since last Level 0 or Level 1"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Differential vs Cumulative"
                secondary="Differential: Changes since last backup. Cumulative: Changes since last Level 0"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Archivelog Backup"
                secondary="Backup of archived redo logs for point-in-time recovery"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Control File Backup"
                secondary="Backup of the database control file"
              />
            </ListItem>
          </List>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Using the Simulators</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List>
            <ListItem>
              <ListItemText
                primary="Incarnation Simulator"
                secondary="Create new incarnations, perform RESETLOGS operations, and explore recovery scenarios"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Backup Simulator"
                secondary="Create different types of backups, manage retention policies, and understand backup dependencies"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Interactive Features"
                secondary="Hover over elements for tooltips, click for detailed information, and get real-time feedback"
              />
            </ListItem>
          </List>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Common Scenarios</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List>
            <ListItem>
              <ListItemText
                primary="Normal Incarnation Creation"
                secondary="Creating a new incarnation without RESETLOGS. The new incarnation inherits the archive logs and control file information from its parent."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="RESETLOGS Operation"
                secondary="When you perform a RESETLOGS operation, Oracle creates a new incarnation and resets the log sequence numbers. Archive logs from previous incarnations become unavailable."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Point-in-Time Recovery"
                secondary="Recovering the database to a specific point in time creates a new incarnation. The control file is updated to reflect the new incarnation information."
              />
            </ListItem>
          </List>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Control File and Archive Logs</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography paragraph>
            The control file plays a crucial role in managing database incarnations:
          </Typography>
          <List>
            <ListItem>
              <ListItemText
                primary="Control File Contents"
                secondary="Stores incarnation information, including the current incarnation number, parent incarnation, and SCN ranges"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Archive Log Management"
                secondary="Archive logs are associated with specific incarnations. After a RESETLOGS operation, archive logs from previous incarnations become unavailable for recovery"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Datafile Checkpoints"
                secondary="Each datafile maintains checkpoint information that is tied to the current incarnation"
              />
            </ListItem>
          </List>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Best Practices</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List>
            <ListItem>
              <ListItemText
                primary="Backup Strategy"
                secondary="Always maintain backups before creating new incarnations. Consider using RMAN for comprehensive backup and recovery management"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Documentation"
                secondary="Keep detailed records of when and why incarnations were created, including the SCN ranges and parent-child relationships"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Testing"
                secondary="Regularly test recovery procedures to ensure they work as expected. Use the simulator to practice different scenarios"
              />
            </ListItem>
          </List>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Using the Simulator</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List>
            <ListItem>
              <ListItemText
                primary="Creating a New Incarnation"
                secondary="Click the 'Create New Incarnation' button to create a normal incarnation or 'Create with RESETLOGS' to simulate a RESETLOGS operation"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Viewing Details"
                secondary="Use the 'Details' tab to view information about the control file, archive logs, and datafiles for each incarnation"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Reverting to Previous Incarnation"
                secondary="Select an existing incarnation and click 'Revert to Selected' to make that incarnation active"
              />
            </ListItem>
          </List>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default Documentation; 