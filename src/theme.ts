import { createTheme } from '@mui/material';
import { alpha } from '@mui/material/styles';

export const getTheme = (mode: 'light' | 'dark') =>
  createTheme({
    palette: {
      mode,
      primary: { main: '#ff5c8d' },
      secondary: { main: '#7c4dff' },
      background: {
        default: mode === 'light' ? '#fdfdfd' : '#121212',
        paper: mode === 'light' ? '#fff' : alpha('#1e1e1e', 0.9),
      },
    },
    typography: {
      fontFamily: 'Inter, "Noto Sans JP", sans-serif',
    },
    shape: { borderRadius: 12 },
  });
