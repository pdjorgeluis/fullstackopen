import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog />', () => {
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

  test('renders title and author but hides url and likes', () => {
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

  test('after clicking the button url and likes are displayed', async () => {
    const { container } = render(<Blog blog={blog} />)
    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    const div = container.querySelector('.blogDetails')
    expect(div).not.toHaveStyle('display: none')
  })
})