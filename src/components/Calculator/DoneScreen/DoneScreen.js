import styles from './DoneScreen.module.scss'
import doneIcon from '../../../images/done_icon.png'
import { useEffect } from 'react'

function DoneScreen({ setActiveScreen }) {
  useEffect(() => {
    setTimeout(() => setActiveScreen('quote'), 5000)
  })

  return (
    <div className={styles.DoneScreen}>
      <h2 className={styles.heading}>
        <img src={doneIcon} />
        Your order has been submitted!
      </h2>

      <p className={styles.description}>
        Our manager will reach you back within 24 hours
      </p>
    </div>
  )
}

export default DoneScreen
