import { useState } from 'react'

const H1Text = ( {text} ) => {
  return <h1>{text}</h1>
}

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]
   
  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState(new Array(8).fill(0))
  const [mostVoted, setMostVoted] = useState({max:0, pos:0})

  const setToSelected = ()=> {
    const sel = Math.floor(Math.random() * 8);
    setSelected(sel);
  }

  const setToVotes = ()=> {
    const copyOfVotes = [...votes]
    copyOfVotes[selected] += 1
    setVotes(copyOfVotes)
    if(mostVoted.max < copyOfVotes[selected]){
      const newMostVoted = {...mostVoted}
      newMostVoted.max = copyOfVotes[selected]
      newMostVoted.pos = selected
      setMostVoted(newMostVoted)
    }
      
  }

  return (
    <div>
      <H1Text text='Anecdote of the day' />
      {anecdotes[selected]} <br/>
      <button onClick={setToVotes}>vote</button>
      <button onClick={setToSelected}>next anecdote</button>
      <H1Text text='Anecdote with the most votes' />
      <p>{anecdotes[mostVoted.pos]}  has {mostVoted.max} votes</p>
    </div>
  )
}

export default App
