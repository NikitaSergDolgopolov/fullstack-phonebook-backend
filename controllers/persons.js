const personsRouter = require('express').Router()
const Person = require('../models/person')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const path = require('path')

//sample data

// let persons = [
//   { id: 1, name: "Arto Hellas", number: "040-123456" },
//   { id: 2, name: "Ada Lovelace", number: "39-44-5323523" },
//   { id: 3, name: "Dan Abramov", number: "12-43-234345" },
//   { id: 4, name: "Mary Poppendieck", number: "39-23-6423122" }
// ]

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}


personsRouter.get('/', async (req, res, next) => {
  try{
    // const persons = await Person.find({})
    const persons = await Person
    .find({}).populate('user', { username: 1, name: 1 })
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
    const { name, number, userId } = req.body

    // const user = await User.findById(userId)
    const decodedToken = jwt.verify(getTokenFrom(req), process.env.SECRET)
    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token invalid' })
    }
    const user = await User.findById(decodedToken.id)

    if (!user) {
      return res.status(400).json({ error: 'userId missing or not valid' })
    }

    if (!name || !number) {
      return res.status(400).json({ error: 'name or number is missing' })
    }

    const newPerson = new Person({ name, number, user: userId })
    const savedContact = await newPerson.save()
    
    user.contacts = user.contacts.concat(savedContact._id)
    await user.save()
    
    res.status(201).json(savedContact)

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