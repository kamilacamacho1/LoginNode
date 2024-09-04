require('dotenv').config();
const express = require('express');
const connectDB = require('./src/config/database');
const userRoutes = require('./src/routes/userRoutes');
const authRoutes = require('./src/routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);

app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));