import fs from "fs-extra"
import { dirname, join } from "path"
import { fileURLToPath } from "url"
import uniqid from "uniqid"
import createHttpError from "http-errors"

const { readJSON, writeJSON } = fs

const dataFolderPath = join(dirname(fileURLToPath(import.meta.url)), "../data")

const blogsJSONPath = join(dataFolderPath, "blogs.json")

export const readBlogs = () => readJSON(blogsJSONPath)

export const writeNewBlog = async newBlog => {
  const blogs = await readBlogs()
  const blog = {
    ...newBlog,
    id: uniqid(),
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  delete blog.path
  blogs.push(blog)
  await writeJSON(blogsJSONPath, blogs)
  return blog.id
}

export const findByIdAndUpdate = async (id, fieldName, fieldValue) => {
  // 1. read blog obtaining an array (of objects)
  const blogs = await readBlogs()

  // 2. find the item (by id) that needs to be modified
  const foundIndex = blogs.findIndex(blog => blog.id === id)

  if (foundIndex !== -1) {
    // 3. modify that found item (we are modifying the fieldName with the fieldValue)
    const foundBlog = blogs[foundIndex]
    const updatedBlog = { ...foundBlog, [fieldName]: fieldValue, updatedAt: new Date() }

    // 4. insert the item back into the array
    files[foundIndex] = updatedBlog

    // 5. write the array back to blog
    await writeJSON(blogsJSONPath, blogs)

    // 6. return updatedBlog
    return updatedBlog
  } else {
    throw createHttpError(404, `Blog with id ${id} not found!`)
  }
}
