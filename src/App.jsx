// src/App.jsx
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { InventoryProvider } from './context/InventoryContext'; // Note: We might replace or supplement this with Zustand later as per the guide
import { QueryClient, QueryClientProvider } from 'react-query';
import DashboardLayout from './components/layout/DashboardLayout'; // We will create this component soon
import AppRoutes from './routes/AppRoutes'; // We will create this component soon

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <InventoryProvider>
          <Router>
            <DashboardLayout>
              <AppRoutes />
            </DashboardLayout>
          </Router>
        </InventoryProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;