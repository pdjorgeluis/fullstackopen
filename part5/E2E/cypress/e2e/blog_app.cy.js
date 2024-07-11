//import { should } from 'chai';
//chai.use(should)

describe('Blog app', function() {
  const user = {
    name: 'Matti Luukkainen',
    username: 'mluukkai',
    password: 'salainen'
  }

  const otherUser = {
    name: 'Jito Prieto',
    username: 'jito',
    password: 'seleda'
  }

  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    cy.request('POST', 'http://localhost:3003/api/users/', user) 
    cy.visit('http://localhost:5173')
  })

  it('Login form is shown', function() {
    cy.contains('Login to application')
  })

  describe('Login',function() {
    

    it('succeeds with correct credentials', function() {
      cy.contains('login')
      cy.get('#username').type(user.username)
      cy.get('#password').type(user.password)
      cy.get('#login-button').click()

      cy.contains('Matti Luukkainen logged in')
    })

    it('fails with wrong credentials', function() {
      cy.contains('login')
      cy.get('#username').type(otherUser.username)
      cy.get('#password').type(otherUser.password)
      cy.get('#login-button').click()

      cy.get('.error').should('contain', 'wrong credentials').and('have.css', 'color', 'rgb(255, 0, 0)')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      //Login user
      cy.contains('login')
      cy.get('#username').type(user.username)
      cy.get('#password').type(user.password)
      cy.get('#login-button').click()
    })

    it('A blog can be created', function() {
      cy.contains('new blog').click()
      cy.contains('create new')
      cy.get('#title').type('new blog')
      cy.get('#author').type('Matti Luukkainen')
      cy.get('#url').type('http://tesingwithcypress.com')
      cy.get('#button-create').click()
      cy.contains('new blog by Matti Luukkainen')
    })

    describe('When a blog exist', function() {
      beforeEach(function() {
        //Create new blog
        cy.contains('new blog').click()
        cy.contains('create new')
        cy.get('#title').type('new blog')
        cy.get('#author').type('Matti Luukkainen')
        cy.get('#url').type('http://tesingwithcypress.com')
        cy.get('#button-create').click()
        cy.contains('new blog by Matti Luukkainen')
      })

      it('User can like a blog', function() {
        cy.contains('view').click()
        cy.contains('like').click()
      })

      it('Only User that created blog can see delete button', function() {
        cy.contains('view').click()
        //Assert that delete button can be seen
        cy.contains('remove')
        //Logout user, registering a new one in DB and login new user
        cy.contains('logout').click()
        cy.request('POST', 'http://localhost:3003/api/users/', otherUser)
        cy.contains('login')
        cy.get('#username').type(otherUser.username)
        cy.get('#password').type(otherUser.password)
        cy.get('#login-button').click() 
        cy.contains('view').click()
        //Assert that delete button can't be seen
        cy.contains('remove').should('not.exist')
      })

      it('User that created blog can deleted', function() {
        cy.contains('view').click()
        cy.contains('remove').click()
        cy.contains('new blog by Matti Luukkainen').should('not.exist')
      })

      
    })
    
    describe('When several blogs exist', function() {
      beforeEach(function() {
        cy.contains('new blog').click()
        cy.contains('create new')
        //Create 3 blogs
        cy.get('#title').type('first blog')
        cy.get('#author').type('Matti Luukkainen')
        cy.get('#url').type('http://tesingwithcypres-first.com')
        cy.get('#button-create').click()

        cy.get('#title').type('second blog')
        cy.get('#author').type('Edsger W. Dijkstra')
        cy.get('#url').type('http://tesingwithcypress-second.com')
        cy.get('#button-create').click()


        cy.get('#title').type('third blog')
        cy.get('#author').type('Michael Chan')
        cy.get('#url').type('http://tesingwithcypress-third.com')
        cy.get('#button-create').click()

      })
      it('Blogs are ordered by most liked', function() {
        //Clicking view button
        cy.get('.blog').eq(0).contains('view').click()
        cy.get('.blog').eq(1).contains('view').click()
        cy.get('.blog').eq(2).contains('view').click()
        //Clicking like buttons
        cy.get('.blog').eq(0).contains('like').click()
        cy.wait(500)
        cy.get('.blog').eq(1).contains('like').click()
        cy.wait(500)
        cy.get('.blog').eq(2).contains('like').click()
        cy.wait(500)
        cy.get('.blog').eq(2).contains('like').click()
        cy.wait(500)
        cy.get('.blog').eq(1).contains('like').click()
        cy.wait(500)
        cy.get('.blog').eq(1).contains('like').click()
        cy.wait(500)
        //Expected order
        cy.get('.blog').eq(0).should('contain', 'third blog').and('contain', '3')
        cy.get('.blog').eq(1).should('contain', 'first blog').and('contain', '2')
        cy.get('.blog').eq(2).should('contain', 'second blog').and('contain', '1')
      })
    })
  })
})