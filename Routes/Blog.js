const { createBlog, getBlogs, getBlog, deleteBlog, updateBlog } = require("../Controllers/BlogController");

const router = require("express").Router();

const { userVerification } = require("../Middlewares/AuthMiddleware");

// require auth for all blog routes
// router.use(userVerification);


// Blog Routes
router.post("/postblog", createBlog);
router.get("/getblogs", getBlogs);
router.get("/blogs/:id", getBlog);
router.delete("/blogs/:id", deleteBlog);
router.patch("/blogs/:id", updateBlog);



module.exports = router;