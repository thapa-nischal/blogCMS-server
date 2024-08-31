const User = require("../Models/UserModel");
const Blog = require("../Models/BlogModel");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");

// Error handling function
const handleError = (res, statusCode, message) => {
    return res.status(statusCode).json({ error: message });
};

// controler to create a new blog
module.exports.createBlog = async (req, res) => {
    const token = req.cookies.token;

    if (!token) {
        return handleError(res, 401, 'Unauthorized: Token missing');
    }

    const decoded = jwt.verify(token, process.env.TOKEN_KEY);

    const user = await User.findById(decoded.id);

    const author = user.username;

    try {
        const { title, data, tags } = req.body;
        const newBlog = new Blog({
            title: title,
            content: data,
            tags: tags.map(tag => tag.toLowerCase()),
            author: author,
            createdAt: new Date(),
        });
        await newBlog.save();
        res.status(201).json({ success: true, message: 'Blog saved successfully!' });
    } catch (error) {
        console.error('Error saving blog:', error);
        res.status(500).json({ success: false, message: 'Failed to save the blog.' });
    }
};

// controller to delete a blog
module.exports.deleteBlog = async (req, res) => {
    const { id } = req.params;

    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return handleError(res, 404, 'Invalid Blog ID');
        }

        const deletedBlog = await Blog.findOneAndDelete({ _id: id });

        if (!deletedBlog) {
            return handleError(res, 404, 'No such Blog');
        }

        return res.status(200).json({ success: true, message: 'Blog deleted successfully!' });
    } catch (error) {
        return handleError(res, 500, 'Internal Server Error');
    }

}

// controller to update a blog
module.exports.updateBlog = async (req, res) => {
    const { id } = req.params;
    const { title, data, tags } = req.body;
    console.log(title)
    if (!title || !data) {
        return handleError(res, 400, 'Title and content are required');
    }

    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return handleError(res, 404, 'Invalid Blog ID');
        }

        const blog = await Blog.findOneAndUpdate({ _id: id },
            {
                title: title,
                content: data,
                tags: tags.map(tag => tag.toLowerCase()),
            },
            { new: true },
        );

        console.log(blog);

        if (!blog) {
            return res.status(404).json({ success: false, message: 'No such Blog' });
        }

        return res.status(200).json({ success: true, message: 'Blog updated successfully' });

    } catch (error) {
        console.error('Error updating blog:', error);
        return handleError(res, 500, 'Internal Server Error');
    }
}

// controller to list blogs
module.exports.getBlogs = async (req, res) => {
    try {
        const { tag } = req.query;
        const query = tag ? { tags: { $in: [tag] } } : {};
        const blogs = await Blog.find(query).sort({ createdAt: -1 });

        // If no blogs found, return an empty array
        if (!blogs || blogs.length === 0) {
            return res.status(200).json({ blogs: [] });
        }

        return res.status(200).json({ blogs });
    } catch (error) {
        return handleError(res, 500, 'Internal Server Error');
    }
}

// List single Blog
module.exports.getBlog = async (req, res) => {
    const { id } = req.params;

    // Check if the id is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return handleError(res, 400, 'Invalid Blog ID');
    }

    try {
        // Find the blog by id
        const blog = await Blog.findById(id);

        // If blog is not found, return a 404 error
        if (!blog) {
            return handleError(res, 404, 'No such Blog');
        }

        // If blog is found, return it
        res.status(200).json(blog);
    } catch (error) {
        // Handle other errors, such as database errors
        handleError(res, 500, 'Internal Server Error');
    }
};