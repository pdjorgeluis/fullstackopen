const User = ({ user }) => {
  return (
    <tr>
      <td>{user.name}</td>
      <td>{user.blogs}</td>
    </tr>
  )
}

export default User
