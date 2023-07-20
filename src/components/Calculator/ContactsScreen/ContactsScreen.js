import { useState } from 'react'
import styles from './ContactsScreen.module.scss'
import cn from 'classnames'

function ContactsScreen({ setActiveScreen }) {

  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')

  function consistsOfDigits(str) {
    return str.split('').every(symbol => '1234567890'.includes(symbol))
  }

  return (
    <div className={styles.ContactsScreen}>
      <h2 className={styles.heading}>Book an order</h2>

      <div className={cn(styles.textInputWrapper, styles.email)}>
        Enter your email:
        <input
          className={cn(styles.textInput, styles.emailInput)}
          placeholder="example@gmail.com"
          value={email}
          onChange={e => {
            setEmail(e.target.value)
          }}
        />
      </div>
      
      <div className={cn(styles.textInputWrapper, styles.phone)}>
        Enter your phone:
        <input
          className={cn(styles.textInput, styles.phoneInput)}
          placeholder="123 456 7890"
          value={phone}
          onChange={e => {
            if (!consistsOfDigits(e.target.value)) return
            if (e.target.value.length > 9) return

            setPhone(e.target.value)
          }}
        />
      </div>

      <div className={styles.submit}>
        <button
          className={styles.submit_button}
          onClick={() => setActiveScreen('done')}
        >
          SUBMIT
        </button>
      </div>
    </div>
  )
}

export default ContactsScreen
