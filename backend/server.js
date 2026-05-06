require('dotenv').config();
if (!process.env.JWT_SECRET) {
  console.error('Missing JWT_SECRET. Set JWT_SECRET in backend/.env or in your environment.');
  process.exit(1);
}
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const taskRoutes = require('./routes/tasks');
const userRoutes = require('./routes/users');
const { sequelize } = require('./models');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 5001;

const startServer = async () => {
  try {
    console.log('🔍 Connecting to database:', process.env.DATABASE_URL ? 'RAILWAY_URL (production)' : 'LOCAL_URL');
    
    await sequelize.authenticate();
    console.log('✅ Database connection authenticated.');

    // Force sync to create/update all tables on startup
    await sequelize.sync({ force: false, alter: true });
    console.log('✅ Database synced - All tables created/updated.');

    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use. Stop the process using it or choose another PORT.`);
      } else {
        console.error('❌ Server error:', error);
      }
    });
  } catch (error) {
    console.error('❌ Unable to start server:', error.message);
    console.error('📋 Full error details:', error);
    process.exit(1);
  }
};

startServer();

app.get('/', (req, res) => {
  res.send('API is running 🚀');
});

// Global error handler for unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Global error handler for uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});