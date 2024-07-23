import { useState } from 'react'
import { useNotificationDispatch } from '../NotificationContext'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import blogService from '../services/blogs'

const Blog = ({ blog, user }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const queryClient = useQueryClient()
  const dispatchNotification = useNotificationDispatch()
  const [comment, setComment] = useState('')

  const updateBlogMutation = useMutation({
    mutationFn: blogService.update,
    onSuccess: (updatedBlog) => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
      dispatchNotification({
        type: 'SHOW',
        payload: `likes in blog ${updatedBlog.title} updated`,
      })
      setTimeout(() => {
        dispatchNotification({ type: 'HIDE' })
      }, 5000)
    },
  })

  const removeBlogMutation = useMutation({
    mutationFn: blogService.deleteBlog,
    onSuccess: (deletedBlog) => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
      dispatchNotification({
        type: 'SHOW',
        payload: `${deletedBlog.title} deleted`,
      })
      setTimeout(() => {
        dispatchNotification({ type: 'HIDE' })
      }, 5000)
    },
  })

  const addComment = useMutation({
    mutationFn: blogService.addComment,
    onSuccess: (updatedBlog) => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
      dispatchNotification({
        type: 'SHOW',
        payload: `added comment in blog ${updatedBlog.title} `,
      })
      setTimeout(() => {
        dispatchNotification({ type: 'HIDE' })
      }, 5000)
    },
  })

  const handleLikes = (blogToUpdate) => {
    const newBlog = {
      title: blogToUpdate.title,
      url: blogToUpdate.url,
      likes: blogToUpdate.likes + 1,
      user: {
        username: blogToUpdate.user.username,
        name: blogToUpdate.user.name,
        _id: blogToUpdate.user.id,
      },
      author: blogToUpdate.author,
      _id: blogToUpdate.id,
    }
    updateBlogMutation.mutate(newBlog)
  }

  const handleRemove = (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      try {
        removeBlogMutation.mutate(blog)
        dispatchNotification({
          type: 'SHOW',
          payload: `Removed blog ${blog.title}`,
        })
        setTimeout(() => {
          dispatchNotification({ type: 'HIDE' })
        }, 5000)
      } catch (error) {
        dispatchNotification({ type: 'SHOW', payload: error.message })
        setTimeout(() => {
          dispatchNotification({ type: 'HIDE' })
        }, 5000)
      }
    }
  }

  const handleComment = (event) => {
    event.preventDefault()
    if (comment) {
      try {
        //blogService.addComment(blog.id, { comment: comment })
        addComment.mutate({ id: blog.id, comment: comment })
        //dispatch(setNotification(`Added comment to blog ${blog.title}`, 5))
      } catch (exception) {
        //dispatch(setNotification(exception.message, 5))
      }
      setComment('')
    }
  }

  return (
    <div>
      <div>
        <h2>{blog.title}</h2>
        <a href={blog.url}>{blog.url}</a>
        <br />
        {blog.likes} <button onClick={() => handleLikes(blog)}>like</button>
        <br />
        added by {blog.author}
        <div>
          {blog.user.username === user.username
            ? blog.user === user.id || (
              <button onClick={() => handleRemove(blog)}>remove</button>
            )
            : null}
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
            <li key={Math.random * 1000}>{comment}</li>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Blog
