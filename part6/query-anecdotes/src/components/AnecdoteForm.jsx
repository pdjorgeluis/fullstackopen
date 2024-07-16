import { useMutation, useQueryClient  } from "@tanstack/react-query"
import { createAnecdote } from '../requests'
import { useNotificationDispatch } from "../AnecdotesContext"

const AnecdoteForm = () => {
  const dispatch = useNotificationDispatch()
  const queryClient = useQueryClient()

  const newAnecdoteMutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess: (newAnecdote) => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
      dispatch({type:'SHOW', payload: `new anecdote '${newAnecdote.content}'`})
      setTimeout(() => {
        dispatch({type:'HIDE'})
      }, 5000)
    },
    onError: (error) => {
      dispatch({type:'SHOW', payload: `too short anecdote, must have length 5 or more`})
      setTimeout(() => {
        dispatch({type:'HIDE'})
      }, 5000)
    }
  })

  
  const onCreate = async (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    console.log('new anecdote')
    newAnecdoteMutation.mutate({content, votes:0})
  
    
}

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name='anecdote' />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
