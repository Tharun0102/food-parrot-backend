const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');

dotenv.config();

// Database Connection 

connectDB();

// Server 

const app = express();

// Middlewares 

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '30mb', extended: 'true' }));


app.use('/api',userRoutes);



app.listen(5000,()=>{
    console.log("Server Connected.");
})