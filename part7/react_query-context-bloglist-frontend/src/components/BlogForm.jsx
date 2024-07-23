import { useState } from 'react'
import { useNotificationDispatch } from '../NotificationContext'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import blogService from '../services/blogs'

const BlogForm = () => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const queryClient = useQueryClient()
  const dispatchNotification = useNotificationDispatch()

  const newBlogMutation = useMutation({
    mutationFn: blogService.create,
    onSuccess: (createdBlog) => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
      dispatchNotification({
        type: 'SHOW',
        payload: `a new blog ${createdBlog.title} by ${createdBlog.author} added`,
      })
      setTimeout(() => {
        dispatchNotification({ type: 'HIDE' })
      }, 5000)
    },
    onError: (error) => {
      dispatchNotification({ type: 'SHOW', payload: error.message })
      setTimeout(() => {
        dispatchNotification({ type: 'HIDE' })
      }, 5000)
    },
  })

  const handleCreate = (event) => {
    event.preventDefault()
    if (title && author && url) {
      const blogObject = {
        title: title,
        author: author,
        url: url,
      }

      newBlogMutation.mutate(blogObject)

      //createBlog(blogObject)

      setTitle('')
      setAuthor('')
      setUrl('')
    } else {
      dispatchNotification({ type: 'SHOW', payload: 'fill all the fields' })
      setTimeout(() => {
        dispatchNotification({ type: 'HIDE' })
      }, 5000)
    }
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={handleCreate}>
        <div>
          title:
          <input
            id="title"
            type="text"
            value={title}
            name="Title"
            onChange={({ target }) => setTitle(target.value)}
          />{' '}
          <br />
          author:
          <input
            id="author"
            type="text"
            value={author}
            name="Author"
            onChange={({ target }) => setAuthor(target.value)}
          />{' '}
          <br />
          url:
          <input
            id="url"
            type="text"
            value={url}
            name="Url"
            onChange={({ target }) => setUrl(target.value)}
          />{' '}
          <br />
          <button id="button-create" onClick={handleCreate}>
            create
          </button>
        </div>
      </form>
    </div>
  )
}

export default BlogForm
