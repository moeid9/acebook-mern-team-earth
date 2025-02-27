const Post = require("../models/post");
const Comment = require("../models/comment");
const TokenGenerator = require("../models/token_generator");

const PostsController = {
  Index: (req, res) => {
    Post.find()
    .populate("user", "name avatar")
    .populate("comments")
    .populate({
      path: "comments",
      populate: { path: "user", model: "User", select: "name avatar" },
    })
      .exec(async (err, posts) => {
        if (err) {
          throw err;
        }
        await Comment.populate("user", "name");
        const token = await TokenGenerator.jsonwebtoken(req.user_id);
        posts = posts.map((post) => {
          let liked = post.likes.includes(req.user_id);
          post._doc = { ...post._doc, ...{ liked: liked } };
          return post;
        });
        res.status(200).json({ posts: posts, token: token });
      });
  },

  GetPost: (req, res) => {
    Post.findOne({ _id: req.params.id })
      .populate("user", "name")
      .populate("comments")
      .populate({
        path: "comments",
        populate: { path: "user", model: "User", select: "name" },
      })
      .exec(async (err, post) => {
        if (err) {
          throw err;
        }
        const token = await TokenGenerator.jsonwebtoken(req.user_id);
        res.status(200).json({ post: post, token: token });
      });
  },
  Create: (req, res) => {
    //injecting user_id here
    let postContent = { ...req.body, user: req.user_id };
    const post = new Post(postContent);
    post.save(async (err) => {
      if (err) {
        throw err;
      }

      const token = await TokenGenerator.jsonwebtoken(req.user_id);
      res.status(201).json({ message: "OK", token: token });
    });
  },

  CreateComment: (req, res) => {
    Post.findOne({ _id: req.params.id }).then(async (post) => {
      const comment = new Comment({
        comment: req.body.comment,
        user: req.user_id,
      });
      await comment.save();
      console.log(comment);
      post.comments.push(comment);
      console.log("Comment added");

      post.save(async (err, post) => {
        if (err) {
          throw err;
        }

        const token = await TokenGenerator.jsonwebtoken(req.user_id);
        res.status(201).json({
          token: token,
          message: "OK",
        });
      });
    });
  },

  ToggleLike: (req, res) => {
    Post.findOne({ _id: req.params.id }).then(async (post) => {
      //Post comes from mongoose schema.findOne mong meth
      let liked;
      if (post.likes.includes(req.user_id)) {
        //checks database  (likes array) for existing user_id removes a match -displays like removed
        post.likes.splice(post.likes.indexOf(req.user_id), 1);
        console.log("Like removed");
        liked = false;
      } else {
        //saves user_id to database and displays- Like added
        post.likes.push(req.user_id);
        console.log("Like added");
        liked = true;
      }
      post.save(async (err, post) => {
        if (err) {
          throw err;
        } //if successful  generates a new JWT which has following property
        const token = await TokenGenerator.jsonwebtoken(req.user_id);
        res.status(201).json({
          token: token,
          message: "OK",
          likes: post.likes.length, //No of likes
          liked: liked, //displays boolean  Liked status
        });
      });
    });
  },
};

module.exports = PostsController;
