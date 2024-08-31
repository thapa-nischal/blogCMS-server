const User = require("../Models/UserModel");
require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports.userVerification = async (req, res, next) => {
    // verify user is authenticated
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({ error: 'Authorization token required' });
    }

    const token = authorization.split(' ')[1];

    try {
        const { _id } = jwt.verify(token, process.env.SECRET);

        req.user = await User.findOne({ _id }).select('_id');
        next();

    } catch (error) {
        console.log(error);
        res.status(401).json({ error: 'Request is not authorized' });
    }

    // const token = req.cookies.token;
    // if (!token) {
    //     return res.json({ status: false });
    // }

    // try {
    //     const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    //     const user = await User.findById(decoded.id);

    //     if (user) {
    //         return res.json({ status: true, user: user.username });
    //     } else {
    //         return res.json({ status: "No User" });
    //     }
    // } catch (error) {
    //     console.error("Error verifying token:", error);
    //     return res.json({ status: false });
    // }
};

