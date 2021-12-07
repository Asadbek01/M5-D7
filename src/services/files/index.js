import express from "express"
import multer from "multer"
import { v2 as cloudinary } from "cloudinary"
import { CloudinaryStorage } from "multer-storage-cloudinary"
import { readBlogs, writeNewBlog, findByIdAndUpdate } from "../../lib/fs-tools.js"

const BlogsRouter = express.Router()

const cloudUploader = multer({
  storage: new CloudinaryStorage({
    cloudinary, // search automatically for process.env.CLOUDINARY_URL
    params: {
      folder: "blog-box",
    },
  }),
  // fileFilter: () => {}
}).single("blog")

BlogsRouter.get("/", async (req, res, next) => {
  // list of all blogs (optional query parameter to filter only starred blogs)

  const blogs = await readBlogs()

  console.log(req.query)

  if (req.query && req.query.isStarred) {
    // if we are receiving a query in the request we are going to filter
    const filteredBlogs = blogs.filter(blog => blog.isStarred === true)
    res.send(filteredBlogs)
  } else {
    // we are sending the full list blogs
    res.send(blogs)
  }
  try {
  } catch (error) {
    next(error)
  }
})

BlogsRouter.post("/", cloudUploader, async (req, res, next) => {
  // upload a new blog (on Cloudinary) + add new record on database
  console.log("REQ FILE: ", req.file)
  
  const newBlog = {
    title: req.file.originalname,
    ...req.file,
    url: req.file.path,
  }
  const id = await writeNewBlog(newBlog)
  res.send({ id })
  try {
  } catch (error) {
    next(error)
  }
})

BlogsRouter.patch("/:id/isStarred", async (req, res, next) => {
  // to star (add/remove to favorites) a file (modify the record in database --> isStarred=true/false)
  try {
    const updatedBlog = await findByIdAndUpdate(req.params.id, "isStarred", req.body.isStarred)
    res.send(updatedBlog)
  } catch (error) {
    next(error)
  }
})

BlogsRouter.patch("/:id/title", async (req, res, next) => {
  // to rename a file (modify the record in database --> title="something.gif")
  try {
    const updatedBlog = await findByIdAndUpdate(req.params.id, "title", req.body.title)
    res.send(updatedBlog)
  } catch (error) {
    next(error)
  }
})

BlogsRouter.delete("/:id", async (req, res, next) => {
  // to delete a file (remove from Cloudinary) + remove record from the database
  try {
  } catch (error) {
    next(error)
  }
})

export default BlogsRouter
