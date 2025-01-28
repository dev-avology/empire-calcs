import React, { useState } from 'react';
import {
    Grid,
    Card,
    CardContent,
    CardHeader,
    CardActions,
    Button,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    IconButton,
    Menu,
    MenuItem,
    Fab
} from '@mui/material';
import {
    Add as AddIcon,
    MoreVert as MoreVertIcon,
    Edit as EditIcon,
    FileCopy as CloneIcon,
    Delete as DeleteIcon
} from '@mui/icons-material';

// Sample data - will be replaced with MongoDB data
const sampleCalculators = [
    {
        id: 1,
        name: 'Seller Net Sheet',
        type: 'seller',
        description: 'Calculate seller\'s net proceeds',
        lastModified: '2024-01-15',
        submissions: 25
    },
    {
        id: 2,
        name: 'Buyer Calculator',
        type: 'buyer',
        description: 'Estimate buyer\'s closing costs',
        lastModified: '2024-01-14',
        submissions: 14
    }
];

export default function Calculators() {
    const [calculators, setCalculators] = useState(sampleCalculators);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedCalculator, setSelectedCalculator] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);

    const handleMenuClick = (event, calculator) => {
        setAnchorEl(event.currentTarget);
        setSelectedCalculator(calculator);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedCalculator(null);
    };

    const handleEdit = () => {
        handleMenuClose();
        setOpenDialog(true);
    };

    const handleClone = () => {
        if (selectedCalculator) {
            const newCalculator = {
                ...selectedCalculator,
                id: calculators.length + 1,
                name: \`\${selectedCalculator.name} (Copy)\`,
                lastModified: new Date().toISOString().split('T')[0],
                submissions: 0
            };
            setCalculators([...calculators, newCalculator]);
        }
        handleMenuClose();
    };

    const handleDelete = () => {
        if (selectedCalculator) {
            setCalculators(calculators.filter(calc => calc.id !== selectedCalculator.id));
        }
        handleMenuClose();
    };

    return (
        <>
            <Grid container spacing={3}>
                {calculators.map((calculator) => (
                    <Grid item xs={12} md={6} key={calculator.id}>
                        <Card>
                            <CardHeader
                                action={
                                    <IconButton 
                                        onClick={(e) => handleMenuClick(e, calculator)}
                                    >
                                        <MoreVertIcon />
                                    </IconButton>
                                }
                                title={calculator.name}
                                subheader={`Last modified: ${calculator.lastModified}`}
                            />
                            <CardContent>
                                <Typography variant="body2" color="text.secondary">
                                    {calculator.description}
                                </Typography>
                                <Typography variant="body2" sx={{ mt: 1 }}>
                                    Submissions: {calculator.submissions}
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button 
                                    size="small" 
                                    startIcon={<EditIcon />}
                                    onClick={() => {
                                        setSelectedCalculator(calculator);
                                        setOpenDialog(true);
                                    }}
                                >
                                    Edit
                                </Button>
                                <Button 
                                    size="small"
                                    startIcon={<CloneIcon />}
                                    onClick={() => handleClone()}
                                >
                                    Clone
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Add Calculator FAB */}
            <Fab 
                color="primary" 
                sx={{ position: 'fixed', bottom: 16, right: 16 }}
                onClick={() => {
                    setSelectedCalculator(null);
                    setOpenDialog(true);
                }}
            >
                <AddIcon />
            </Fab>

            {/* Calculator Menu */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                <MenuItem onClick={handleEdit}>
                    <EditIcon sx={{ mr: 1 }} /> Edit
                </MenuItem>
                <MenuItem onClick={handleClone}>
                    <CloneIcon sx={{ mr: 1 }} /> Clone
                </MenuItem>
                <MenuItem onClick={handleDelete}>
                    <DeleteIcon sx={{ mr: 1 }} /> Delete
                </MenuItem>
            </Menu>

            {/* Edit Dialog */}
            <Dialog 
                open={openDialog} 
                onClose={() => setOpenDialog(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    {selectedCalculator ? 'Edit Calculator' : 'New Calculator'}
                </DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Calculator Name"
                        fullWidth
                        variant="outlined"
                        defaultValue={selectedCalculator?.name || ''}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        margin="dense"
                        label="Description"
                        fullWidth
                        multiline
                        rows={3}
                        variant="outlined"
                        defaultValue={selectedCalculator?.description || ''}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button onClick={() => setOpenDialog(false)} variant="contained">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
