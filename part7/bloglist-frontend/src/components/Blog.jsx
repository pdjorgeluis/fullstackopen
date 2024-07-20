import { useState } from 'react'

const Blog = ({ blog, updateBlog, removeBlog, username }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const [visible, setVisible] = useState(false)
  const showWhenVisible = { display: visible ? '' : 'none' }

  const handleLikes = (blogToUpdate) => {
    const newBlog = {
      title: blogToUpdate.title,
      url: blogToUpdate.url,
      likes: blogToUpdate.likes+1,
      user: {
        username: blogToUpdate.user.username,
        name: blogToUpdate.user.name,
        _id: blogToUpdate.user.id
      },
      author: blogToUpdate.author,
      _id: blogToUpdate.id
    }

    updateBlog(blogToUpdate.id, newBlog)
  }

  const handleRemove = (blog) => {
    console.log(blog.id)
    window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)
      ? removeBlog(blog.id) : null
  }

  return(
    <div style={blogStyle}>
      <div className='blog'>
        {blog.title} by {blog.author}
        <button onClick={() => setVisible(!visible)}>
          {visible ? 'hide' : 'view'}
        </button>
        <div className='blogDetails' style={showWhenVisible} >
          {blog.url} <br/>
          {blog.likes} <button onClick={() => handleLikes(blog)}>like</button><br/>
          {blog.user.username}
          {blog.user.username === username
            ? <button onClick={() => handleRemove(blog)}>remove</button> : null}
        </div>

      </div>
    </div>

  )

}

export default Blog