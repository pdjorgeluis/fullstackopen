import { useState, useEffect } from 'react'
import personService from './services/persons'
import axios from 'axios'

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

const Persons = ( {personsToShow, onDelete} ) => {
  if(personsToShow)
    return (
    <div>
      {personsToShow.map(person => 
      <p key={person.name}>
        {person.name} {person.number}
        <button onClick={() => onDelete(person)}>delete</button>
      </p>)}
      
    </div>)
  else
    return <div>Phonebook is empty</div> // check this
}


const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')
  //const [personsToShow, setPersonsToShow] = useState({})

  useEffect(() => {
    console.log('effect');
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
      .catch(error => {
        console.log('fail')
      })
  }, [])

  const handleNewNameChange = (event) => {
    setNewName(event.target.value)
  }

  const addPerson = (event) => {
    event.preventDefault()
    if(newName && newNumber){
      const found = persons.find(person => person.name === newName)
      if(!found){
        const id = persons.length + 1
        const newPerson = {name: newName, number: newNumber, id: `${id}`}
        //setPersons(persons.concat(newPerson))
        personService
          .create(newPerson)
          .then(createdPerson => {
            setPersons(persons.concat(createdPerson))
            setNewName('')
            setNewNumber('')
          })
          .catch(error => {
            console.log(error.response.data.error);
          })
      }else{
        if(window.confirm(`${found.name} is already added to phonebook, replace the old number with a new one?`)){
          const newPerson = {name: found.name, number: newNumber, id: found.id}
          personService
            .update(found.id, newPerson)
            .then(updatedPerson => {
              setPersons(persons.map(person => person.id != updatedPerson.id ? person : updatedPerson))
              setNewName('')
              setNewNumber('')
            })
            .catch(error => {
              console.log(`Information of ${found.id} have already been removed from the server`);
            })
        }
      } 
    }else{
      window.alert('Please fill the camps')
    }
  }

  const deletePerson = (id) => {
    personService
      .deletePerson(id)
      .then(deletedPerson => {
        console.log(deletedPerson);
        setPersons(persons.filter(person => person.id != id))
        console.log(`deleted ${deletedPerson.id}`);
      })
      .catch(error => {
        console.log(error.response.data.error);
      })
  }

  const handleNewNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setNewFilter(event.target.value)
    //setPersonsToShow(persons.filter(person => person.name.includes(newFilter)))
  }

  const handleDeletePerson = (person) => {
    console.log('delete clicked' + person.id);
    if(window.confirm(`Delete ${person.name}?`)) deletePerson(person.id) 
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
      <Persons personsToShow={personsToShow} onDelete={handleDeletePerson}/>
    </div>
  )
}

export default App