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
  useMatch,
} from 'react-router-dom'
import Blog from './components/Blog'

const Menu = ({ user, onLogout }) => {
  const padding = {
    paddingRight: 5,
  }
  return (
    <div style={{ backgroundColor: 'lightgrey' }}>
      <Link style={padding} to="/">
        blogs
      </Link>
      <Link style={padding} to="/users">
        users
      </Link>
      {user && (
        <>
          {user.name} logged in <button onClick={onLogout}>logout</button>
        </>
      )}
    </div>
  )
}

const SelectedUser = ({ selectedUser }) => {
  return (
    <div>
      <h2>{selectedUser.name}</h2>
      <h3>added blogs</h3>
      {selectedUser.blogs.length
        ? selectedUser.blogs.map((blog) => <li key={blog.id}>{blog.title}</li>)
        : 'No blogs added'}
    </div>
  )
}

const App = () => {
  const user = useSelector((state) => state.user)
  const blogs = useSelector((state) => state.blogs)

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
      const userToLogIn = await loginService.login({ username, password })
      window.localStorage.setItem(
        'loggedBloglistAppUser',
        JSON.stringify(userToLogIn)
      )
      blogService.setToken(userToLogIn.token)
      dispatch(setUser({ ...user, loggedUser: userToLogIn }))
      setUsername('')
      setPassword('')
      dispatch(setNotification(`${userToLogIn.name} logged in`, 5))
    } catch (exception) {
      console.log(exception.message)
      dispatch(setNotification('wrong credentials', 5))
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBloglistAppUser')
    dispatch(setUser({ ...user, loggedUser: null }))
    setUsername('')
    setPassword('')
    dispatch(setNotification(`Logged out ${user.loggedUser.name}`, 5))
  }

  const loginForm = () => {
    if (user && user.loggedUser === null) {
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

  const displayUsers = () => {
    if (user !== null) {
      if (user.userList !== null) {
        return <UserList userList={user.userList} />
      }
    }
    return <div>No users</div>
  }

  const userMatch = useMatch('/users/:id')
  const blogMatch = useMatch('/blogs/:id')

  const selectedUser = userMatch
    ? user.userList.find((u) => u.id === userMatch.params.id)
    : null

  const selectedBlog = blogMatch
    ? blogs.find((b) => b.id === blogMatch.params.id)
    : null

  return (
    <div className="container">
      <Notification />
      {user && !user.loggedUser && loginForm()}
      {user && user.loggedUser && (
        <div>
          <h2>blogs</h2>
          <Menu user={user.loggedUser} onLogout={handleLogout} />
          <Routes>
            <Route
              path="/"
              element={
                <div>
                  <Togglable buttonLabel="new blog" ref={blogFormRef}>
                    <BlogForm />
                  </Togglable>
                  <BlogList user={user.loggedUser} />
                </div>
              }
            />
            <Route
              path="/users"
              element={
                <div>
                  <h2>Users</h2>
                  {displayUsers()}
                </div>
              }
            />
            <Route
              path="/users/:id"
              element={<SelectedUser selectedUser={selectedUser} />}
            />
            <Route
              path="/blogs/:id"
              element={
                <Blog
                  blog={selectedBlog}
                  user={user.loggedUser}
                  scope="ROUTES"
                />
              }
            />
          </Routes>
        </div>
      )}
    </div>
  )
}

export default App
