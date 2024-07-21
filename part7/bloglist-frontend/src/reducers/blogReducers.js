import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'

const blogSlice = createSlice({
  name: 'blog',
  initialState: [],
  reducers: {
    setBlogs(state, action) {
      return action.payload
    },
    appendBlog(state, action) {
      state.push(action.payload)
    },
    getBlogs(state, action) {
      return state
    },
  },
})

export const { setBlogs, appendBlog, getBlogs } = blogSlice.actions

export const inializeBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll()
    dispatch(setBlogs(blogs))
  }
}

export const createBlog = (blogObject) => {
  return async (dispatch) => {
    const newBlog = await blogService.create(blogObject)
    dispatch(appendBlog(newBlog))
  }
}

export const updateBlog = (id, newBlog) => {
  return async (dispatch) => {
    //const blogToUpdate = blogs.find(n => n.id === id)
    const changedBlog = await blogService.update(id, newBlog)
    const newBlogs = dispatch(getBlogs()).map((blog) =>
      blog.id !== id ? blog : changedBlog
    )
    dispatch(setBlogs(newBlogs))
  }
}

export const deleteBlog = (id) => {
  return async (dispatch) => {
    const deletedBlog = await blogService.deleteBlog(id)
    const newBlogs = dispatch(getBlogs()).filter(
      (blog) => blog.id !== deletedBlog.id
    )
    dispatch(setBlogs(newBlogs))
  }
}

export default blogSlice.reducer
