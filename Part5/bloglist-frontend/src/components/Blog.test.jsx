import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import { beforeEach } from 'vitest'


test('renders title and author', () => {
  const blog = {
    title: 'Blog Title',
    url: 'http://thisBlog.html',
    likes: 3,
    user: {
      username: 'Jito',
      name: 'Jito Prieto',
      _id: 123456
    },
    author: 'jito',
    _id: 987654
  }

  const { container } = render(<Blog blog={blog} />)

  const div1 = container.querySelector('.blog')
  const div2 = container.querySelector('.blogDetails')
  expect(div1).toHaveTextContent(
    'Blog Title'
  )
  expect(div1).toHaveTextContent(
    'jito'
  )
  expect(div2).toHaveStyle(
    'display: none'
  )
})