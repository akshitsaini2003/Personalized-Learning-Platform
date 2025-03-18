require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const quizRoutes = require('./routes/quizRoutes');
const profileRoutes = require('./routes/profileRoutes');
const leaderboardRoutes = require('./routes/leaderboardRoutes');
const adminleaderboardRoutes = require('./routes/adminLeaderboardRoutes');
const topicRoutes = require('./routes/topicRoutes');
const threadRoutes = require('./routes/threadRoutes'); // Discussion Forum
const replyRoutes = require('./routes/replyRoutes'); // Discussion Forum
const liveClassRoutes = require('./routes/liveClassRoutes'); // Live Classes
const userRoutes = require('./routes/userRoutes'); 
const chatRoutes = require('./routes/chatRoutes'); 


const app = express();

// CORS middleware use kare
app.use(cors({
  origin: 'http://localhost:3000', // Sirf frontend URL se requests allow kare
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
  credentials: true, // Cookies aur authentication headers allow kare
}));

// Middlewares
app.use(express.json()); // JSON body parser
app.use(express.urlencoded({ extended: true })); // URL-encoded body parser

// Database connection
const MONGO_URI = process.env.MONGO_URI; // .env se MongoDB URL le rahe hain

mongoose.connect(MONGO_URI, {
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Error connecting to MongoDB:', err));

// Routes
app.use('/api', authRoutes); // Auth routes (signup, login)
app.use('/api', dashboardRoutes); // Dashboard routes
app.use('/api', profileRoutes); // Profile routes
app.use('/api', quizRoutes); // Quiz routes
app.use('/api', leaderboardRoutes); // Leaderboard routes
app.use('/api', topicRoutes); // Topic routes
app.use('/api', threadRoutes); // Discussion forum threads routes
app.use('/api', replyRoutes); // Discussion forum replies routes
app.use('/api', liveClassRoutes); // Live classes routes
app.use('/api',userRoutes)
app.use('/api',adminleaderboardRoutes)
app.use('/api',chatRoutes)


// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// 404 route handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found!' });
});

module.exports = app;