import { useState, useEffect, useRef } from 'react'
import { useNotificationDispatch } from './NotificationContext'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useUserDispatch, useUserValue } from './UserContext'

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useMatch,
} from 'react-router-dom'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import userService from './services/users'

import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'

import Notification from './components/Notification'

import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableContainer,
  Paper,
  TableHead,
} from '@mui/material'

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
  if (!selectedUser) {
    return null
  }
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
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [userList, setUserList] = useState([])

  const dispatchNotification = useNotificationDispatch()
  const user = useUserValue()
  const dispatchUser = useUserDispatch()

  const blogFormRef = useRef()

  const userMatch = useMatch('/users/:id')
  const blogMatch = useMatch('/blogs/:id')

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistAppUser')
    if (loggedUserJSON) {
      const userToLogIn = JSON.parse(loggedUserJSON)
      dispatchUser({ type: 'SAVE', payload: userToLogIn })
      blogService.setToken(userToLogIn.token)
    }
    userService.getAll().then((u) => setUserList(u))
  }, [])

  const result = useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll,
    refetchOnWindowFocus: false,
    retry: 1,
  })

  useEffect(() => {
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

  const displayUsers = () => {
    if (user !== null) {
      if (userList !== null) {
        return (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell>blogs created</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {userList.map((user) => (
                  <TableRow key={user.username}>
                    <TableCell>
                      <Link to={`/users/${user.id}`}>{user.name}</Link>
                    </TableCell>
                    <TableCell>{user.blogs.length}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )
      }
      return <div>No users</div>
    }
  }

  const selectedUser = userMatch
    ? userList.find((u) => u.id === userMatch.params.id)
    : null

  const selectedBlog = blogMatch
    ? blogs.find((b) => b.id === blogMatch.params.id)
    : null

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

  return (
    <Container>
      <div>
        <Notification />
        {!user && loginForm()}
        {user && userList && (
          <div>
            <h2>blogs</h2>
            <Menu user={user.name} onLogout={handleLogout} />
            <Routes>
              <Route
                path="/"
                element={
                  <div>
                    <Togglable buttonLabel="new blog" ref={blogFormRef}>
                      <BlogForm />
                    </Togglable>
                    {blogs.map((blog) => (
                      <div
                        key={blog.id}
                        style={{
                          paddingTop: 10,
                          paddingLeft: 2,
                          border: 'solid',
                          borderWidth: 1,
                          marginBottom: 5,
                        }}
                      >
                        <Link to={`/blogs/${blog.id}`}>
                          {blog.title} by {blog.author}
                        </Link>
                      </div>
                    ))}
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
                  selectedBlog && <Blog blog={selectedBlog} user={user} />
                }
              />
            </Routes>
          </div>
        )}
      </div>
    </Container>
  )
}

export default App
