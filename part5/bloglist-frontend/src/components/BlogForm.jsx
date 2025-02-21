import { useState } from 'react'

const BlogForm = ({ createBlog, setAlert }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleCreate = (event) => {

    event.preventDefault()
    if (title && author && url){

      const blogObject = {
        title: title,
        author: author,
        url: url
      }

      createBlog(blogObject)

      setTitle('')
      setAuthor('')
      setUrl('')
    }else{
      setAlert({ message: 'fill all the fields', typeOfAlert: 'error' })
      setTimeout(() => {
        setAlert(null)
      }, 5000)
    }
  }

  return(
    <div>
      <h2>create new</h2>
      <form onSubmit={handleCreate}>
        <div>
          title:
          <input
            id='title'
            type='text'
            value={title}
            name='Title'
            onChange={({ target }) => setTitle(target.value)}
          /> <br/>
            author:
          <input
            id='author'
            type='text'
            value={author}
            name='Author'
            onChange={({ target }) => setAuthor(target.value)}
          /> <br/>
            url:
          <input
            id='url'
            type='text'
            value={url}
            name='Url'
            onChange={({ target }) => setUrl(target.value)}
          /> <br/>
          <button id='button-create' onClick={handleCreate}>create</button>
        </div>
      </form>
    </div>
  )
}

export default BlogForm