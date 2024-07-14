import ReactDOM from 'react-dom/client'

import { createStore, combineReducers } from 'redux'
import { Provider } from 'react-redux'
import { filterChange } from './reducers/filterReducer'

import App from './App'
import anecdoteReducer from './reducers/anecdoteReducer'
import filterReducer from './reducers/filterReducer'

const reducer = combineReducers({
  anecdotes: anecdoteReducer,
  filter: filterReducer
})

const store = createStore(reducer)
//console.log(store.getState())
//store.dispatch(filterChange('THE FILTER'))


ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>
)