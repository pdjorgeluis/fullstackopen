import { useState } from 'react'

import { useDispatch } from 'react-redux'
import { setNotification } from '../reducers/notificationReducer'
import { deleteBlog } from '../reducers/blogReducer'
import { updateVote } from '../reducers/blogReducer'
import { Link } from 'react-router-dom'

const Blog = ({ blog, user, scope }) => {
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
    try {
      dispatch(updateVote(blogToUpdate.id, blogToUpdate))
      dispatch(
        setNotification(`likes in blog ${blogToUpdate.title} updated`, 5)
      )
    } catch (exception) {
      dispatch(setNotification(exception.message, 5))
    }
  }

  const handleRemove = (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      try {
        dispatch(deleteBlog(blog.id))
        dispatch(setNotification(`Removed blog ${blog.title}`, 5))
      } catch (exception) {
        dispatch(setNotification(exception.message, 5))
      }
    }
  }

  if (!blog) {
    return null
  } else if (scope === 'ROUTES') {
    return (
      <div>
        <div className="blog">
          <h2>{blog.title}</h2>
          <a href={blog.url}>{blog.url}</a>
          <br />
          {blog.likes} <button onClick={() => handleLikes(blog)}>like</button>
          <br />
          added by {blog.author}
          <div>
            {blog.user.username === user.username || blog.user === user.id ? (
              <button onClick={() => handleRemove(blog)}>remove</button>
            ) : null}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={blogStyle}>
      <div className="blog">
        <Link to={`/blogs/${blog.id}`}>
          {blog.title} by {blog.author}
        </Link>
        <button onClick={() => setVisible(!visible)}>
          {visible ? 'hide' : 'view'}
        </button>
        <div className="blogDetails" style={showWhenVisible}>
          {blog.url} <br />
          {blog.likes} <button onClick={() => handleLikes(blog)}>like</button>
          <br />
          {blog.user.username === user.username || blog.user === user.id ? (
            <button onClick={() => handleRemove(blog)}>remove</button>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default Blog
