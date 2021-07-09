// this will handle user registration

const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");
const User = require("../../models/User");
const Post = require("../../models/Post");

//@Route POST api/Posts
//@desc add posts
//access private
router.post(
  "/",
  [auth, [check("text", "text is required").not().isEmpty()]],
  async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({ error: error.array() });
    }
    try {
      const user = await User.findById(req.user.id).select("-password");
      if (!user) {
        return res.status(404).json({ msg: "User not found" });
      }
      const newPost = new Post({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      });
      const posts = await newPost.save();
      res.json(posts);
    } catch (error) {
      console.log(error.message);
      res.status(500).send("server error");
    }
  }
);
//@Route GET
//@desc GET all posts
//access private
router.get("/", auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    res.json(posts);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("server error");
  }
});
//@Route GET
//@desc GET posts by id
//access private
router.get("/:id", auth, async (req, res) => {
  try {
    const posts = await Post.findById(req.params.id);
    if (!posts) {
      return res.status(404).json({ msg: "post not found" });
    }
    res.json(posts);
  } catch (error) {
    console.log(error.message);
    if (error.kind == "ObjectId") {
      return res.status(404).json({ msg: "post not found..." });
    }
    res.status(500).send("server error");
  }
});
//@Route Delete
//@desc delete post by postID and user
//access private
router.delete("/:id", auth, async (req, res) => {
  try {
    const posts = await Post.findById(req.params.id);
    if (!posts) {
      return res.status(404).json({ msg: "post not found" });
    }
    if (posts.user.toString() !== req.user.id) {
      return res.status(404).json({ msg: "User is not authorized" });
    }
    await posts.remove();

    res.json({ msg: "post have been removed" });
  } catch (error) {
    console.log(error.message);
    if (error.kind == "ObjectId") {
      return res.status(404).json({ msg: "post not found" });
    }
    res.status(500).send("server error");
  }
});
//@Route PUT
//@desc likes the post
//access private
router.put("/like/:id", auth, async (req, res) => {
  try {
    const posts = await Post.findById(req.params.id);

    //check if the posts is liked or not
    if (
      posts.likes.filter((likes) => likes.user.toString() === req.user.id)
        .length > 0
    ) {
      return res.status(400).json({ msg: "You already liked this post" });
    }
    posts.likes.unshift({ user: req.user.id });
    await posts.save();

    res.json(posts.likes);
  } catch (error) {
    console.log(error.message);
    if (error.kind == "ObjectId") {
      return res.status(404).json({ msg: "post not found" });
    }
    res.status(500).send("server error");
  }
});
//@Route PUT
//@desc unlike the post
//access private
router.put("/unlike/:id", auth, async (req, res) => {
  try {
    const posts = await Post.findById(req.params.id);

    //check if the posts is liked or not
    if (
      posts.likes.filter((likes) => likes.user.toString() === req.user.id)
        .length == 0
    ) {
      return res.status(400).json({ msg: "You have not like this post" });
    }

    posts.likes = await posts.likes.filter(
      (likes) => likes.user.toString() !== req.user.id
    );
    await posts.save();

    res.json(posts.likes);
  } catch (error) {
    console.log(error.message);
    if (error.kind == "ObjectId") {
      return res.status(404).json({ msg: "post not found" });
    }
    res.status(500).send("server error");
  }
});
//@Route DELETE api/Posts
//@desc Delete comments
//access private
router.delete("/comments/:id/:comment_id", auth, async (req, res) => {
  try {
    const posts = await Post.findById(req.params.id);

    // pull out the comments
    const comment = posts.comments.find(
      (comment) => comment.id == req.params.comment_id
    );

    if (!comment) {
      return res.status(404).json({ msg: "No not found" });
    }

    if (!posts) {
      return res.status(404).json({ msg: "post not found" });
    }
    if (comment.user.toString() !== req.user.id) {
      return res.status(404).json({ msg: "user not authorized" });
    }

    posts.comments = await posts.comments.filter(
      (comments) => comments != comment
    );

    await posts.save();
    res.json(posts.comments);
  } catch (error) {
    console.log(error.message);
    if (error.kind == "ObjectId") {
      return res.status(404).json({ msg: "post not found" });
    }
    res.status(500).send("server error");
  }
});
//@Route POST api/Posts
//@desc add comments
//access private
router.post(
  "/comments/:id",
  [auth, [check("text", "text is required").not().isEmpty()]],
  async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({ error: error.array() });
    }
    try {
      const user = await User.findById(req.user.id).select("-password");
      const post = await Post.findById(req.params.id);

      if (!user) {
        return res.status(404).json({ msg: "User not found" });
      }

      if (!post) {
        return res.status(404).json({ msg: "Post not found" });
      }
      const newComment = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      };
      post.comments.unshift(newComment);

      await post.save();
      res.json(post.comments);
    } catch (error) {
      console.log(error.message);
      if (error.kind == "ObjectId") {
        return res.status(404).json({ msg: "post not found" });
      }
      res.status(500).send("server error");
    }
  }
);

module.exports = router;
