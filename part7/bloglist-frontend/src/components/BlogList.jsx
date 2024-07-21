import { useSelector, useDispatch } from 'react-redux'
import Blog from './Blog'

const BlogList = ({ user }) => {
  const blogList = useSelector((state) => state.blogs)
  const blogToShow = [...blogList].sort((a, b) => b.likes - a.likes)
  return (
    <div>
      {blogToShow.map((blog) => (
        <Blog key={blog.id} blog={blog} user={user} />
      ))}
    </div>
  )
}

export default BlogList
