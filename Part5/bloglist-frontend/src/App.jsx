import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [message, setMessage] = useState(null)


  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistAppUser')
    if(loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])


  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBloglistAppUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      setMessage({ text:`Logged in ${user. name}`, typeOfMessage: 'notification' })
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    } catch (exception) {
      console.log(exception.message);
      setMessage({ text:'wrong username or password', typeOfMessage: 'error'})
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBloglistAppUser')
    setUser(null)
    setUsername('')
    setPassword('')
    setMessage({ text:`Logged out ${user. name}`, typeOfMessage: 'notification' })
    setTimeout(() => {
      setMessage(null)
    }, 5000)
    
  }

  const handleCreate = async (event) => {
    event.preventDefault()
    if (title && author && url){
      try {
        const blogObject = {
          title: title,
          author: author, //change to user.name?
          url: url
        }

        const createdBlog = await blogService.create(blogObject)
        setBlogs(blogs.concat(createdBlog))

        setMessage({
                      text: `a new blog ${createdBlog.title} by ${createdBlog.author} added`, 
                      typeOfMessage: 'notification'
                    })
        setTimeout(() => {
          setMessage(null)
        }, 5000)
        
      } catch (exception) {
        console.log(exception.message);
        setMessage({ text: exception.message, typeOfMessage: 'error' })
        setTimeout(() => {
          setMessage(null)
        }, 5000)
      }
      setTitle('')
      setAuthor('')
      setUrl('')
    }else{
      setMessage({ text: 'fill all the fields', typeOfMessage: 'error' })
        setTimeout(() => {
          setMessage(null)
        }, 5000)
    }
    
  }

  const loginForm = () => {
    if (user === null){
      return(
        <div>
          <h2>Log in to application</h2>
          <form onSubmit={handleLogin}>
            <div>
              username
                <input
                type='text'
                value={username}
                name='Username'
                onChange={({target}) => setUsername(target.value)}
                /> <br/>
              password
                <input
                type='password'
                value={password}
                name='Password'
                onChange={({target}) => setPassword(target.value)}
                /> <br/>
            </div>
            <button type='submit'>login</button>
          </form>
        </div>        
      )
    }
    return (
      <div>
        <h2>blogs</h2>
        <p>
          {user.name} logged in 
          <button onClick={handleLogout}>
            logout
          </button>
        </p>

        {blogForm()}

        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} />
        )}
      </div>
    )
    
  }

  const blogForm = () => (
    <div>
      <h2>create new</h2>
      <form onSubmit={handleCreate}>
        <div>
          title:
            <input
            type='text'
            value={title}
            name='Title'
            onChange={({target}) => setTitle(target.value)}
            /> <br/>
            author:
            <input
            type='text'
            value={author}
            name='Author'
            onChange={({target}) => setAuthor(target.value)}
            /> <br/>
            url:
            <input
            type='text'
            value={url}
            name='Url'
            onChange={({target}) => setUrl(target.value)}
            /> <br/>
            <button onClick={handleCreate}>create</button>
        </div>    
      </form>
    </div>
  )

  const messages = () => {
    if(message !== null){
      return (
        <p className={message.typeOfMessage}>{message.text}</p>
      )
    }
  }

  return (
    <div>
      {messages()}
      {loginForm()}
    </div>
    
  )
}

export default App