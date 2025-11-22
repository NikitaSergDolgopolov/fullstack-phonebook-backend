const mongoose = require('mongoose')
const express = require('express')
const app = express()
const cors = require('cors') //new
const morgan = require('morgan')
const path = require('path')

// Middleware
app.use(express.json()) // for parsing JSON bodies
app.use(morgan('tiny')) // logs requests to console
app.use(cors()) //new
app.use(express.static('dist')) //new

//MongoDB Atlas

const password = process.argv[2]
const url = `mongodb+srv://nikitasergdolgopolov_db_user:${password}@cluster0.a6voz28.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)
mongoose.connect(url)

// 3. Person model
const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)


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
  const numPeople = persons.length
  const currentTime = new Date()
  res.send(`
    <p>Phonebook has info for ${numPeople} people</p>
    <p>${currentTime}</p>
  `)
})

// GET single person
app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(p => p.id === id)

  if (person) {
    res.json(person)
  } else {
    res.status(404).json({ error: 'Person not found' })
  }
})

// DELETE person
app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(p => p.id !== id)
  res.status(204).end()
})

// POST new person
app.post('/api/persons', (req, res) => {
  const { name, number } = req.body

  if (!name || !number) {
    return res.status(400).json({ error: 'name or number is missing' })
  }

  if (persons.find(p => p.name === name)) {
    return res.status(400).json({ error: 'name must be unique' })
  }

  const newPerson = {
    id: Math.floor(Math.random() * 1000000),
    name,
    number
  }

  persons = persons.concat(newPerson)
  res.status(201).json(newPerson)
})

app.use((req, res, next) => {
  res.sendFile(path.resolve(__dirname, 'dist', 'index.html'))
})

// 404 handler
const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

// Start server
// const PORT = 3001
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`)
// })

 //new
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})