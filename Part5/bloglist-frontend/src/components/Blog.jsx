import { useState } from "react"

const Blog = ({ blog, updateBlog }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }
  
  const [visible, setVisible] = useState(false)
  const showWhenVisible = { display: visible ? '' : 'none'}

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

  return(
    <div style={blogStyle}>
      <div>
        {blog.title} by {blog.author}
        <button onClick={()=>setVisible(!visible)}>
          {visible ? 'hide' : 'view'}
        </button>
        <div style={showWhenVisible}>
          {blog.url} <br/>
          {blog.likes} <button onClick={() => handleLikes(blog)}>like</button><br/>
          {blog.user.username}
        </div>
        
      </div> 
    </div>
    
  )
   
}

export default Blog