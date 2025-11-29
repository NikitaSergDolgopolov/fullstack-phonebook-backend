const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Person = require('../models/person')

const api = supertest(app)


const initialPersons = [
  {
    name: 'Person 1',
    number: '123',
  },
  {
    name: 'Person 2',
    number: '321',
  },
]

beforeEach(async () => {
  await Person.deleteMany({})
  let personObject = new Person(initialPersons[0])
  await personObject.save()
  personObject = new Person(initialPersons[1])
  await personObject.save()
})

test('persons are returned as json', async () => {
  await api
    .get('/api/persons')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all persons are returned', async () => {
  const response = await api.get('/api/persons')
  assert.strictEqual(response.body.length, initialPersons.length)
})

test('person has id field and not _id', async () => {
  const response = await api.get('/api/persons')
  const person = response.body[0]

  // person should have id
  assert.ok(person.id)

  // person should NOT have _id
  assert.strictEqual(person._id, undefined)
})

test('new person is added', async () => {

  let personObject = new Person(
    {
    name: 'Person 3',
    number: '231',
  }
  )
  await personObject.save()
  const response = await api.get('/api/persons')
  assert.strictEqual(response.body.length, initialPersons.length + 1)
})

after(async () => {
  await mongoose.connection.close()
})