import { useMutation, useQueryClient  } from "@tanstack/react-query"
import { getAnecdotes, createAnecdote, updateAnecdote } from '../requests'

const AnecdoteForm = ({ anecdotes }) => {
  const queryClient = useQueryClient()
  const newAnecdoteMutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess: (newAnecdote) => {
      //const anecdotes = queryClient.getQueryData({ queryKey: ['anecdotes'] })
      //queryClient.setQueryData({ queryKey: ['anecdotes'] }, anecdotes.concat(newAnecdote))
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
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
