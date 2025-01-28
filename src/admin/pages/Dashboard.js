import React from 'react';
import { 
    Grid, 
    Paper, 
    Typography, 
    Card, 
    CardContent,
    CardHeader
} from '@mui/material';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';

// Sample data - will be replaced with real data from MongoDB
const sampleData = [
    { date: '2024-01-10', submissions: 4 },
    { date: '2024-01-11', submissions: 7 },
    { date: '2024-01-12', submissions: 5 },
    { date: '2024-01-13', submissions: 8 },
    { date: '2024-01-14', submissions: 6 },
    { date: '2024-01-15', submissions: 9 }
];

export default function Dashboard() {
    return (
        <Grid container spacing={3}>
            {/* Summary Cards */}
            <Grid item xs={12} md={4}>
                <Paper elevation={2} sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                        Total Submissions
                    </Typography>
                    <Typography variant="h3">
                        39
                    </Typography>
                </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
                <Paper elevation={2} sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                        Active Calculators
                    </Typography>
                    <Typography variant="h3">
                        2
                    </Typography>
                </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
                <Paper elevation={2} sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                        Active Agents
                    </Typography>
                    <Typography variant="h3">
                        1
                    </Typography>
                </Paper>
            </Grid>

            {/* Charts */}
            <Grid item xs={12}>
                <Card>
                    <CardHeader title="Submissions Over Time" />
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart
                                data={sampleData}
                                margin={{
                                    top: 5,
                                    right: 30,
                                    left: 20,
                                    bottom: 5,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="submissions"
                                    stroke="#8884d8"
                                    activeDot={{ r: 8 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </Grid>

            {/* Recent Activity */}
            <Grid item xs={12}>
                <Card>
                    <CardHeader title="Recent Activity" />
                    <CardContent>
                        <Typography variant="body2" color="text.secondary">
                            Activity feed will be displayed here
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
}
