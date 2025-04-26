# Oracle Database Incarnation Simulator

A web-based simulator that demonstrates the fundamental process of Oracle database incarnation. This tool helps users understand how Oracle tracks and manages database versions through interactive visualization and simulation.

## Features

- Interactive visualization of database incarnations with enhanced D3.js graphics
- Real-time simulation of database changes with smooth animations
- Step-by-step guides for common scenarios
- Visual representation of incarnation history with parent-child relationships
- Educational tooltips and comprehensive documentation
- Responsive design that adapts to different screen sizes

### Visualization Features

- **Interactive Graph**
  - Dynamic node visualization with active/inactive state indicators
  - Smooth animations for state transitions
  - Hover effects with detailed information tooltips
  - Clear visual hierarchy with color-coded nodes and connections

- **Time-based Layout**
  - Chronological arrangement of incarnations
  - Formatted timestamps with precise time display
  - Grid lines for better temporal reference
  - Rotated axis labels for better readability

- **Node Details**
  - Color-coded status indicators (Active: Green, Inactive: Grey)
  - Drop shadow effects for depth perception
  - Smooth hover transitions
  - Clear parent-child relationship indicators

- **Tooltips**
  - Detailed information on hover
  - Smooth transitions and positioning
  - Status-specific styling
  - Comprehensive metadata display

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
│   └── ...
├── pages/         # Main application pages
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

## Contributing

Please read CONTRIBUTING.md for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the LICENSE.md file for details. 