import React, { useState } from 'react';
import {
    Box,
    Card,
    CardContent,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Paper,
    TextField,
    IconButton,
    Tooltip,
    Chip,
    MenuItem,
    Button
} from '@mui/material';
import {
    Visibility as ViewIcon,
    GetApp as DownloadIcon,
    Refresh as ResendIcon,
    FilterList as FilterIcon
} from '@mui/icons-material';

// Sample data - will be replaced with MongoDB data
const sampleSubmissions = Array.from({ length: 50 }, (_, index) => ({
    id: index + 1,
    date: new Date(2024, 0, 15 - (index % 30)).toLocaleDateString(),
    calculatorType: index % 2 === 0 ? 'Seller Net Sheet' : 'Buyer Calculator',
    contactName: \`Contact \${index + 1}\`,
    email: \`contact\${index + 1}@example.com\`,
    agent: 'Missy Horner',
    status: index % 3 === 0 ? 'Success' : index % 3 === 1 ? 'Pending' : 'Failed',
    pdfUrl: '#',
    webhookStatus: index % 4 === 0 ? 'Sent' : index % 4 === 1 ? 'Failed' : 'Pending'
}));

const statusColors = {
    Success: 'success',
    Pending: 'warning',
    Failed: 'error',
    Sent: 'success'
};

export default function Submissions() {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const filteredSubmissions = sampleSubmissions.filter(submission => {
        const matchesSearch = Object.values(submission).some(
            value => value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );
        const matchesType = filterType === 'all' || submission.calculatorType === filterType;
        return matchesSearch && matchesType;
    });

    const handleViewSubmission = (submission) => {
        // TODO: Implement view submission details
        console.log('View submission:', submission);
    };

    const handleDownloadPDF = (submission) => {
        // TODO: Implement PDF download
        console.log('Download PDF:', submission);
    };

    const handleResendWebhook = (submission) => {
        // TODO: Implement webhook resend
        console.log('Resend webhook:', submission);
    };

    return (
        <Card>
            <CardContent>
                <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={12} md={4}>
                        <TextField
                            fullWidth
                            label="Search Submissions"
                            variant="outlined"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <TextField
                            select
                            fullWidth
                            label="Calculator Type"
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                        >
                            <MenuItem value="all">All Types</MenuItem>
                            <MenuItem value="Seller Net Sheet">Seller Net Sheet</MenuItem>
                            <MenuItem value="Buyer Calculator">Buyer Calculator</MenuItem>
                        </TextField>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Button
                            variant="outlined"
                            startIcon={<FilterIcon />}
                            sx={{ height: '56px' }}
                        >
                            More Filters
                        </Button>
                    </Grid>
                </Grid>

                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Date</TableCell>
                                <TableCell>Calculator</TableCell>
                                <TableCell>Contact</TableCell>
                                <TableCell>Agent</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Webhook</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredSubmissions
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((submission) => (
                                    <TableRow key={submission.id}>
                                        <TableCell>{submission.date}</TableCell>
                                        <TableCell>{submission.calculatorType}</TableCell>
                                        <TableCell>
                                            <Box>
                                                {submission.contactName}
                                                <br />
                                                <small>{submission.email}</small>
                                            </Box>
                                        </TableCell>
                                        <TableCell>{submission.agent}</TableCell>
                                        <TableCell>
                                            <Chip 
                                                label={submission.status}
                                                color={statusColors[submission.status]}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Chip 
                                                label={submission.webhookStatus}
                                                color={statusColors[submission.webhookStatus]}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Tooltip title="View Details">
                                                <IconButton 
                                                    size="small"
                                                    onClick={() => handleViewSubmission(submission)}
                                                >
                                                    <ViewIcon />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Download PDF">
                                                <IconButton 
                                                    size="small"
                                                    onClick={() => handleDownloadPDF(submission)}
                                                >
                                                    <DownloadIcon />
                                                </IconButton>
                                            </Tooltip>
                                            {submission.webhookStatus === 'Failed' && (
                                                <Tooltip title="Resend Webhook">
                                                    <IconButton 
                                                        size="small"
                                                        onClick={() => handleResendWebhook(submission)}
                                                    >
                                                        <ResendIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    component="div"
                    count={filteredSubmissions.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </CardContent>
        </Card>
    );
}
