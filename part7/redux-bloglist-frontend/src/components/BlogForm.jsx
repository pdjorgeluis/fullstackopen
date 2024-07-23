import { useState } from 'react'
import { createBlog } from '../reducers/blogReducer'
import { useDispatch } from 'react-redux'
import { setNotification } from '../reducers/notificationReducer'

import { Form, Button } from 'react-bootstrap'

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
      <Form onSubmit={handleCreate}>
        <Form.Group>
          <Form.Label>title:</Form.Label>
          <Form.Control
            id="title"
            type="text"
            value={title}
            name="Title"
            onChange={({ target }) => setTitle(target.value)}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>author:</Form.Label>
          <Form.Control
            id="author"
            type="text"
            value={author}
            name="Author"
            onChange={({ target }) => setAuthor(target.value)}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>url:</Form.Label>
          <Form.Control
            id="url"
            type="text"
            value={url}
            name="Url"
            onChange={({ target }) => setUrl(target.value)}
          />
          <br />
          <Button variant="primary" type="submit" id="button-create">
            create
          </Button>
        </Form.Group>
      </Form>
    </div>
  )
}

export default BlogForm
