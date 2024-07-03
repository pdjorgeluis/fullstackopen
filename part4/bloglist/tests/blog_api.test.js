const { test, describe, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const helper = require('./test_helper')
const Blog = require('../models/blog')


describe('when there is initialy some blogs saved', ()=>{
  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
  })

    
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('there are six blogs', async () => {
    const response = await api.get('/api/blogs').set('Authorization', token)

    assert.strictEqual(response.body.length, 6)
  })

  test('the _id property is called id in the blogs posts', async () => {
    let result
    const blogss = await helper.blogsInDb()
    blogss.forEach(element => {
      result = element.hasOwnProperty('id') && true
    });
    assert.strictEqual(result, true)
  })

  describe('a valid blog can be added', () => {
    const newBlog = {
      title: "juez y parte",
      author: "lajito",
      url: "none",
      likes: 300
    }

    
    test('posted new blog and total of blogs increased by 1', async () => { 
      
      const initialBlogsLength = (await helper.blogsInDb()).length
      const savedBlog = 
        await api
          .post('/api/blogs')
          .send(newBlog)
          .expect(201)
          .expect('Content-Type', /application\/json/)
  
      result = {
        title: savedBlog.body.title,
        author: savedBlog.body.author,
        url: savedBlog.body.url,
        likes: savedBlog.body.likes
      }
      const currentBlogsInDb = await helper.blogsInDb()
    
      assert.strictEqual(currentBlogsInDb.length, initialBlogsLength + 1)
      
      assert.deepStrictEqual(result, newBlog)
    })
  })

  describe('missing likes property when adding blog', () => {
    const newBlog = {
      title: "juez y parte",
      author: "lajito",
      url: "none",
    }
  
    test('when missing likes property it defaults to 0', async () => { 
      const savedBlog = await api
          .post('/api/blogs')
          .send(newBlog)
          .expect(201)
          .expect('Content-Type', /application\/json/)
    
      assert.strictEqual(newBlog.likes, undefined)  
      assert.strictEqual(savedBlog.body.likes, 0)  
    })
  })

  describe('missing title or url property when adding blog', () => {
    
    test('when missing title, response status code is 400', async () => { 
      const newBlog = {
        author: "lajito",
        url: "none",
        likes: 300
      }

      const savedBlog = 
        await api
          .post('/api/blogs')
          .send(newBlog)
          .expect(400)
          .expect('Content-Type', /application\/json/) 
    })
    test('when missing url, response status code is 400', async () => { 
      const newBlog = {
        title: "juez y parte",
        author: "lajito",
        likes: 300
      }

      const savedBlog = 
        await api
          .post('/api/blogs')
          .send(newBlog)
          .expect(400)
          .expect('Content-Type', /application\/json/) 
    })
  })

  describe('deletion of a single blog', () => {
    test('succeeds with status code 204 if id is valid', async () => {
      const initialBlogs = await helper.blogsInDb()
      const blogToDlelete = initialBlogs[0]

      await api
        .delete(`/api/blogs/${blogToDlelete.id}`)
        .expect(204)

      const currentBlogs = await helper.blogsInDb()

      assert.strictEqual(currentBlogs.length, initialBlogs.length - 1)

      const titles = currentBlogs.map(blog => blog.title)
      assert(!titles.includes(blogToDlelete.title))
    })
  })

  describe('update likes of a blog', () => {
    test('update likes of a blog', async () => {
      const blogs = await helper.blogsInDb()
      const blogToUpdate = blogs[0]
      const newBlog = {
        title: blogToUpdate.title,
        author: blogToUpdate.author,
        url: blogToUpdate.url,
        likes: 150
      }
      const updatedBlog = 
        await api
          .put(`/api/blogs/${blogToUpdate.id}`)
          .send(newBlog)

      assert.strictEqual(updatedBlog.body.likes, newBlog.likes)
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})