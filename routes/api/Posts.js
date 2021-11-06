const express = require("express");
const { validationResult, check } = require("express-validator");
const Post = require("../../models/Post");
const User = require("../../models/User");
const Auth = require("../../utils/auth");
const router = express.Router();

// @route GET api/Posts
// @desc GET ALL Posts by Users
// @access Public
router.get("/", async (req, res) => {
  try {
    // sort by date, new to old
    const posts = await Post.find({}).sort({ date: -1 }).populate("user", ["username", "avatar"]);
    console.log(posts);

    if (!posts) res.status(400).send("No Posts Found");

    res.json(posts);
  } catch (err) {
    console.log(err);
    res.status(500).json("Server Error");
  }
});

// @route GET api/Posts/post/:id
// @desc GET ONE Post by it's Id
// @access Public
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.id }).populate("user", ["username","avatar",]);

    if (!post) {
      return res.status(400).send("No Post Found");
    }

    res.json(post);
  } catch (err) {
    console.log(err);
    if (err.kind === "ObjectId") {
      return res.status(400).send("No Post Found");
    }
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

    try {
      const user = await User.findOne({ user: req.user.id });

      const newPost = new Post({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      });

      const post = await newPost.save();

      res.json(post);
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: err });
    }
  }
);

// @route DELETE api/Posts/post/:id
// @desc DELETE Post by it's Id
// @access Private
router.delete("/:id", Auth, async (req, res) => {
  try {
    // await Post.findOneAndDelete({_id: req.params.id}) ;
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(400).json({ message: "This post cannot be found" });
    //check this user === user who made post
    if (post.user.toString() !== req.user.id) {
      return res.status(400).json({ message: "You are not authorized to delete this post" });
    }

    await post.remove();

    res.json({ message: "Post Deleted" });
  } catch (err) {
    console.log(err);
    if (err.kind === "ObjectId") {
      return res
        .status(400)
        .json({ message: "You are not authorized to delete this post" });
    }
    res.status(500).json({ message: err });
  }
});

// @route POST api/posts/:id/comments
// @desc POST a comment onto a post
// @access Private
router.post(
  "/:id/comments",
  [Auth, check("text", "must include text")],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) res.json({ errors: errors.array() });

    try {
      const user = await User.findById(req.user.id).select("-password");
      const postToUpdate = await Post.findOne({ _id: req.params.id });

      if (!postToUpdate) {
        res.status(400).send("No Post Found");
      }

      const newComment = {
        text: req.body.text,
        user: req.user.id,
        avatar: user.avatar,
        name: user.name,
      };

      postToUpdate.comments.push(newComment);
      await postToUpdate.save();

      // await postToUpdate.update({ $push: {comments: req.body}});
      res.json(postToUpdate);
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Server Error" });
    }
  }
);

// @route POST api/posts/:id/comments
// @desc POST a comment onto a post
// @access Private
router.delete("/:id/comments/:comment_id", Auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const comment = post.comments.find((comment) => {
      return comment.id === req.params.comment_id;
    });

    if (!comment) return res.status(400).send("Comment not found");
    if (comment.user.toString() !== req.user.id)
      return res.status(400).send("User not authorized");

    const newComments = post.comments.filter((comm) => comm.id.toString() !== req.params.comment_id);
    post.comments = newComments;
    await post.save();

    res.json(post.comments);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// @route PUT api/posts/:id/like
// @desc TOGGLE Like on Post
// @access Private
router.put("/:id/like", Auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    //like.user is Type ObjectId so need to .toString() to compare to req.user.id
    const isLiked = post.likes.find((like) => like.user.toString() === req.user.id);
    // if user has already liked, remove the like
    if (isLiked !== undefined) {
      const newLikes = post.likes.filter((like) => like.user.toString() !== req.user.id);
      post.likes = newLikes;

      await post.save();
      return res.status(200).json(post.likes);
    }
    //else add the like
    post.likes.unshift({ user: req.user.id });
    await post.save();
    res.status(200).json(post.likes);
  } catch (err) {
    console.log(err);
    res.status(500).json("Server Error");
  }
});

// @route PUT api/Posts/post/:id
// @desc UPDATE Post content by it's Id
// @access Private
// router.put(
//   "/:id",
//   [Auth, [check("text", "text must be provided")]],
//   async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) res.json({ errors: errors.array() });


//     try {
//       const post = await Post.findOneAndUpdate(
//         { _id: req.params.id },
//         { $set: postFields },
//         { new: true }
//       );
//       if (!post) res.send("No Post Found");

//       res.json(post);
//     } catch (err) {
//       console.error(err);
//       res.status(500).json({ message: err });
//     }
//   }
// );

module.exports = router;
