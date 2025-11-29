const express = require('express')
const mongoose = require('mongoose')
const config = require('./utils/config')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')
const personsRouter = require('./controllers/persons')
const Person = require('./models/person')


const app = express()

logger.info('connecting to', config.MONGODB_URI)

mongoose
  .connect(config.MONGODB_URI, { family: 4 })
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connection to MongoDB:', error.message)
  })

app.use(express.static('dist'))
app.use(express.json())
app.use(middleware.requestLogger)

app.use('/api/persons', personsRouter)

// GET info
app.get('/info', async (req, res, next) => {
  try {
    const count = await Person.countDocuments({})
    const currentTime = new Date()

    res.send(`
      <p>Phonebook has info for ${count} people</p>
      <p>${currentTime}</p>
    `)
  } catch (error) {
    next(error)
  }
})

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)




module.exports = app