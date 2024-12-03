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
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';
import { toast } from 'react-toastify';
import CONFIG from '../../config/config';

const TaskPage = () => {
    // State for storing tasks
    const [tasks, setTasks] = useState([]);
    // State for dialog visibility and form fields
    const [openDialog, setOpenDialog] = useState(false);
    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        assignedTo: '',
        status: 'Pending',
        dueDate: '',
    });
    const [loading, setLoading] = useState(false);

    // Fetch tasks data from the API
    useEffect(() => {
        const fetchTasks = async () => {

            const apiCall = axios.get(`${CONFIG.BASE_URL}/tasks`,
                {
                    headers: {
                        Authorization: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3NGRkYTYwMzE0MjgwY2Y0MGM5Yjk0NyIsImlhdCI6MTczMzI0NzE1OCwiZXhwIjoxNzMzMzMzNTU4fQ.HzoSMrjhHrCuOnfXjbTSDJnYlxtcU5OYBKOwE4qd6Xc"
                    }
                }); // Adjust the API URL as needed
                toast.promise(
                    apiCall,
                    {
                        pending: 'Fetching Tasks...',
                        success: 'Tasks fetched successfully!',
                        error: {
                            render({ data }) {
                                // When the promise reject, data will contains the error
                                console.log(data?.response?.data?.message);
    
                                return `${data?.response?.data?.message || "Error Fetching Tasks"}`
                            }
                        }
                    }
                );

            try {
                const response = await apiCall;
                console.log('API Response:', response.data);
                if (response.data.success) {
                    setTasks(response.data.data);
                }
            } catch (error) {
                console.error("Error fetching tasks:", error);
            }
        };

        fetchTasks();
    }, []);

    // Handle input change in the form
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewTask((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Handle task creation
    const handleSubmit = async () => {
        setLoading(true);
        try {
            const response = await axios.post('/api/tasks', newTask);
            if (response.data.success) {
                setTasks((prevTasks) => [...prevTasks, response.data.data]);
                setOpenDialog(false); // Close the dialog after submission
                setNewTask({
                    title: '',
                    description: '',
                    assignedTo: '',
                    status: 'Pending',
                    dueDate: '',
                }); // Reset the form
            }
        } catch (error) {
            console.error("Error adding task:", error);
        } finally {
            setLoading(false);
        }
    };

    // Handle task deletion
    const handleDeleteTask = async (taskId) => {
        try {
            const response = await axios.delete(`/api/tasks/${taskId}`);
            if (response.data.success) {
                setTasks((prevTasks) => prevTasks.filter(task => task._id !== taskId));
            }
        } catch (error) {
            console.error("Error deleting task:", error);
        }
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Tasks
            </Typography>

            <Grid container spacing={2} justifyContent="flex-end">
                <Grid item>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={() => setOpenDialog(true)} // Open the dialog to add a new task
                    >
                        Add Task
                    </Button>
                </Grid>
            </Grid>

            <TableContainer component={Paper} sx={{ marginTop: 3 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Title</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Assigned To</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Due Date</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {tasks.map((task) => (
                            <TableRow key={task._id}>
                                <TableCell>{task.title}</TableCell>
                                <TableCell>{task.description}</TableCell>
                                <TableCell>{task.assignedTo?.name}</TableCell>
                                <TableCell>{task.status}</TableCell>
                                <TableCell>{new Date(task.dueDate).toLocaleDateString()}</TableCell>
                                <TableCell>
                                    <IconButton
                                        color="secondary"
                                        onClick={() => handleDeleteTask(task._id)}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Dialog to add new task */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>Add New Task</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Task Title"
                        name="title"
                        value={newTask.title}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Description"
                        name="description"
                        value={newTask.description}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                        multiline
                        rows={4}
                    />
                    <TextField
                        label="Assigned To"
                        name="assignedTo"
                        value={newTask.assignedTo}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                    />
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Status</InputLabel>
                        <Select
                            name="status"
                            value={newTask.status}
                            onChange={handleInputChange}
                            label="Status"
                        >
                            <MenuItem value="Pending">Pending</MenuItem>
                            <MenuItem value="In Progress">In Progress</MenuItem>
                            <MenuItem value="Completed">Completed</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField
                        label="Due Date"
                        name="dueDate"
                        type="date"
                        value={newTask.dueDate}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
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
                        {loading ? <CircularProgress size={24} /> : 'Add Task'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default TaskPage;
