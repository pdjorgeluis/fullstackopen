import { useState, useEffect, useRef } from 'react'
import { useNotificationDispatch } from './NotificationContext'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useUserDispatch, useUserValue } from './UserContext'

import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'

import Notification from './components/Notification'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  //const [user, setUser] = useState(null)

  //const queryClient = useQueryClient()
  const dispatchNotification = useNotificationDispatch()
  const user = useUserValue()
  const dispatchUser = useUserDispatch()

  const blogFormRef = useRef()

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistAppUser')
    if (loggedUserJSON) {
      const userToLogIn = JSON.parse(loggedUserJSON)
      dispatchUser({ type: 'SAVE', payload: userToLogIn })
      blogService.setToken(userToLogIn.token)
    }
  }, [])

  const result = useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll,
    refetchOnWindowFocus: false,
    retry: 1,
  })

  useEffect(() => {
    /*blogService.getAll().then((blogs) => {
      blogs.sort((a, b) => b.likes - a.likes)
      setBlogs(blogs)
    })*/
    if (result.data) setBlogs(result.data.sort((a, b) => b.likes - a.likes))
  }, [result])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem(
        'loggedBloglistAppUser',
        JSON.stringify(user)
      )
      blogService.setToken(user.token)
      dispatchUser({ type: 'SAVE', payload: user })
      setUsername('')
      setPassword('')
      dispatchNotification({ type: 'SHOW', payload: `Logged in ${user.name}` })
      setTimeout(() => {
        dispatchNotification({ type: 'HIDE' })
      }, 5000)
    } catch (exception) {
      console.log(exception.message)
      dispatchNotification({ type: 'SHOW', payload: 'wrong credentials' })
      setTimeout(() => {
        dispatchNotification({ type: 'HIDE' })
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBloglistAppUser')
    dispatchUser({ type: 'SAVE', payload: null })
    setUsername('')
    setPassword('')
    dispatchNotification({ type: 'SHOW', payload: `Logged out ${user.name}` })
    setTimeout(() => {
      dispatchNotification({ type: 'HIDE' })
    }, 5000)
  }

  /*  const createBlog = async (blogObject) => {
     try {
      const createdBlog = await blogService.create(blogObject)
      const cblogs = await blogService.getAll()
      setBlogs(cblogs.sort((a, b) => b.likes - a.likes))
      dispatchNotification({
        type: 'SHOW',
        payload: `a new blog ${createdBlog.title} by ${createdBlog.author} added`,
      })
      setTimeout(() => {
        dispatchNotification({ type: 'HIDE' })
      }, 5000)
    } catch (exception) {
      console.log(exception.message)
      dispatchNotification({ type: 'SHOW', payload: exception.message })
      setTimeout(() => {
        dispatchNotification({ type: 'HIDE' })
      }, 5000)
    }
  }*/

  /*const updateBlog = async (id, blogObject) => {
    try {
      const updatedBlog = await blogService.update(id, blogObject)

      const ublogs = await blogService.getAll()
      setBlogs(ublogs.sort((a, b) => b.likes - a.likes))
      dispatchNotification({
        type: 'SHOW',
        payload: `likes in blog ${updatedBlog.title} updated`,
      })
      setTimeout(() => {
        dispatchNotification({ type: 'HIDE' })
      }, 5000)
    } catch (exception) {
      dispatchNotification({ type: 'SHOW', payload: exception.message })
      setTimeout(() => {
        dispatchNotification({ type: 'HIDE' })
      }, 5000)
    }
  }

  const removeBlog = async (id) => {
    try {
      console.log('the id ', id)
      const deletedBlog = await blogService.deleteBlog(id)
      const dblogs = await blogService.getAll()

      setBlogs(dblogs.sort((a, b) => b.likes - a.likes))
      dispatchNotification({
        type: 'SHOW',
        payload: `Removed blog ${deletedBlog.title}`,
      })
      setTimeout(() => {
        dispatchNotification({ type: 'HIDE' })
      }, 5000)
    } catch (exception) {
      dispatchNotification({ type: 'SHOW', payload: exception.message })
      setTimeout(() => {
        dispatchNotification({ type: 'HIDE' })
      }, 5000)
    }
  }*/

  const loginForm = () => {
    if (user === null) {
      return (
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

  if (result.isLoading) {
    return <div>loading data...</div>
  }

  if (result.isError) {
    return (
      <span>
        blogs service is not available due to problems in server
        <br />
        Error: {result.error.message}
      </span>
    )
  }

  //const blogsFromQuery = result.data

  return (
    <div>
      <Notification />
      {!user && loginForm()}
      {user && (
        <div>
          <h2>blogs</h2>
          <p>
            {user.name} logged in <button onClick={handleLogout}>logout</button>
          </p>

          <Togglable buttonLabel="new blog" ref={blogFormRef}>
            <BlogForm />
          </Togglable>

          {blogs.map((blog) => (
            <Blog key={blog.id} blog={blog} username={user.username} />
          ))}
        </div>
      )}
    </div>
  )
}

export default App
