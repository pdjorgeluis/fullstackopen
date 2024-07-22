import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'
import userService from '../services/users'

const userSlice = createSlice({
  name: 'user',
  initialState: null,
  reducers: {
    setUser(state, action) {
      return action.payload
    },
  },
})

export const { setUser, appenUser } = userSlice.actions

export const initializeUser = () => {
  return async (dispatch) => {
    const users = await userService.getAll()

    const loggedUserJSON = window.localStorage.getItem('loggedBloglistAppUser')
    if (loggedUserJSON) {
      const loggedUser = JSON.parse(loggedUserJSON)
      dispatch(setUser({ loggedUser: loggedUser, userList: users }))
      blogService.setToken(loggedUser.token)
    } else {
      dispatch(setUser({ loggedUser: null, userList: users }))
    }
  }
}

export default userSlice.reducer
