import { useSelector } from 'react-redux'
import { Alert } from 'react-bootstrap'

const Notification = () => {
  const notification = useSelector((state) => state.notification)
  const style = notification !== '' ? { display: '' } : { display: 'none' }

  return (
    <Alert variant="info" style={style}>
      {notification}
    </Alert>
  )
}

export default Notification
