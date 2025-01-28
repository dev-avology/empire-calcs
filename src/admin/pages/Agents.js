import React, { useState } from 'react';
import {
    Grid,
    Card,
    CardContent,
    CardMedia,
    Typography,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    IconButton,
    Avatar,
    Box,
    Switch,
    FormControlLabel,
    Fab
} from '@mui/material';
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    Add as AddIcon,
    PhotoCamera as PhotoIcon
} from '@mui/icons-material';

// Sample data - will be replaced with MongoDB data
const sampleAgents = [
    {
        id: 1,
        name: 'Missy Horner',
        email: 'missy@empiretitle.com',
        phone: '614-600-6833',
        title: 'Director of Business Development',
        photoUrl: '/images/missy.horner.jpg',
        active: true,
        submissions: 25
    }
];

export default function Agents() {
    const [agents, setAgents] = useState(sampleAgents);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedAgent, setSelectedAgent] = useState(null);
    const [newPhoto, setNewPhoto] = useState(null);

    const handlePhotoChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            setNewPhoto(URL.createObjectURL(event.target.files[0]));
        }
    };

    const handleEdit = (agent) => {
        setSelectedAgent(agent);
        setNewPhoto(null);
        setOpenDialog(true);
    };

    const handleAdd = () => {
        setSelectedAgent(null);
        setNewPhoto(null);
        setOpenDialog(true);
    };

    const handleDelete = (agentId) => {
        setAgents(agents.filter(agent => agent.id !== agentId));
    };

    const handleSave = () => {
        // TODO: Implement save to MongoDB
        setOpenDialog(false);
    };

    return (
        <>
            <Grid container spacing={3}>
                {agents.map((agent) => (
                    <Grid item xs={12} md={4} key={agent.id}>
                        <Card>
                            <CardMedia
                                component="img"
                                height="200"
                                image={agent.photoUrl}
                                alt={agent.name}
                                sx={{ objectFit: 'cover' }}
                            />
                            <CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <Typography variant="h6" component="div">
                                        {agent.name}
                                    </Typography>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={agent.active}
                                                onChange={() => {
                                                    const updatedAgents = agents.map(a =>
                                                        a.id === agent.id ? { ...a, active: !a.active } : a
                                                    );
                                                    setAgents(updatedAgents);
                                                }}
                                            />
                                        }
                                        label="Active"
                                    />
                                </Box>
                                <Typography variant="body2" color="text.secondary">
                                    {agent.title}
                                </Typography>
                                <Typography variant="body2" sx={{ mt: 1 }}>
                                    {agent.email}
                                </Typography>
                                <Typography variant="body2">
                                    {agent.phone}
                                </Typography>
                                <Typography variant="body2" sx={{ mt: 1 }}>
                                    Submissions: {agent.submissions}
                                </Typography>
                                <Box sx={{ mt: 2 }}>
                                    <Button
                                        startIcon={<EditIcon />}
                                        onClick={() => handleEdit(agent)}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        startIcon={<DeleteIcon />}
                                        color="error"
                                        onClick={() => handleDelete(agent.id)}
                                    >
                                        Delete
                                    </Button>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Add Agent FAB */}
            <Fab
                color="primary"
                sx={{ position: 'fixed', bottom: 16, right: 16 }}
                onClick={handleAdd}
            >
                <AddIcon />
            </Fab>

            {/* Add/Edit Dialog */}
            <Dialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    {selectedAgent ? 'Edit Agent' : 'Add New Agent'}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                            <Box sx={{ position: 'relative' }}>
                                <Avatar
                                    src={newPhoto || (selectedAgent?.photoUrl || '')}
                                    sx={{ width: 100, height: 100 }}
                                />
                                <input
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    id="photo-upload"
                                    type="file"
                                    onChange={handlePhotoChange}
                                />
                                <label htmlFor="photo-upload">
                                    <IconButton
                                        component="span"
                                        sx={{
                                            position: 'absolute',
                                            bottom: -10,
                                            right: -10,
                                            backgroundColor: 'primary.main',
                                            color: 'white',
                                            '&:hover': {
                                                backgroundColor: 'primary.dark',
                                            },
                                        }}
                                    >
                                        <PhotoIcon />
                                    </IconButton>
                                </label>
                            </Box>
                        </Box>
                        <TextField
                            label="Name"
                            fullWidth
                            defaultValue={selectedAgent?.name || ''}
                        />
                        <TextField
                            label="Email"
                            fullWidth
                            type="email"
                            defaultValue={selectedAgent?.email || ''}
                        />
                        <TextField
                            label="Phone"
                            fullWidth
                            defaultValue={selectedAgent?.phone || ''}
                        />
                        <TextField
                            label="Title"
                            fullWidth
                            defaultValue={selectedAgent?.title || ''}
                        />
                        <FormControlLabel
                            control={
                                <Switch
                                    defaultChecked={selectedAgent?.active ?? true}
                                />
                            }
                            label="Active"
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button onClick={handleSave} variant="contained">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
