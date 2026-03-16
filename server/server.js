const connectDB = require('./config/db');
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);

app.get('/', (req, res) => {
  return res.send('API running');
});

const authRoutes = require('./routes/authRoutes');
const caseRoutes = require('./routes/caseRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/cases', caseRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.use((req, res) => {
  return res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));