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
    Select,
    MenuItem,
    InputLabel,
    CircularProgress,
    FormControl,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';
import { toast } from 'react-toastify';
import CONFIG from '../../config/config';

const UserPage = () => {
    // State for storing users data
    const [users, setUsers] = useState([]);
    // State for storing available roles
    const [roles, setRoles] = useState([]);
    // State for dialog visibility and form fields
    const [openDialog, setOpenDialog] = useState(false);
    const [newUser, setNewUser] = useState({
        name: '',
        email: '',
        password: '',
        role: '', // role will be set from the dropdown
    });
    const [loading, setLoading] = useState(false);
    const fetchUsers = async () => {
        const apiCall = axios.get(`${CONFIG.BASE_URL}/users`, {
            withCredentials: true,
          });
        toast.promise(
            apiCall,
            {
                pending: 'Fetching Users...',
                success: 'Users fetched successfully!',
                error: {
                    render({ data }) {
                        // When the promise reject, data will contains the error
                        console.log(data?.response?.data?.message);
                        return `${data?.response?.data?.message || "Error Fetching Users"}`;
                    }
                }
            }
        );
        try {
            const response = await apiCall;
            console.log('API Response:', response.data);
            if (response.data.success) {
                setUsers(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };
    // Fetch users data from the API
    useEffect(() => {
       

        // Fetch roles from the API (if not already available)
        const fetchRoles = async () => {
            const apiCall = axios.get(`${CONFIG.BASE_URL}/roles`, {
                withCredentials: true,
              });
            try {
                const response = await apiCall;
                if (response.data.success) {
                    setRoles(response.data.data); // Set roles in state
                }
            } catch (error) {
                console.error("Error fetching roles:", error);
            }
        };

        fetchUsers();
        fetchRoles();
    }, []);

    // Handle input change in the form
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewUser((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Handle user creation
    const handleSubmit = async () => {
        setLoading(true);
        // try {
        const apiCall = axios.post(`${CONFIG.BASE_URL}/users/register`, newUser, {
            withCredentials: true,
          });

        toast.promise(
            apiCall,
            {
                pending: 'Creating User...',
                success: 'Users Created successfully!',
                error: {
                    render({ data }) {
                        // When the promise reject, data will contains the error
                        console.log(data?.response?.data?.message);
                        return `${data?.response?.data?.message || "Error Creating Users"}`;
                    }
                }
            }
        );
        try {
            const response = await apiCall;
            console.log('API Response:', response.data);
            if (response.data.success) {

                fetchUsers();
                setOpenDialog(false); // Close the dialog after submission
                setNewUser({
                    name: '',
                    email: '',
                    password: '',
                    role: '', // Reset role after submission
                }); // Reset the form

            }
        } catch (error) {
            console.error("Error adding user:", error);
        } finally {
            setLoading(false);
        }
        // } catch (error) {
        //     console.error("Error adding user:", error);
        // } finally {
        //     setLoading(false);
        // }
    };

    // Handle user deletion
    const handleDeleteUser = async (userId) => {
        try {
            const response = await axios.delete(`/api/users/${userId}`);
            if (response.data.success) {
                setUsers((prevUsers) => prevUsers.filter(user => user._id !== userId));
            }
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Users
            </Typography>

            <Grid container spacing={2} justifyContent="flex-end">
                <Grid item>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={() => setOpenDialog(true)} // Open the dialog to add a new user
                    >
                        Add User
                    </Button>
                </Grid>
            </Grid>

            <TableContainer component={Paper} sx={{ marginTop: 3 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Role</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user._id}>
                                <TableCell>{user.name}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.role?.name}</TableCell>
                                <TableCell>
                                    <IconButton
                                        color="secondary"
                                        onClick={() => handleDeleteUser(user._id)}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Dialog to add new user */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>Add New User</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Name"
                        name="name"
                        value={newUser.name}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Email"
                        name="email"
                        value={newUser.email}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Password"
                        name="password"
                        type="password"
                        value={newUser.password}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                    />

                    {/* Role Selection */}
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Role</InputLabel>
                        <Select
                            label="Role"
                            name="role"
                            value={newUser.role}
                            onChange={handleInputChange}
                        >
                            {roles.map((role) => (
                                <MenuItem key={role._id} value={role._id}>
                                    {role.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
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
                        {loading ? <CircularProgress size={24} /> : 'Add User'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default UserPage;
