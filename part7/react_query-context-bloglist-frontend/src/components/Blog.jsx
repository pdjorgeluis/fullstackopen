import { useState } from 'react'
import { useNotificationDispatch } from '../NotificationContext'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import blogService from '../services/blogs'

const Blog = ({ blog, username }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const queryClient = useQueryClient()
  const dispatchNotification = useNotificationDispatch()

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

  const [visible, setVisible] = useState(false)
  const showWhenVisible = { display: visible ? '' : 'none' }

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
    console.log(newBlog)
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
          {blog.user.username}
          {blog.user.username === username ? (
            <button onClick={() => handleRemove(blog)}>remove</button>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default Blog
