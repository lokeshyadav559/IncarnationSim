import { createTheme } from '@mui/material/styles';

const customPalette = createTheme({
  palette: {
    primary: {
      main: '#124191',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#00ADEF',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#E6F0FA',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#0A2239',
      secondary: '#124191',
      disabled: '#A0A0A0',
    },
    divider: '#F2F2F2',
    error: {
      main: '#D32F2F',
    },
    warning: {
      main: '#FFA000',
    },
    info: {
      main: '#00ADEF',
    },
    success: {
      main: '#388E3C',
    },
  },
});

export default customPalette; 