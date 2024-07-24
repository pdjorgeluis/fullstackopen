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
    removeBlog(state, action) {
      const id = action.payload
      return state.filter((blog) => blog.id !== id)
    },
    updateBlog(state, action) {
      const newBlog = action.payload
      return state.map((blog) => (blog.id !== newBlog.id ? blog : newBlog))
    },
  },
})

export const { setBlogs, appendBlog, removeBlog, updateBlog } =
  blogSlice.actions

export const initializeBlogs = () => {
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

export const updateVote = (id, blogToUpdate) => {
  return async (dispatch) => {
    const id = !blogToUpdate.user.id ? blogToUpdate.user : blogToUpdate.user.id
    const newBlog = {
      title: blogToUpdate.title,
      url: blogToUpdate.url,
      likes: blogToUpdate.likes + 1,
      user: id,
      author: blogToUpdate.author,
      _id: blogToUpdate.id,
      comments: [...blogToUpdate.comments],
    }
    await blogService.update(id, newBlog)

    dispatch(updateBlog({ ...blogToUpdate, likes: blogToUpdate.likes + 1 }))
  }
}

export const deleteBlog = (id) => {
  return async (dispatch) => {
    await blogService.deleteBlog(id)
    dispatch(removeBlog(id))
  }
}

export const addComment = (blogToUpdate, newComment) => {
  return async (dispatch) => {
    await blogService.addComment(blogToUpdate.id, newComment)

    dispatch(
      updateBlog({
        ...blogToUpdate,
        comments: blogToUpdate.comments.concat(newComment.comment),
      })
    )
  }
}

export default blogSlice.reducer
