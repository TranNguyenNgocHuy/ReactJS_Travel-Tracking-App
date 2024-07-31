import styles from './Message.module.css'

interface Props {
  message: string
}

function Message({ message }: Props) {
  return (
    <p className={styles.message}>
      <span role='img'>👋</span> {message}
    </p>
  )
}

export default Message
