import { useSelector, useDispatch } from 'react-redux'
import { updateVotes } from '../reducers/anecdoteReducer'
import { setNotification} from '../reducers/notificationReducer'
import Filter from './Filter'

const AnecdoteList = () => {
  const anecdotes = useSelector(state => {
    return state.filter !== ''
      ? state.anecdotes.filter(anecdote => anecdote.content.toLowerCase().includes(state.filter.toLowerCase()))
      : state.anecdotes
  })
  const dispatch = useDispatch()

  const vote = (id, content) => {
    dispatch(updateVotes(id, anecdotes))
    dispatch(setNotification(`you voted '${content}'`, 5))
  }

  const style = {
    marginLeft: 10
  }

  return (
    <div>
      <Filter />
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button style={style} onClick={() => vote(anecdote.id, anecdote.content)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AnecdoteList