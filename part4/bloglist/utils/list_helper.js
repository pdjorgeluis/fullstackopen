const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  const reducer = blogs.reduce((maxblog, blog) => {
      return maxblog.likes > blog.likes ? maxblog : blog
  },0);
  const result = {
    title: reducer.title,
    author: reducer.author,
    likes: reducer.likes  
  }
  return result
}

const mostBlogs = (blogs) => {
  let persons = []

  blogs.forEach(blog => {
    const person = persons.find(person => person.author === blog.author)  
    if(person === undefined){
      persons.push({author: blog.author, blogs: 1})  
    }else{
      person.blogs += 1
    }
    
  })
  
  const reducer = persons.reduce((withMostBlogs, person) => {  
    return withMostBlogs.blogs > persons.blogs ? withMostBlogs : person
  },0)
  return reducer
}

const mostLikes = (blogs) => {
  let authors = []

  blogs.forEach(blog => {
    const author = authors.find(person => person.author === blog.author)  
    if(author === undefined){
      authors.push({author: blog.author, likes: blog.likes})  
    }else{
      author.likes += blog.likes
    }
    
  })

  const reducer = authors.reduce((mostLikes, author) => {
    
    return mostLikes.likes > author.likes ? mostLikes : author
  },0)
  return reducer
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}