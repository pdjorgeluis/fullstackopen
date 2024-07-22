import { useState, useEffect, useRef } from 'react'
import BlogList from './components/BlogList'
import blogService from './services/blogs'
import loginService from './services/login'

import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import Notification from './components/Notification'
import UserList from './components/UserList'

import { useSelector, useDispatch } from 'react-redux'
import { setNotification } from './reducers/notificationReducer'
import { initializeBlogs } from './reducers/blogReducer'
import { initializeUser } from './reducers/userReducer'
import { setUser } from './reducers/userReducer'

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
  useParams,
  useNavigate,
  useMatch,
} from 'react-router-dom'

const Menu = ({ user, onLogout }) => {
  const padding = {
    paddingRight: 5,
  }
  return (
    <div>
      <Link style={padding} to="/blogs">
        blogs
      </Link>
      <Link style={padding} to="/users">
        users
      </Link>
      {user.name} logged in <button onClick={onLogout}>logout</button>
    </div>
  )
}

const App = () => {
  const user = useSelector((state) => state.user)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const blogFormRef = useRef()
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initializeUser())
  }, [])

  useEffect(() => {
    dispatch(initializeBlogs())
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem(
        'loggedBloglistAppUser',
        JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      dispatch(setNotification(`Logged in ${user.name}`, 5))
    } catch (exception) {
      console.log(exception.message)
      dispatch(setNotification('wrong credentials', 5))
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBloglistAppUser')
    setUser(null)
    setUsername('')
    setPassword('')
    dispatch(setNotification(`Logged out ${user.name}`, 5))
  }

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

  return (
    <div>
      <Notification />
      {!user && loginForm()}
      {user && (
        <div>
          <h2>blogs</h2>

          <Menu user={user} onLogout={handleLogout} />
          <Routes>
            <Route
              path="/blogs"
              element={
                <div>
                  <Togglable buttonLabel="new blog" ref={blogFormRef}>
                    <BlogForm />
                  </Togglable>
                  <BlogList user={user} />
                </div>
              }
            />
            <Route
              path="/users"
              element={
                <div>
                  <h2>Users</h2>
                  <UserList />
                </div>
              }
            />
          </Routes>
        </div>
      )}
    </div>
  )
}

export default App
