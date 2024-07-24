import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { setNotification } from '../reducers/notificationReducer'
import { addComment, deleteBlog } from '../reducers/blogReducer'
import { updateVote } from '../reducers/blogReducer'
import { Link, useNavigate } from 'react-router-dom'

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
  const [comment, setComment] = useState('')
  const showWhenVisible = { display: visible ? '' : 'none' }
  const navigate = useNavigate()

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
        navigate('/')
      } catch (exception) {
        dispatch(setNotification(exception.message, 5))
      }
    }
  }

  const handleComment = (event) => {
    event.preventDefault()
    if (comment) {
      try {
        dispatch(addComment(blog, { comment: comment }))
        dispatch(setNotification(`Added comment to blog ${blog.title}`, 5))
      } catch (exception) {
        dispatch(setNotification(exception.message, 5))
      }
      setComment('')
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
            {user &&
            (blog.user.username === user.username || blog.user === user.id) ? (
                <button onClick={() => handleRemove(blog)}>remove</button>
              ) : null}
            <h3>comments</h3>
            <form onSubmit={handleComment}>
              <input
                id="comment"
                value={comment}
                onChange={({ target }) => setComment(target.value)}
              />
              <button id="botton-comment">add comment</button>
            </form>
            {blog.comments.map((comment) => (
              <li key={Math.random() * 1000}>{comment}</li>
            ))}
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
          {user &&
          (blog.user.username === user.username || blog.user === user.id) ? (
              <button onClick={() => handleRemove(blog)}>remove</button>
            ) : null}
        </div>
      </div>
    </div>
  )
}

export default Blog
