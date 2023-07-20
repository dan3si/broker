import styles from './Header.module.scss'
import logo from '../../images/logo.png'
import phoneIcon from '../../images/phone_icon.png'
import emailIcon from '../../images/email_icon.png'
import cn from 'classnames'

function Header() {
  return (
    <header className={styles.Header}>
      <div className={styles.logo_wrapper}>
        <img
          src={logo}
          className={styles.logo}
        />
      </div>

      <div className={styles.contacts}>
        <div className={styles.contact}>
          <img
            className={styles.contact_icon}
            src={phoneIcon}
          />
          123-456-7890
        </div>

        <div className={cn(styles.contact, styles.email)}>
          <img
            className={styles.contact_icon}
            src={emailIcon}
          />
          company_email@gmail.com
        </div>
      </div>
    </header>
  )
}

export default Header
