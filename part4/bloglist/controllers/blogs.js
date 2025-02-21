const blogsRouter = require("express").Router();
const { response } = require("express");
const Blog = require("../models/blog");
const User = require("../models/user");

blogsRouter.get("/", async (request, response, next) => {
  const blogs = await Blog.find({}).populate("user", {
    username: 1,
    name: 1,
    id: 1,
  });
  response.json(blogs);
});

blogsRouter.get("/:id", async (request, response, next) => {
  const blogs = await Blog.findOne(request.body.id);
  response.json(blogs);
}); //experimental

blogsRouter.post("/", async (request, response, next) => {
  const body = request.body;

  if (!request.user) {
    return response.status(401).json({ error: "invalid token" });
  }
  const user = await User.findById(request.user);

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user.id,
  });

  const savedBolg = await blog.save();
  user.blogs = user.blogs.concat(savedBolg._id);
  await user.save();

  response.status(201).json(savedBolg);
});

blogsRouter.post("/:id/comments", async (request, response, next) => {
  const body = request.body;

  if (!request.user) {
    return response.status(401).json({ error: "invalid token" });
  }

  const doc = await Blog.findById(request.params.id);
  doc.comments = doc.comments.concat(body.comment);
  const savedBolg = await doc.save();
  response.json(savedBolg);
});

blogsRouter.delete("/:id", async (request, response) => {
  if (!request.user) {
    return response.status(401).json({ error: "invalid token" });
  }

  const deletedBlog = await Blog.findByIdAndDelete(request.params.id);

  response.status(204).json(deletedBlog); //no content in the response
});

blogsRouter.put("/:id", async (request, response) => {
  const body = request.body;

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  };

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, body, {
    new: true,
  });

  response.json(updatedBlog);
});

module.exports = blogsRouter;
