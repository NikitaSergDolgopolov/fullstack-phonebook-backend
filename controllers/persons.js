const personsRouter = require('express').Router()
const Person = require('../models/person')
const path = require('path')

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

personsRouter.get('/', async (req, res, next) => {
  try{
    const persons = await Person.find({})
    res.json(persons)
  } catch(error){
    next(error)
  }
  
})

// GET single person
personsRouter.get('/:id', async (req, res, next) => {

  try{
    const person = await Person.findById(req.params.id)
    if (!person) {
      return res.status(404).end()
    }
    res.json(person)
  } catch (error) {
    next(error)
  }
})

// DELETE person
personsRouter.delete('/:id', async (req, res, next) => {
  try{
    await Person.findByIdAndDelete(req.params.id)
    res.status(204).end()
  } catch (error){
    next(error)
  }
})

// POST new person
personsRouter.post('/', async (req, res, next) => {
  try {
    const { name, number } = req.body
    if (!name || !number) {
      return res.status(400).json({ error: 'name or number is missing' })
    }
    const newPerson = new Person({ name, number })
    await newPerson.save()
    res.json(newPerson)
  } catch(error){
    next(error)
  }
})



personsRouter.put('/:id', async (req, res, next) => {
  try {
    const { name, number } = req.body
    const person = await Person.findById(req.params.id)
    if (!person) {
        return res.status(404).end()
    }
    person.name = name
    person.number = number
    await person.save()
    res.json(person)

  } catch(error){
    next(error)
  }
})



module.exports = personsRouter