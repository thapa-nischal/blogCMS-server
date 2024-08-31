const User = require("../Models/UserModel");
const Blog = require('../Models/BlogModel');
const { createSecretToken } = require("../util/SecretToken");
const bcrypt = require("bcryptjs");
const validator = require("validator");


//Signup Controller
module.exports.Signup = async (req, res, next) => {
    try {
        const { email, password, username, createdAt } = req.body;

        // validation
        if (!email || !password || !username) {
            return res.json({ message: "All fields must be filled." });
        }

        if (!validator.isEmail(email)) {
            return res.json({ message: "Email Invalid." });
        }

        if (!validator.isStrongPassword(password)) {
            return res.json({ message: "Password not strong enough." });
        }

        // check if email is already taken
        const emailExists = await User.findOne({ email });
        if (emailExists) {
            return res.json({ message: "Email is already taken." });
        }

        // check if username is already taken
        const usernameExists = await User.findOne({ username });
        if (usernameExists) {
            return res.json({ message: "Username is already taken." });
        }

        const user = await User.create({ email, password, username, createdAt });
        const token = createSecretToken(user.id);

        res
            .status(201)
            .json({ message: "User created successfully.", success: true });
        next();
    } catch (error) {
        console.error(error);
    }
};

// Login Controller
module.exports.Login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.json({ message: 'All fields are required.' })
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.json({ message: 'Incorrect Email.' })
        }

        const auth = await bcrypt.compare(password, user.password)
        if (!auth) {
            return res.json({ message: 'Incorrect Passoword.' })
        }

        // Token Creation
        const token = createSecretToken(user.id);
        res.cookie("token", token, {
            withCredentials: true,
            httpOnly: false,
        });

        res.status(201).json({
            message: "User logged in successfully.",
            success: true,
            username: user.username,
            email: user.email,
            token
        });
        next();

    } catch (error) {
        console.error(error);
    }
}


// User Profile Controller
module.exports.userProfile = async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const blogs = await Blog.find({ author: user.username }); //.select('title')

        res.status(200).json({
            username: user.username,
            joinedDate: user.createdAt,
            blogs: blogs
        });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};