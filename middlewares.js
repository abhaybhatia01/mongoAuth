const jwt = require('jsonwebtoken');
const Session = require("./models/Session");

const secret = process.env.SECRET || "no-a-good-secret-key";


// Middleware to authenticate requests
function authenticate(req, res, next) {
    const token = req.headers.authorization;
  
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    //verifying token
    jwt.verify(token, secret,async (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Invalid token' });
      }

      //checking if session exists
      const session = await Session.findOne({token:token});
      if (!session) {
        return res.status(404).json({ message: 'Token expired' });
      }

      req.sessionData = session;
      next();

    });
}

module.exports = {
    authenticate,
}

