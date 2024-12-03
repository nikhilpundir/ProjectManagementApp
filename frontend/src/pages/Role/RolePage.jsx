import React, { useState, useEffect } from 'react';
import {
    Container,
    Button,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    IconButton,
    Typography,
    TableContainer,
    Paper,
    Grid,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    MenuItem,
    InputLabel,
    Select,
    FormControl,
    CircularProgress,
    Checkbox,
    FormControlLabel,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';
import { toast } from 'react-toastify';
import CONFIG from '../../config/config';

const RolePage = () => {
    // State for storing roles
    const [roles, setRoles] = useState([]);
    // State for dialog visibility and form fields
    const [openDialog, setOpenDialog] = useState(false);
    const [newRole, setNewRole] = useState({
        name: '',
        permissions: [], // permissions will be an array of objects containing resource and actions
    });
    const [loading, setLoading] = useState(false);

    // Fetch roles data from the API
    useEffect(() => {
        const fetchRoles = async () => {
            const apiCall = axios.get(`${CONFIG.BASE_URL}/roles`,{
                withCredentials: true,
              });
            
            toast.promise(
                apiCall,
                {
                    pending: 'Fetching Roles...',
                    success: 'Roles fetched successfully!',
                    error: {
                        render({ data }) {
                            console.log(data?.response?.data?.message);
                            return `${data?.response?.data?.message || "Error Fetching Roles"}`;
                        },
                    },
                }
            );

            try {
                const response = await apiCall;
                console.log('API Response:', response.data);
                if (response.data.success) {
                    setRoles(response.data.data);
                }
            } catch (error) {
                console.error("Error fetching roles:", error);
            }
        };

        fetchRoles();
    }, []);

    // Handle input change in the form
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewRole((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Handle permission change
    const handlePermissionChange = (e) => {
        const { value } = e.target;
        // Create permission objects with empty actions array for selected resources
        const updatedPermissions = value.map((resource) => ({
            resource,
            actions: [],
        }));
        setNewRole((prev) => ({
            ...prev,
            permissions: updatedPermissions,
        }));
    };

    // Handle action checkbox change for a specific resource
    const handleActionChange = (resource, action) => {
        setNewRole((prev) => {
            const updatedPermissions = prev.permissions.map((perm) => {
                if (perm.resource === resource) {
                    const actions = perm.actions.includes(action)
                        ? perm.actions.filter((a) => a !== action)
                        : [...perm.actions, action];
                    return { ...perm, actions };
                }
                return perm;
            });

            return { ...prev, permissions: updatedPermissions };
        });
    };

    // Handle role creation
    const handleSubmit = async () => {
        setLoading(true);
        try {
            const response = await axios.post('/api/roles', newRole);
            if (response.data.success) {
                setRoles((prevRoles) => [...prevRoles, response.data.data]);
                setOpenDialog(false); // Close the dialog after submission
                setNewRole({
                    name: '',
                    permissions: [],
                }); // Reset the form
            }
        } catch (error) {
            console.error("Error adding role:", error);
        } finally {
            setLoading(false);
        }
    };

    // Handle role deletion
    const handleDeleteRole = async (roleId) => {
        try {
            const response = await axios.delete(`/api/roles/${roleId}`);
            if (response.data.success) {
                setRoles((prevRoles) => prevRoles.filter((role) => role._id !== roleId));
            }
        } catch (error) {
            console.error("Error deleting role:", error);
        }
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Roles
            </Typography>

            <Grid container spacing={2} justifyContent="flex-end">
                <Grid item>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={() => setOpenDialog(true)} // Open the dialog to add a new role
                    >
                        Add Role
                    </Button>
                </Grid>
            </Grid>

            <TableContainer component={Paper} sx={{ marginTop: 3 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Permissions</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {roles.map((role) => (
                            <TableRow key={role._id}>
                                <TableCell>{role.name}</TableCell>
                                <TableCell>
                                    {role.permissions.map((perm, idx) => (
                                        <div key={idx}>
                                            {`${perm.resource}: ${perm.actions.join(', ')}`}
                                        </div>
                                    ))}
                                </TableCell>
                                <TableCell>
                                    <IconButton
                                        color="secondary"
                                        onClick={() => handleDeleteRole(role._id)}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Dialog to add new role */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>Add New Role</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Role Name"
                        name="name"
                        value={newRole.name}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                    />
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Permissions</InputLabel>
                        <Select
                            multiple
                            name="permissions"
                            value={newRole.permissions.map((perm) => perm.resource)}
                            onChange={handlePermissionChange}
                            label="Permissions"
                        >
                            <MenuItem value="USER">USER</MenuItem>
                            <MenuItem value="TASK">TASK</MenuItem>
                            <MenuItem value="PROJECT">PROJECT</MenuItem>
                            <MenuItem value="ROLE">ROLE</MenuItem>
                        </Select>
                    </FormControl>

                    {/* Display permissions and actions */}
                    {newRole.permissions.map((perm) => (
                        <div key={perm.resource}>
                            <Typography variant="body1">{perm.resource}</Typography>
                            <FormControl component="fieldset">
                                <FormControlLabel
                                    control={<Checkbox
                                        checked={perm.actions.includes("CREATE")}
                                        onChange={() => handleActionChange(perm.resource, "CREATE")}
                                    />}
                                    label="Create"
                                />
                                <FormControlLabel
                                    control={<Checkbox
                                        checked={perm.actions.includes("READ")}
                                        onChange={() => handleActionChange(perm.resource, "READ")}
                                    />}
                                    label="Read"
                                />
                                <FormControlLabel
                                    control={<Checkbox
                                        checked={perm.actions.includes("UPDATE")}
                                        onChange={() => handleActionChange(perm.resource, "UPDATE")}
                                    />}
                                    label="Update"
                                />
                                <FormControlLabel
                                    control={<Checkbox
                                        checked={perm.actions.includes("DELETE")}
                                        onChange={() => handleActionChange(perm.resource, "DELETE")}
                                    />}
                                    label="Delete"
                                />
                            </FormControl>
                        </div>
                    ))}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)} color="primary">
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        color="primary"
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Add Role'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default RolePage;
