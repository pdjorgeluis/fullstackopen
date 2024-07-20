import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

import Alert from './components/Alert'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [alert, setAlert] = useState(null)

  const blogFormRef = useRef()

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistAppUser')
    if(loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  useEffect(() => {
    blogService.getAll().then(blogs => {
      blogs.sort((a, b) => b.likes - a.likes)
      setBlogs( blogs )
    }

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
      setAlert({ message:`Logged in ${user. name}`, typeOfAlert: 'notification' })
      setTimeout(() => {
        setAlert(null)
      }, 5000)
    } catch (exception) {
      console.log(exception.message)
      setAlert({ message:'wrong credentials', typeOfAlert: 'error' })
      setTimeout(() => {
        setAlert(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBloglistAppUser')
    setUser(null)
    setUsername('')
    setPassword('')
    setAlert({ message:`Logged out ${user. name}`, typeOfAlert: 'notification' })
    setTimeout(() => {
      setAlert(null)
    }, 5000)

  }

  const createBlog = async (blogObject) => {
    try {
      const createdBlog = await blogService.create(blogObject)
      const cblogs = await blogService.getAll()
      setBlogs(cblogs.sort((a, b) => b.likes - a.likes))
      setAlert({
        message: `a new blog ${createdBlog.title} by ${createdBlog.author} added`,
        typeOfAlert: 'notification'
      })
      setTimeout(() => {
        setAlert(null)
      }, 5000)

    } catch (exception) {
      console.log(exception.message)
      setAlert({ alert: exception.alert, typeOfMessage: 'error' })
      setTimeout(() => {
        setAlert(null)
      }, 5000)
    }

  }

  const updateBlog = async (id, blogObject) => {
    try {
      const updatedBlog = await blogService.update(id, blogObject)

      const ublogs = await blogService.getAll()
      setBlogs( ublogs.sort((a, b) => b.likes - a.likes))
      setAlert({
        message: `likes in blog ${updatedBlog.title} updated`,
        typeOfAlert: 'notification'
      })
      setTimeout(() => {
        setAlert(null)
      }, 5000)
    } catch (exception) {
      setAlert({ alert: exception.message, typeOfMessage: 'error' })
      setTimeout(() => {
        setAlert(null)
      }, 5000)
    }
  }

  const removeBlog = async (id) => {
    try {
      console.log('the id ',id)
      const deletedBlog = await blogService.deleteBlog(id)
      const dblogs = await blogService.getAll()

      setBlogs(dblogs.sort((a, b) => b.likes - a.likes))
      setAlert({
        message: `Removed blog ${deletedBlog.title}`,
        typeOfAlert: 'notification'
      })
      setTimeout(() => {
        setAlert(null)
      }, 5000)
    } catch (exception) {
      setAlert({ alert: exception.message, typeOfMessage: 'error' })
      setTimeout(() => {
        setAlert(null)
      }, 5000)
    }
  }

  const loginForm = () => {

    if (user === null){
      return(
        <LoginForm
          handleSubmit={handleLogin}
          setUsername={setUsername}
          setPassword={setPassword}
          username={username}
          password={password}
        />
      )
    }
  }

  return (
    <div>
      <Alert alert={alert} />
      {!user && loginForm()}
      {user && <div>
        <h2>blogs</h2>
        <p>
          {user.name} logged in <button onClick={handleLogout}>logout</button>
        </p>

        <Togglable buttonLabel='new blog' ref={blogFormRef}>
          <BlogForm createBlog={createBlog} setAlert={setAlert} />
        </Togglable>

        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog}
            updateBlog={updateBlog}
            removeBlog={removeBlog}
            username={user.username}
          />
        )}
      </div>
      }
    </div>
  )
}

export default App