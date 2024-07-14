import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: 'notification',
  initialState: '',
  reducers: {
    showNotification: {
      reducer: (state, action) => {
        console.log(state)
        const newState = action.payload
        return newState
      },
      prepare: (content) => {
        const text = 'you voted '
        return {
          payload: text.concat(content) 
        }
      },
    },
    hideNotification: {
      reducer: (state, action) => {
        return ''
      },
      /*prepare: () => {

      }*/
    }
  }
})

export const { showNotification, hideNotification } = notificationSlice.actions
export default notificationSlice.reducer