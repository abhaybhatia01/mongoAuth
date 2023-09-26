
const jwt = require('jsonwebtoken');
const secret = process.env.SECRET || "no-a-good-secret-key";

function generateToken(payload) {

    return jwt.sign(payload, secret, { expiresIn :'24h'});
  }
  
function refreshToken(oldToken ) {
    jwt.verify(oldToken, secret, (err, decoded) => {
        if (err) {
            return { isValid: false,message: 'Invalid refresh token'}
        }
        // Generate a new session token with extended expiration
        const token = generateToken({ userId: decoded.userId });
        return { isValid: true ,token:token};
      });
  }

function verifyEmail(email){
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!email){
        return { isValid: false, message: "email missing"}
    }
    if (!emailRegex.test(email)) {
        return { isValid: false, message: "Invalid email"}
    }
    return { isValid: true}
}

function VerifyPassword(password){
    if(!password){
        return { isValid: false, message: "password missing"}
    }
    // Password should have a minimum length of 8 characters
    if ( password.length < 8) {
        return { isValid: false, message: "Password should have a minimum length of 8 characters" };
    }
    // Password should contain at least one uppercase letter, one lowercase letter, and one digit
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;
    if (!passwordRegex.test(password)) {
        return {isValid: false, message: "Password should contain at least one uppercase letter, one lowercase letter, and one digit" };
    }

    return { isValid: true}
}

module.exports={
    generateToken,
    refreshToken,
    verifyEmail,
    VerifyPassword,
}
