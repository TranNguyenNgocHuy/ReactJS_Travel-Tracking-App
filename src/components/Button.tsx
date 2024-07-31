import React from 'react'
import styles from './Button.module.css'

interface Props {
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void
  type: string
  children: React.ReactNode
}

function Button({ children, onClick, type }: Props) {
  return (
    <button className={`${styles.btn} ${styles[type]}`} onClick={onClick}>
      {children}
    </button>
  )
}

export default Button
