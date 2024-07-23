import User from './User'
import { Table } from 'react-bootstrap'

const UserList = ({ userList }) => {
  return (
    <Table striped>
      <tbody>
        <tr>
          <th></th>
          <th>blogs created</th>
        </tr>
        {userList &&
          userList.map((user) => <User key={user.username} user={user} />)}
      </tbody>
    </Table>
  )
}

export default UserList
