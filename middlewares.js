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

    try {
      const result = jwt.verify(token, secret);
      if (!result) {
        return res.status(401).json({ message: 'Invalid token' });
      }

      const session = await Session.findOne({ token: token });
        if (!session) {
        return res.status(401).json({ message: 'Token expired, please login again' });
        }

        req.sessionData = session;

        next();
    } catch (error) {
      return res.status(401).json({ message: 'Invalid token' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = {
    authenticate,
}

