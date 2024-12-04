import express from 'express'
import connectDB from './config/db.js'
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js';
import roleRoutes from './routes/roleRoutes.js';
import taskRoutes from './routes/taskRoutes.js'
import authRoutes from './routes/authRoutes.js'
import projectRoutes from './routes/projectRoutes.js'
import cors from 'cors'
import cookieParser from 'cookie-parser';
dotenv.config();
const allowedOrigin = ['https://project-management-app-nikhil-pundir.vercel.app','http://localhost:5173'];
const corsOptions = {
    origin: allowedOrigin,   // Allow the frontend origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Allowed HTTP methods
    credentials: true,       // Allow sending credentials (cookies, authorization headers)
  };
connectDB();
const app = express()
const port = process.env.PORT || 3000
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use('/api/v1/users', userRoutes);
app.use('/api/v1/roles', roleRoutes);
app.use('/api/v1/tasks', taskRoutes);
app.use('/api/v1/auth',  authRoutes);
app.use('/api/v1/projects',  projectRoutes);

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})