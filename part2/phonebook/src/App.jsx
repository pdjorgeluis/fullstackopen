import { useState, useEffect } from 'react'
import personService from './services/persons'

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
    return (
    <div>
      {personsToShow.map(person => 
      <p key={person.name}>
        {person.name} {person.number}
        <button onClick={() => onDelete(person)}>delete</button>
      </p>)}
      
    </div>)
}

const Notification = ({ message, messageStyle }) => {
  if(message === null) {
    return null
  }
  return (
    <div className={messageStyle}>
      {message}
    </div>
  )  
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')
  const [errorMessage, setErrorMessage] = useState('some error happened...')
  const [messageStyle, setMessageStyle] = useState('')

  useEffect(() => {
    console.log('effect');
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
      .catch(error => {
        console.log(error.response.data.error);
        setMessageStyle('error')
        setErrorMessage(
          `Error: ${error.response.data.error}`
        )
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
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
        personService
          .create(newPerson)
          .then(createdPerson => {
            setPersons(persons.concat(createdPerson))
            setNewName('')
            setNewNumber('')
            setMessageStyle('notification')
            setErrorMessage(
              `Added ${createdPerson.name}`
            )
            setTimeout(() => {
              setErrorMessage(null)
            }, 5000)
          })
          .catch(error => {
            console.log(error.response.data.error);
            setMessageStyle('error')
            setErrorMessage(
              `Error: ${error.response.data.error}`
            )
            setTimeout(() => {
              setErrorMessage(null)
            }, 5000)
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
              setMessageStyle('notification')
              setErrorMessage(
                `Updated number of ${updatedPerson.name}`
              )
              setTimeout(() => {
                setErrorMessage(null)
              }, 5000)
            })
            .catch(error => {
              console.log(error.response.data.error);
              setMessageStyle('error')
              setErrorMessage(
                `Information of ${found.name} have already been removed from the server`
              )
              setTimeout(() => {
                setErrorMessage(null)
              }, 5000)
            })
        }
      } 
    }else{
      window.alert('Please fill the fields')
    }
  }

  const deletePerson = (id) => {
    personService
      .deletePerson(id)
      .then(deletedPerson => {
        setPersons(persons.filter(person => person.id != deletedPerson.id))
        setMessageStyle('notification')
        setErrorMessage(
          `Deleted ${deletedPerson.name}`
        )
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      })
      .catch(error => {
        console.log(error.response.data.error);
        setMessageStyle('error')
        setErrorMessage(
          `Error: ${error.response.data.error}`
        )
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      })
  }

  const handleNewNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setNewFilter(event.target.value)
  }

  const handleDeletePerson = (person) => {
    if(window.confirm(`Delete ${person.name}?`)) 
      deletePerson(person.id) 
  }

  const personsToShow = newFilter !== ''
    ? persons.filter(person => person.name.toLowerCase().includes(newFilter.toLowerCase()))
    : persons

  return (
    <div>
      <Header text={'Phonebook'} />
      <Notification message={errorMessage} messageStyle={messageStyle} />
      <Filter newFilter={newFilter} onFilterChange={handleFilterChange} />
      <Header text={'add a new'} />
      <PersonForm onSubmit={addPerson} newName={newName} newNumber={newNumber} onNewNameChange={handleNewNameChange} onNewNumberChange={handleNewNumberChange} />
      <Header text={'Numbers'} />
      <Persons personsToShow={personsToShow} onDelete={handleDeletePerson}/>
    </div>
  )
}

export default App