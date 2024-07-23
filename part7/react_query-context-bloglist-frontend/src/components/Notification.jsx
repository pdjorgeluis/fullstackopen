import { Alert } from '@mui/material'
import { useNotificationText } from '../NotificationContext'

const Notification = () => {
  const notification = useNotificationText()

  const style =
    notification !== ''
      ? {
        border: 'solid',
        padding: 10,
        borderWidth: 1,
        marginBottom: 5,
      }
      : { display: 'none' }

  return (
    <Alert severity="info" style={style}>
      {notification}
    </Alert>
  )
}

export default Notification
