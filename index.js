// Import necessary libraries
require('dotenv').config()

const express = require('express');
const app = express();
const userRoutes = require('./routes/userRoutes')
const mongoose = require('mongoose');

// Database configuration
const uri = process.env.DB_URL || 'mongodb://localhost:27017/mongoAuth';

// Connect to the database
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => {
    console.log('MongoDB connected successfully');
    const PORT = process.env.PORT || 3000; 
    app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });


app.use(express.json());
app.use(express.urlencoded());

app.use("/user",userRoutes)




module.exports = app;