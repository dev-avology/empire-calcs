import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import AdminRoutes from './admin/AdminRoutes';

// Create theme
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

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Router>
                <Routes>
                    {/* Admin routes */}
                    <Route path="/admin/*" element={<AdminRoutes />} />
                    
                    {/* Public calculator routes will go here */}
                    <Route path="/" element={<div>Home Page</div>} />
                </Routes>
            </Router>
        </ThemeProvider>
    );
}

export default App;
