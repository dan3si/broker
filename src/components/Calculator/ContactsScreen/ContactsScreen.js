import styles from './ContactsScreen.module.scss'
import cn from 'classnames'

function ContactsScreen({ userEmail, setUserEmail, userPhone, setUserPhone, consistsOfDigits, createOrder }) {
  return (
    <div className={styles.ContactsScreen}>
      <h2 className={styles.heading}>Book an order</h2>

      <div className={cn(styles.textInputWrapper, styles.email)}>
        Enter your email:
        <input
          className={cn(styles.textInput, styles.emailInput)}
          placeholder="example@gmail.com"
          value={userEmail}
          onChange={e => {
            setUserEmail(e.target.value)
          }}
        />
      </div>
      
      <div className={cn(styles.textInputWrapper, styles.phone)}>
        Enter your phone:
        <input
          className={cn(styles.textInput, styles.phoneInput)}
          placeholder="123 456 7890"
          value={userPhone}
          onChange={e => {
            if (!consistsOfDigits(e.target.value)) return
            if (e.target.value.length > 10) return

            setUserPhone(e.target.value)
          }}
        />
      </div>

      <div className={styles.submit}>
        <button
          className={styles.submit_button}
          onClick={() => createOrder()}
          disabled={userPhone.length < 10 || !userEmail}
        >
          SUBMIT
        </button>
      </div>
    </div>
  )
}

export default ContactsScreen
