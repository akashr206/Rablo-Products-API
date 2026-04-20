const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectdb = require('./config/db');
const authRoutes= require('./routes/authRoutes');

dotenv.config();

connectdb();
const app = express();

app.use(express.json());

app.use(cors());

// THese are the routes
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
