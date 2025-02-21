const express = require('express')
const app = express()
require('dotenv').config()

const Person = require('./models/person')

app.use(express.static('dist'))

const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
}

const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }
  
    next(error)
}

const cors = require('cors')

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(cors())
app.use(express.json())
app.use(requestLogger)


app.get('/', (request, response) => {
    response.send('<h1>Hello Phonbook!</h1>')
})

app.get('/info', (request, response) => {
    Person.find({}).then(persons => response.send(`<p>Phonebook has info for ${persons.length} people</p>
                                                   <p>${Date()}</p>`))
})
  
app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => response.json(persons))
})

app.get('/api/persons/:id', (request, response, next) => {
    const id = request.params.id
    Person.findById(id)
        .then(person => {
            if(person) response.json(person)
            else response.status(404).end()
        })
        .catch(error => {
            return next(error)
        })
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
    .then(result => {
        response.json(result) 
    })
    .catch(error => next(error))
})

app.post('/api/persons/', (request, response, next) => {
    const body = request.body
    if(!body.name || !body.number){
        return response.status(400).json({
            error: 'name or number missing'
        })
    }
    
     let found = false;
    Person.find({name: body.name})
        .then(result => {
            if(result.length !== 0){
                return response.status(400).json({
                    error: 'name must be unique' 
                })
            }else{
                const person = new Person({
                    name: body.name,
                    number: body.number
                })

                person.save().then(savedPerson => {
                    console.log('person saved!')
                    response.json(savedPerson)
                })
                .catch(error => {
                    console.log(error)
                    return next(error)
                })
            }
        })
        .catch(error => {
            console.log(error)
            response.status(500).end()
        })
})

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body
  
    const person = {
      name: body.name,
      number: body.number,
    }
  
    Person.findByIdAndUpdate(
        request.params.id, 
        person, 
        { new: true, runValidators: true, context: 'query' }
    )
      .then(updatedPerson => {
        response.json(updatedPerson)
      })
      .catch(error => next(error))
})

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})