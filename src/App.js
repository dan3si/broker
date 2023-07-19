import styles from './App.module.scss'

import Header from './components/Header'
import Promo from './components/Promo'
import BookInstruction from './components/BookInstruction'
import Footer from './components/Footer'

function App() {
  return (
    <div className={styles.app}>
      <Header />
      <Promo />
      <BookInstruction />
      <Footer />
    </div>
  )
}

export default App
