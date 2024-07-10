const LoginForm = ({
  handleSubmit,
  setUsername,
  setPassword,
  username,
  password
}) => {

  return(
    <div>
      <h2>Login to application</h2>
      <form onSubmit={handleSubmit}>
        <div>
          username
          <input
            id='username'
            type='text'
            value={username}
            name='Username'
            onChange={({ target }) => setUsername(target.value)}
          /> <br/>
          password
          <input
            id='password'
            type='password'
            value={password}
            name='Password'
            onChange={({ target }) => setPassword(target.value)}
          /> <br/>
        </div>
        <button id='login-button' type='submit'>login</button>
      </form>
    </div>
  )
}

export default LoginForm