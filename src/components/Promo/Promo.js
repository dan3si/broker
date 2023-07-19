import Calculator from '../Calculator'
import styles from './Promo.module.scss'

function Promo() {
return (
  <div className={styles.Promo}>
    <div className={styles.background}></div>

    <div className={styles.content}>
      <h1 className={styles.heading}>HORNS & HOOVES transportation</h1>

      <div className={styles.calculator_wrapper}>
        <Calculator />
      </div>
    </div>
  </div>
  )
}

export default Promo
