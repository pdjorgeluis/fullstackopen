import { useState } from 'react'

const Header = ( {text} ) => {
  return <h2>{text}</h2>
}

const Input = ( {text, value, onChange}) => {
  return  <div>{text} <input value={value} onChange={onChange} /></div>
}

const Filter = ( {newFilter, onFilterChange} ) => {
  return <Input text={'filter shown with'} value={newFilter} onChange={onFilterChange} />
}

const PersonForm = ({onSubmit, newName, newNumber, onNewNameChange, onNewNumberChange}) => {
  //<Input text={'name'} value={newName} onChange={handleNewNameChange} />
        //<Input text={'number'} value={newNumber} onChange={handleNewNumberChange} />
  return(
    <div>
      <form onSubmit={onSubmit}>
      name <input value={newName} onChange={onNewNameChange} /> <br/>
      number <input value={newNumber} onChange={onNewNumberChange} />
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    </div>
  )
}

const Persons = ( {personsToShow} ) => {
  if(personsToShow)
    return <div>{personsToShow.map(person => <p key={person.name}>{person.name} {person.number}</p>)}</div>
  else
    return <div>Phonebook is empty</div> // check this
}


const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')
  //const [personsToShow, setPersonsToShow] = useState({})

  const handleNewNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNewNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setNewFilter(event.target.value)
    //setPersonsToShow(persons.filter(person => person.name.includes(newFilter)))
  }
  
  const addPerson = (event) => {
    event.preventDefault()
    if(newName && newNumber){
      if(!persons.find(person => person.name === newName)){
        const id = persons.length + 1
        const newPerson = {name: newName, number: newNumber, id: id}
        setPersons(persons.concat(newPerson))
      }else{
        window.alert(`${newName} is already added to phonebook`)
      } 
    }else{
      window.alert('Please fill the camps')
    }
    
    setNewName('')
    setNewNumber('')
  }

  const personsToShow = newFilter !== ''
    ? persons.filter(person => person.name.toLowerCase().includes(newFilter.toLowerCase()))
    : persons

  return (
    <div>
      <Header text={'Phonebook'} />
      <Filter newFilter={newFilter} onFilterChange={handleFilterChange} />
      <Header text={'add a new'} />
      <PersonForm onSubmit={addPerson} newName={newName} newNumber={newNumber} onNewNameChange={handleNewNameChange} onNewNumberChange={handleNewNumberChange} />
      <Header text={'Numbers'} />
      <Persons personsToShow={personsToShow} />
    </div>
  )
}

export default App