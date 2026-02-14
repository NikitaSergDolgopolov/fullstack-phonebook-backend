const bcrypt = require('bcryptjs') 
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
//   const users = await User.find({})
  const users = await User
    .find({}).populate('contacts', { name: 1, number: 1 })
  response.json(users)
})

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash,
    contacts: []
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
})

module.exports = usersRouter