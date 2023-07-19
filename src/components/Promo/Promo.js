import Calculator from '../Calculator'
import styles from './Promo.module.scss'

function Promo() {
return (
  <div className={styles.Promo}>
    <div className={styles.background}></div>

    <div className={styles.content}>
      <div className={styles.company_info}>
        <h1 className={styles.heading}>HORNS & HOOVES logistics</h1>

        <p className={styles.company_description}>
          — Your reliable partner in car transportation
        </p>
      </div>

      <div className={styles.calculator_wrapper}>
        <Calculator />
      </div>
    </div>
  </div>
  )
}

export default Promo
