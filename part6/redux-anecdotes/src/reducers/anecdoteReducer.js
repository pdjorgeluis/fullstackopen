import { createSlice } from "@reduxjs/toolkit"
import anecdoteService from '../services/anecdotes'

const anecdotesAtStart = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]

const getId = () => (100000 * Math.random()).toFixed(0)

const asObject = (anecdote) => {
  return {
    content: anecdote,
    id: getId(),
    votes: 0
  }
}

const initialState = anecdotesAtStart.map(asObject)

const anecdoteSlice = createSlice({
  name: 'anecdote',
  initialState: [],
  reducers: {
    voteFor(state, action) {
      const id = action.payload
      const anecdoteToVote = state.find(n => n.id === id)
      const changedAnecdote = {...anecdoteToVote, votes: anecdoteToVote.votes + 1}
      const newState = state.map(anecdote => anecdote.id !== id ? anecdote : changedAnecdote)
      return [...newState].sort((a, b) => b.votes - a.votes)
    },
    appendAnecdote(state, action) {
      state.push(action.payload)
    },
    setAnecdotes(state, action){
      return action.payload
    }
  }
})

export const { voteFor, appendAnecdote, setAnecdotes } = anecdoteSlice.actions

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll() 
    dispatch(setAnecdotes([...anecdotes].sort((a, b) => b.votes - a.votes)))
  }
}

export const createAnecdote = content => {
  return async dispatch => {
    const newAnecdote =  await anecdoteService.createNew(content)
    dispatch(appendAnecdote(newAnecdote))
  }
}

export const updateVotes = (id, anecdotes) => {
  return async dispatch => {
    const anecdoteToVote = anecdotes.find(n => n.id === id)
    const changedAnecdote = await anecdoteService.update(id, {...anecdoteToVote, votes: anecdoteToVote.votes + 1})
    const newAnecdotes = anecdotes.map(anecdote => anecdote.id !== id ? anecdote : changedAnecdote)
    dispatch(setAnecdotes([...newAnecdotes].sort((a, b) => b.votes - a.votes)))
  }
}

export default anecdoteSlice.reducer