const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Provide a title for the blog"]
    },
    content: {
        type: Object,
        required: true,
    },
    author: { type: String, ref: "User" },
    tags: {
        type: [String],
        required: [true, "Provide a tag for the blog"],
    },
    createdDate: {
        type: String, // Store as a string in 'YYYY/MM/DD' format
        default: function () {
            const now = new Date();
            return now.getFullYear() + '/' + (now.getMonth() + 1).toString().padStart(2, '0') + '/' + now.getDate().toString().padStart(2, '0');
        },
    },

}, { timestamps: true })


module.exports = mongoose.model('Blog', blogSchema);