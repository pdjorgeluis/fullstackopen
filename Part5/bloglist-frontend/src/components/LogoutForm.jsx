const LogoutForm = ({ handleOnclick, user }) => {
  return (
    <div>
      <h2>blogs</h2>
      <p>
        {user.name} logged in 
        <button onClick={handleOnclick}>
          logout
        </button>
      </p>

      
    </div>
  )
}

export default LogoutForm