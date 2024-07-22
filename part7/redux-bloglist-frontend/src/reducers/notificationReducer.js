import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: '',
  reducers: {
    showNotification(state, action) {
      console.log(state)
      const newState = action.payload
      return newState
    },
    hideNotification(state, action) {
      return ''
    },
  },
})

export const { showNotification, hideNotification } = notificationSlice.actions
export const setNotification = (content, seconds) => {
  return (dispatch) => {
    dispatch(showNotification(content))
    setTimeout(() => {
      dispatch(hideNotification())
    }, seconds * 1000)
  }
}

export default notificationSlice.reducer
