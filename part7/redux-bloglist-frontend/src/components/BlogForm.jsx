import { useState } from 'react'
import { createBlog } from '../reducers/blogReducer'
import { useDispatch } from 'react-redux'
import { setNotification } from '../reducers/notificationReducer'

const BlogForm = () => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const dispatch = useDispatch()

  const handleCreate = (event) => {
    event.preventDefault()
    if (title && author && url) {
      const blogObject = {
        title: title,
        author: author,
        url: url,
      }
      try {
        dispatch(createBlog(blogObject))
        dispatch(
          setNotification(
            `a new blog ${blogObject.title} by ${blogObject.author} added`,
            5
          )
        )
      } catch (exception) {
        dispatch(setNotification(exception.message, 5))
      }
      setTitle('')
      setAuthor('')
      setUrl('')
    } else {
      console.log('failed')
      dispatch(setNotification('fill all the fields', 5))
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
          <button id="button-create">create</button>
        </div>
      </form>
    </div>
  )
}

export default BlogForm
