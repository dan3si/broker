import styles from './Footer.module.scss'

function Footer() {
  return (
    <footer className={styles.Footer}>
      <div className={styles.background}>
      </div>

      <div className={styles.content}>
        <h5 className={styles.copyright_inscription}>2023 © copyright</h5>
      </div>
    </footer>
  )
}

export default Footer
