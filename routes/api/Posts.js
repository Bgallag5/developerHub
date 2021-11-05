const express = require("express");
const { validationResult, check } = require("express-validator");
const Post = require("../../models/Post");
const Auth = require("../../utils/auth");
const router = express.Router();

// @route GET api/Posts
// @desc GET ALL Posts by Users
// @access Public
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find({}).populate("user", ["username", "avatar"]);

    if (!posts) res.status(400).send("No Posts Found");

    console.log(posts);

    res.json(posts);
  } catch (err) {
    console.log(err);
    res.status(500).json("Server Error");
  }
});

// @route GET api/Posts/post/:id
// @desc GET ONE Post by it's Id
// @access Public
router.get("/post/:id", async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.id }).populate("user", [
      "username",
      "avatar",
    ]);

    if (!post) res.status(400).send("No Post Found");

    console.log(post);

    res.json(post);
  } catch (err) {
    console.log(err);
    res.status(500).json("Server Error");
  }
});

// @route POST api/Posts
// @desc POST a new Post
// @access Private
router.post(
  "/",
  [Auth, [check("text", "post text is required").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { text, ...rest } = req.body;
    const postFields = {};
    postFields.user = req.user.id;
    if (text) postFields.text = text;
    postFields.rest = rest;

    try {
      const newPost = new Post(postFields);

      await newPost.save();

      res.json(newPost);
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: err });
    }
  }
);

// @route PUT api/Posts/post/:id
// @desc UPDATE Post content by it's Id
// @access Private
router.put(
  "/post/:id",
  [Auth, [check("text", "text must be provided")]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) res.json({ errors: errors.array() });

    const { text, ...rest } = req.body;
    const postFields = {};
    postFields.user = req.user.id;
    if (text) postFields.text = text;
    postFields.rest = rest;

    try {
      const post = await Post.findOneAndUpdate(
        { _id: req.params.id },
        { $set: postFields },
        { new: true }
      );
      if (!post) res.send('No Post Found')

      res.json(post);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: err });
    }
  }
);

// @route DELETE api/Posts/post/:id
// @desc DELETE Post by it's Id
// @access Private
router.delete('/post/:id', Auth, async (req, res) => {
    try {
        await Post.findOneAndDelete({_id: req.params.id}) ;

        res.json({message: 'Post Deleted'})
    } catch (err){
        console.log(err);
        res.status(500).json({message: err})
    }
})


module.exports = router;
