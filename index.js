const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/userRoutes');
const restaurantRoutes = require('./routes/restaurantRoutes')
const menuItemRoutes = require('./routes/menuItemRoutes');
const orderRoutes = require('./routes/orders');
const stripeRoutes = require('./routes/stripeRoutes');
const { cloudinary, uploadController } = require('./utils/cloudinary');

const error = require('./middlewares/error');

dotenv.config();

// Server 

const app = express();

// Middlewares 
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb' }));
app.use(cors({
    origin: '*'
}));

// api to upload images 
app.post('/api/upload', uploadController);

app.use('/api', authRoutes);
app.use('/api', stripeRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/user', userRoutes);
app.use('/api/restaurant', restaurantRoutes);
app.use('/api/menuItem', menuItemRoutes);

app.use(error);


//database connection
const dbURI = process.env.MONGODB_URI;
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0';

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => app.listen(PORT, HOST, () => console.log(`server running at port : ${PORT}`)))
    .catch((err) => console.log(err));
