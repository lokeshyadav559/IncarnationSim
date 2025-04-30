# Oracle Database Simulator

A web-based simulator that demonstrates Oracle database concepts through interactive visualization. This tool helps users understand database incarnations and backup strategies through hands-on learning.

## Features

### Incarnation Simulator
- Interactive visualization of database incarnations with enhanced D3.js graphics
- Real-time simulation of database changes with smooth animations
- Step-by-step guides for common scenarios
- Visual representation of incarnation history with parent-child relationships
- Educational tooltips and comprehensive documentation

### Backup Simulator
- Interactive timeline visualization of backup operations
- Support for various backup types (Full, Incremental, Differential, etc.)
- Backup dependency tracking and validation
- Retention policy management
- Real-time backup status indicators
- Detailed backup information on click

### Common Features
- Responsive design that adapts to different screen sizes
- Interactive elements with hover and click functionality
- Real-time feedback on actions
- Comprehensive documentation
- Educational tooltips

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Project Structure

```
src/
├── components/     # Reusable UI components
│   ├── IncarnationGraph/    # D3.js visualization component
│   ├── BackupTimeline/      # Backup timeline visualization
│   └── ...
├── pages/         # Main application pages
│   ├── Simulator/          # Incarnation simulator
│   ├── BackupSimulator/    # Backup simulator
│   └── ...
├── services/      # API and data services
├── types/         # TypeScript type definitions
├── utils/         # Utility functions
└── assets/        # Static assets
```

## Technologies Used

- React 18
- TypeScript
- Material-UI v5
- D3.js for advanced visualizations
- React Router for navigation

## Graph Component Usage

### Incarnation Graph
```typescript
import { IncarnationGraph } from './components/IncarnationGraph';

// Example usage
<IncarnationGraph incarnations={incarnationData} />
```

The `IncarnationGraph` component accepts an array of `DatabaseIncarnation` objects with the following structure:

```typescript
interface DatabaseIncarnation {
  id: string;
  status: 'ACTIVE' | 'INACTIVE';
  timestamp: string;
  parentId: string | null;
  metadata?: {
    description?: string;
    // Additional metadata fields
  };
}
```

### Backup Timeline
```typescript
import { BackupTimeline } from './components/BackupTimeline';

// Example usage
<BackupTimeline 
  events={backupEvents}
  onEventClick={handleEventClick}
/>
```

The `BackupTimeline` component accepts the following props:

```typescript
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
```

## Contributing

Please read CONTRIBUTING.md for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the LICENSE.md file for details. 