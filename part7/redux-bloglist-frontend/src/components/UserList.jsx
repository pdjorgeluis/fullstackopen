import { useSelector } from 'react-redux'
import User from './User'

const UserList = () => {
  const userList = useSelector((state) => state.users)
  const userListTest = [
    {
      username: 'user1',
      name: 'User 1',
      blogs: 3,
    },
    {
      username: 'user2',
      name: 'User 2',
      blogs: 6,
    },
  ]
  return (
    <table>
      <tbody>
        <th></th>
        <th>blogs created</th>
        {userListTest.map((user) => (
          <User key={user.username} user={user} />
        ))}
      </tbody>
    </table>
  )
}

export default UserList
