const { test, describe, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const bcrypt = require('bcrypt')

const helper = require('./test_helper')

const User = require('../models/user')


describe('when there is one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })
    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'lajito',
      name: 'Matti Luukkainen',
      password: 'passwordHash'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    assert(usernames.includes(newUser.username))
  })
})

describe('when there are initially some users saved', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    await User.insertMany(helper.initialUsers)
  })

  

  test('invalid user is not created if username is shorter than 3 characters and return code', async () => {
    const usersAtStart = await helper.usersInDb()
    const newUser = {
      username: 'la',
      name: 'lajito prieto',
      password: 'aloho'
    }
    const savedUser = 
      await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
    
    assert.strictEqual(JSON.parse(savedUser.text).error,'User validation failed: username: Path `username` (`la`) is shorter than the minimum allowed length (3).')
  })

  test('invalid user is not created if password is shorter than 3 characters and return code', async () => {
    const usersAtStart = await helper.usersInDb()
    const newUser = {
      username: 'lajito',
      name: 'lajito prieto',
      password: 'al'
    }
    
    const savedUser = 
      await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
 
    assert.strictEqual(JSON.parse(savedUser.text).error,'password must be at least 3 characters long')
  })
})

after(async () => {
  await mongoose.connection.close()
})