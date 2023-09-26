const express = require('express');
const router = express.Router();
const {authenticate} = require("../middlewares")
const {registerUser, logInUser,logOutUser,tokenRefresh,protectedRoute} = require("../controllers/userController")

router.post("/register", registerUser)
router.post("/login", logInUser)
router.post('/token-refresh',tokenRefresh);

router.post('/logout',authenticate, logOutUser);
router.get('/secret',authenticate, protectedRoute);


module.exports = router;