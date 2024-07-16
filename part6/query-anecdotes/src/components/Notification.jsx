import { useNotificationText} from '../AnecdotesContext'

const Notification = () => {
  const notification = useNotificationText()

  const style = notification !== ''
    ? {
        border: 'solid',
        padding: 10,
        borderWidth: 1,
        marginBottom: 5
      }
    : {display: 'none'}

  return (
    <div style={style}>
      {notification}
    </div>
  )
}

export default Notification
