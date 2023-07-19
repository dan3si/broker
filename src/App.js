import styles from './App.module.scss'

import Header from './components/Header'
import Promo from './components/Promo'

function App() {
  return (
    <div className={styles.app}>
      <Header />
      <Promo />
    </div>
  )
}

export default App
