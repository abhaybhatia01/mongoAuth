const jwt = require('jsonwebtoken');
const Session = require("./models/Session");

const secret = process.env.SECRET || "not-a-good-secret-key";


// Middleware to authenticate requests
async function authenticate(req, res, next) {
  try{
      const token = req.headers.authorization;
    
      if (!token) {
        return res.status(401).json({ message: 'No token provided' });
      }

      //verifying token
      const result = jwt.verify(token, secret)
      if (!result) {
        return res.status(401).json({ message: 'Invalid token' });
      }

      //checking if session exists
        const session = await Session.findOne({token:token});
        if (!session) {
          return res.status(401).json({ message: 'Token expired, plese login again' });
        }

        req.sessionData = session;

        next();
    }catch(error){
      res.status(500).json({ message: error.message });
    }
}

module.exports = {
    authenticate,
}

