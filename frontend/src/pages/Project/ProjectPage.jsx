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

const ProjectPage = () => {
  // State for storing projects
  const [projects, setProjects] = useState([]);
  // State for dialog visibility and form fields
  const [openDialog, setOpenDialog] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    status: 'active',
    startDate: '',
    endDate: '',
  });
  const [loading, setLoading] = useState(false);

  // Fetch projects data
  useEffect(() => {
    const fetchProjects = async () => {
      const apiCall = axios.get(`${CONFIG.BASE_URL}/projects`,
        {
          headers: {
            Authorization: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3NGRkYTYwMzE0MjgwY2Y0MGM5Yjk0NyIsImlhdCI6MTczMzI0NzE1OCwiZXhwIjoxNzMzMzMzNTU4fQ.HzoSMrjhHrCuOnfXjbTSDJnYlxtcU5OYBKOwE4qd6Xc"
          }
        });
      toast.promise(
        apiCall,
        {
          pending: 'Fetching Products...',
          success: 'Products fetched successfully!',
          error: {
            render({ data }) {
              // When the promise reject, data will contains the error
              console.log(data?.response?.data?.message);

              return `${data?.response?.data?.message || "Error Fetching Products"}`
            }
          }
        }
      );
      try {
        const response = await apiCall;
        console.log('API Response:', response.data);
        if (response.data.success) {
          setProjects(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, []);

  // Handle input change in the form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProject((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle project creation
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await axios.post('/api/projects', newProject);
      if (response.data.success) {
        setProjects((prevProjects) => [...prevProjects, response.data.data]);
        setOpenDialog(false); // Close the dialog after submission
        setNewProject({
          name: '',
          description: '',
          status: 'active',
          startDate: '',
          endDate: '',
        }); // Reset the form
      }
    } catch (error) {
      console.error("Error adding project:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle project deletion
  const handleDeleteProject = async (projectId) => {
    try {
      const response = await axios.delete(`/api/projects/${projectId}`);
      if (response.data.success) {
        setProjects((prevProjects) => prevProjects.filter(project => project._id !== projectId));
      }
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Projects
      </Typography>

      <Grid container spacing={2} justifyContent="flex-end">
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => setOpenDialog(true)} // Open the dialog to add a new project
          >
            Add Project
          </Button>
        </Grid>
      </Grid>

      <TableContainer component={Paper} sx={{ marginTop: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell>End Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {projects.map((project) => (
              <TableRow key={project._id}>
                <TableCell>{project.name}</TableCell>
                <TableCell>{project.description}</TableCell>
                <TableCell>{project.status}</TableCell>
                <TableCell>{new Date(project.startDate).toLocaleDateString()}</TableCell>
                <TableCell>{new Date(project.endDate).toLocaleDateString()}</TableCell>
                <TableCell>
                  <IconButton
                    color="secondary"
                    onClick={() => handleDeleteProject(project._id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog to add new project */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Add New Project</DialogTitle>
        <DialogContent>
          <TextField
            label="Project Name"
            name="name"
            value={newProject.name}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Description"
            name="description"
            value={newProject.description}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            multiline
            rows={4}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Status</InputLabel>
            <Select
              name="status"
              value={newProject.status}
              onChange={handleInputChange}
              label="Status"
            >
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Start Date"
            name="startDate"
            type="date"
            value={newProject.startDate}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            label="End Date"
            name="endDate"
            type="date"
            value={newProject.endDate}
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
            {loading ? <CircularProgress size={24} /> : 'Add Project'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ProjectPage;
