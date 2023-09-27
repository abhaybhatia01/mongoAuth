// Import necessary libraries
require('dotenv').config()
const bcrypt = require('bcrypt')


const express = require('express');
const app = module.exports = express();
const userRoutes = require('./routes/userRoutes')
const mongoose = require('mongoose');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require("helmet");

// Database configuration
const uri = process.env.DB_URL || 'mongodb://localhost:27017/mongoAuth';

// Connect to the database
mongoose.set("strictQuery", false);
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => {
    console.log('MongoDB connected successfully');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });

app.use(express.json());
app.use(express.urlencoded({extended:true}));

// $ and . characters are replaced these prohibited characters with _  from user-supplied input in the following places:
// - req.body
// - req.params
// - req.headers
// - req.query
app.use(
    mongoSanitize({
        replaceWith: '_',
    }),
);

app.use(helmet());


app.get("/check", async(req,res)=>{
  const password= req.query.password;
  const hashedPassword= req.query.hashedPassword;
  const isValid = await bcrypt.compare(password,hashedPassword);
return res.send({isValid:isValid})
})
app.use("/user",userRoutes)

if(require.main === module){
    const PORT = process.env.PORT || 3000; 
    app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`);
    });
}