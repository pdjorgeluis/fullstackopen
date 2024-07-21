import { useState } from 'react'

import { useDispatch } from 'react-redux'
import { updateBlog } from '../reducers/blogReducer'
import { setNotification } from '../reducers/notificationReducer'
import { deleteBlog } from '../reducers/blogReducer'
import { updateVote } from '../reducers/blogReducer'

import blogService from '../services/blogs' //quitar

const Blog = ({ blog, user, onRemove }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }
  const dispatch = useDispatch()
  const [visible, setVisible] = useState(false)
  const showWhenVisible = { display: visible ? '' : 'none' }

  const handleLikes = (blogToUpdate) => {
    //const updatedBlog = await blogService.update(blogToUpdate.id, newBlog)
    dispatch(updateVote(blogToUpdate.id, blogToUpdate))
  }

  /* const handleRemove = (blog) => {
    console.log(blog.id)
    window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)
      ? dispatch(deleteBlog(blog.id)) //removeBlog(blog.id)
      : null
  }*/

  const handleRemove = (blog) => {
    window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)
      ? dispatch(deleteBlog(blog.id)) //removeBlog(blog.id)
      : null
  }

  return (
    <div style={blogStyle}>
      <div className="blog">
        {blog.title} by {blog.author}
        <button onClick={() => setVisible(!visible)}>
          {visible ? 'hide' : 'view'}
        </button>
        <div className="blogDetails" style={showWhenVisible}>
          {blog.url} <br />
          {blog.likes} <button onClick={() => handleLikes(blog)}>like</button>
          <br />
          {user._id}
          {blog.user.username === user.username || blog.user === user.id ? (
            <button onClick={() => handleRemove(blog)}>remove</button>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default Blog
