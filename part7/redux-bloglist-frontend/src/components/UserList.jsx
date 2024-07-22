import User from './User'

const UserList = ({ userList }) => {
  return (
    <table>
      <tbody>
        <tr>
          <th></th>
          <th>blogs created</th>
        </tr>
        {userList &&
          userList.map((user) => <User key={user.username} user={user} />)}
      </tbody>
    </table>
  )
}

export default UserList
