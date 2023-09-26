const bcrypt = require("bcrypt");
const User = require("../models/User");
const Session = require("../models/Session");
const {generateToken ,refreshToken , verifyEmail, VerifyPassword}= require("../helpers")


const registerUser = async (req, res) => {
    try {
        const { email, password, name } = req.body;

        // verify input values
        const emailVerifyResult = verifyEmail(email)
        if(!emailVerifyResult.isValid){
            return res.status(400).json({message:emailVerifyResult.message});
        }
        const passwordVerifyResult = VerifyPassword(password)
        if(!passwordVerifyResult.isValid){
            return res.status(400).json({message: passwordVerifyResult.message});
        }

        // Salt and Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Register the user
        const user = new User({ email, password: hashedPassword, name });
        await user.save();
        const userId = user._id;

        // Create a session
        const token = generateToken({ userId: user._id });
        const session = new Session({ userId, token });
        await session.save();
        const sessionId = session._id;

        // Return the session token
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const logInUser = async (req, res) => {
    try{
        const { email, password } = req.body;

        // verify input values
        const emailVerifyResult = verifyEmail(email)
        if(!emailVerifyResult.isValid){
            return res.status(400).json({message:emailVerifyResult.message});
        }
        const passwordVerifyResult = VerifyPassword(password)
        if(!passwordVerifyResult.isValid){
            return res.status(400).json({message: passwordVerifyResult.message});
        }

        // Verify user credentials
        const user =await User.findAndValidate(email,password)
        if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
        }
        // Create a session
        const token = generateToken({ userId: user._id });
        const session = new Session({ userId: user._id, token });
        await session.save();
        const sessionId = session._id;
    
        // Return the session token
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const logOutUser = async (req, res) => {
    try{
        const token = req.headers.authorization;

        // Delete the session
        await Session.findOneAndDelete({token:token});

        // Return success message
        res.json({ message: 'Logout successful' });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const tokenRefresh = (req, res) => {
    try {
        const oldToken = req.body.oldToken;
        if (!oldToken) {
            return res.status(401).json({ message: 'No refresh token provided' });
        }

        const result = refreshToken(oldToken);
        if (!result.isValid) {
            return res.status(401).json({ message: 'Invalid refresh token' });
        }
        return res.json({ token: result.token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
  
const protectedRoute = async (req, res) => {
    const userId = req.sessionData.userId;
    console.log(userId)
    const user = await User.findById(userId);
    console.log(user)
    res.json(`you are so awesome : ${user.email}`);
  };
  

// Export user functions
module.exports = {
    registerUser,
    logInUser,
    logOutUser,
    tokenRefresh,
    protectedRoute
};
