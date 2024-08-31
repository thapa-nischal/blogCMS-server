const { userVerification } = require("../Middlewares/AuthMiddleware");
const { Signup, Login, userProfile } = require("../Controllers/AuthController");

const router = require("express").Router();

// User Routes
router.post('/', userVerification);
router.post("/signup", Signup);
router.post("/login", Login);

// Profile Routes
router.get('/users/:username', userProfile)

module.exports = router;