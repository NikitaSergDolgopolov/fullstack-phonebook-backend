//should be first
require('dotenv').config()

const express = require('express')
const Person = require('./models/person')
console.log(Person)  // <-- what does this print?
const app = express()
const cors = require('cors') //new
const morgan = require('morgan')
const path = require('path')

// Middleware
app.use(express.json()) // for parsing JSON bodies, has to be among first
app.use(morgan('tiny')) // logs requests to console
app.use(cors()) //new
app.use(express.static('dist')) //new


//sample data

// let persons = [
//   { id: 1, name: "Arto Hellas", number: "040-123456" },
//   { id: 2, name: "Ada Lovelace", number: "39-44-5323523" },
//   { id: 3, name: "Dan Abramov", number: "12-43-234345" },
//   { id: 4, name: "Mary Poppendieck", number: "39-23-6423122" }
// ]


// GET all persons
// app.get('/api/persons', (req, res) => {
//   res.json(persons)
// })

app.get('/api/persons', (req, res) => {
   Person.find({}).then(persons => {
    res.json(persons)
  })
})


// GET info
app.get('/info', (req, res) => {
  Person.countDocuments({}).then(count => {
    const currentTime = new Date()
    res.send(`
      <p>Phonebook has info for ${count} people</p>
      <p>${currentTime}</p>
    `)
  })
})

// GET single person
app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => {
      if (person) {
        res.json(person)
      } else {
        res.status(404).end()
      }
    })
    .catch(error => next(error))
//     .catch(error => {
//       console.log(error)
//       response.status(400).send({ error: 'malformatted id' })
//     })
})

// DELETE person
app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(result => {
      res.status(204).end()
    })
    .catch(error => next(error))
})

// POST new person
app.post('/api/persons', (req, res, next) => {
  const { name, number } = req.body

  if (!name || !number) {
    return res.status(400).json({ error: 'name or number is missing' })
  }

  const newPerson = new Person({ name, number })

  newPerson
    .save()
    .then(savedPerson => {
      res.json(savedPerson)
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
  const { name, number } = req.body

  Person.findById(req.params.id)
    .then(person => {
      if (!person) {
        return res.status(404).end()
      }

      person.name = name
      person.number = number

      return person.save().then((updatedPerson) => {
        res.json(updatedPerson)
      })
    })
    .catch(error => next(error))
})


//Express 5 no longer supports app.get('*', ..)
app.use((req, res) => {
  res.sendFile(path.resolve(__dirname, 'dist', 'index.html'))
})

// 404 handler
const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)


const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}
app.use(errorHandler) //has to be last


// Start server
// const PORT = 3001
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`)
// })

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})