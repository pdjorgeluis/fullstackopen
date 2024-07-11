const Alert = ({ alert }) => {
  if(alert === null){
    return null
  }
  return (
    <p className={alert.typeOfAlert}>{alert.message}</p>
  )
}

export default Alert