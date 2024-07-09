import { render, screen } from '@testing-library/react'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'

test('<NBlogForm /> updates parent state and calls onSubmit', async () => {
  const createBlog = vi.fn()
  const user = userEvent.setup()

  render(<BlogForm createBlog={createBlog} />)

  const input = screen.getAllByRole('textbox')

  const sendButton = screen.getByText('create')

  await user.type(input[0], 'Title for Test')
  await user.type(input[1], 'Author for Test')
  await user.type(input[2], 'Url for Test')
  await user.click(sendButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('Title for Test')
  expect(createBlog.mock.calls[0][0].author).toBe('Author for Test')
  expect(createBlog.mock.calls[0][0].url).toBe('Url for Test')
})