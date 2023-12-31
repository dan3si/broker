import { useState } from 'react'
import styles from './Calculator.module.scss'
import ContactsScreen from './ContactsScreen'
import DoneScreen from './DoneScreen'
import cn from 'classnames'
import { getCalculation, getCities, getCarMakes, getCarModels, createOrderRequest } from './functions'
import Select from 'react-select'

function Calculator() {
  const [activeScreen, setActiveScreen] = useState('quote')

  const [calculationId, setCalculationId] = useState(null)
  const [price, setPrice] = useState(null)

  const [citiesFrom, setCitiesFrom] = useState([])
  const [citiesTo, setCitiesTo] = useState([])

  const years = []
  for (let i = new Date().getFullYear() + 1; i >= 1900; i--) {
    years.push({ value: String(i), label: String(i) })
  }

  const [makes, setMakes] = useState([])
  const [models, setModels] = useState([])

  const [readyToRequestCities, setReadyToRequestCities] = useState(true)
  const [priceIsLoading, setPriceIsLoading] = useState(false)

  const [selectedCityFrom, setSelectedCityFrom] = useState(null)
  const [selectedCityTo, setSelectedCityTo] = useState(null)
  const [selectedYear, setSelectedYear] = useState(null)
  const [selectedMake, setSelectedMake] = useState(null)
  const [selectedModel, setSelectedModel] = useState(null)
  const [selectedTrailerType, setSelectedTrailerType] = useState('open')
  const [selectedOperability, setSelectedOperability] = useState('running')
  const [selectedShippingDateOption, setSelectedShippingDateOption] = useState('asap')
  const [selectedShippingDate, setSelectedShippingDate] = useState(getDateYYYY_MM_DD(0))
  const [userEmail, setUserEmail] = useState('')
  const [userPhone, setUserPhone] = useState('')

  function getDateYYYY_MM_DD(daysAdded = 0) {
    const laterDate = new Date()
    laterDate.setDate(laterDate.getDate() + daysAdded)

    return laterDate.toISOString().split('T')[0]
  }

  function consistsOfLetters(str) {
    return str.split('').every(symbol => 'abcdefghijklmnopqrstuvwxyz '.includes(symbol.toLowerCase()))
  }

  function consistsOfDigits(str) {
    return str.split('').every(symbol => '1234567890'.includes(symbol))
  }

  async function createOrder() {
    const orderStatus = await createOrderRequest(
      selectedCityFrom.value,
      selectedCityTo.value,
      selectedYear.value,
      selectedMake.value,
      selectedModel.value,
      selectedTrailerType,
      selectedOperability,
      selectedShippingDate,
      calculationId,
      userEmail,
      userPhone,
      price
    )

    setActiveScreen('done')
    setCalculationId(null)
    setPrice(null)

    setCitiesFrom([])
    setCitiesTo([])

    setMakes([])
    setModels([])

    setSelectedCityFrom(null)
    setSelectedCityTo(null)
    setSelectedYear(null)
    setSelectedMake(null)
    setSelectedModel(null)
    setSelectedTrailerType('open')
    setSelectedOperability('running')
    setSelectedShippingDateOption('asap')
    setSelectedShippingDate(getDateYYYY_MM_DD(0))
    setUserEmail('')
    setUserPhone('')
  }

  if (activeScreen === 'contacts') {
    return (
      <ContactsScreen
        setActiveScreen={setActiveScreen}
        userEmail={userEmail}
        setUserEmail={setUserEmail}
        userPhone={userPhone}
        setUserPhone={setUserPhone}
        consistsOfDigits={consistsOfDigits}
        createOrder={createOrder}
      />
    )
  }

  if (activeScreen === 'done') {
    return (
      <DoneScreen
        setActiveScreen={setActiveScreen}
      />
    )
  }

  return (
    <div className={styles.Calculator}>
      <h2 className={styles.heading}>Get instant quote</h2>

      <div className={styles.cities}>
        <Select
          options={citiesFrom}
          onInputChange={shard => {
            if (!readyToRequestCities) return

            let shardType
            if (consistsOfLetters(shard)) {
              shardType = 'city'
            } else if (consistsOfDigits(shard)) {
              shardType = 'zip'
            } else {
              return
            }

            if (shard.length < 3) return
            if (shardType === 'zip' && shard.length !== 5) return

            getCities(shard, shardType)
              .then(cities => {
                const citiesOptions = cities.map(city => ({ label: city.fullName, value: city }))
        
                setCitiesFrom(citiesOptions)
              })

            setReadyToRequestCities(false)
            setTimeout(() => setReadyToRequestCities(true), 2000)
          }}
          onChange={option => {
            setSelectedCityFrom(option)
            setPrice(null)
            setCalculationId(null)
          }}
          placeholder="Departure city or zip"
        />

        <Select
          options={citiesTo}
          onInputChange={shard => {
            if (!readyToRequestCities) return

            let shardType
            if (consistsOfLetters(shard)) {
              shardType = 'city'
            } else if (consistsOfDigits(shard)) {
              shardType = 'zip'
            } else {
              return
            }

            if (shard.length < 3) return
            if (shardType === 'zip' && shard.length !== 5) return

            getCities(shard, shardType)
              .then(cities => {
                const citiesOptions = cities.map(city => ({ label: city.fullName, value: city }))

                setCitiesTo(citiesOptions)
              })

            setReadyToRequestCities(false)
            setTimeout(() => setReadyToRequestCities(true), 2000)
          }}
          onChange={option => {
            setSelectedCityTo(option)
            setPrice(null)
            setCalculationId(null)
          }}
          placeholder="Destination city or zip"
        />
      </div>

      <div className={styles.car_details}>
        <Select
          options={years}
          value={selectedYear}
          onChange={async option => {
            const makes = await getCarMakes(option.value)
            const makesOptions = makes.map(make => ({ label: make, value: make }))

            setMakes(makesOptions)
            setModels([])

            setSelectedYear(option)
            setSelectedMake(null)
            setSelectedModel(null)
            setPrice(null)
            setCalculationId(null)
          }}
          placeholder="Car year"
        />

        <Select
          options={makes}
          value={selectedMake}
          onChange={async option => {
            const models = await getCarModels(selectedYear.value, option.value)
            const modelsOptions = models.map(model => ({ label: model, value: model }))

            setModels(modelsOptions)
            setSelectedMake(option)
            setSelectedModel(null)
            setPrice(null)
            setCalculationId(null)
          }}
          placeholder="Car make"
          isDisabled={makes.length === 0}
        />

        <Select
          options={models}
          value={selectedModel}
          onChange={option => {
            setSelectedModel(option)
            setPrice(null)
            setCalculationId(null)
          }}
          placeholder="Car model"
          isDisabled={models.length === 0}
        />
      </div>

      <div className={styles.transportation_details}>
        <div>
          Select trailer type:

          <div className={styles.transportation_details__options}>
            <label className={styles.transportation_details__option}>
              <input
                type="radio"
                checked={selectedTrailerType === 'open'}
                onChange={() => {
                  setSelectedTrailerType('open')
                  setPrice(null)
                  setCalculationId(null)
                }}
              />
              Open
            </label>

            <label className={styles.transportation_details__option}>
              <input
                type="radio"
                checked={selectedTrailerType === 'enclosed'}
                onChange={() => {
                  setSelectedTrailerType('enclosed')
                  setPrice(null)
                  setCalculationId(null)
                }}
              />
              Enclosed
            </label>
          </div>
        </div>

        <div>
          Is the car operable?:

          <div className={styles.transportation_details__options}>
            <label className={styles.transportation_details__option}>
              <input
                type="radio"
                checked={selectedOperability === 'running'}
                onChange={() => {
                  setSelectedOperability('running')
                  setPrice(null)
                  setCalculationId(null)
                }}
              />
              Yes
            </label>

            <label className={styles.transportation_details__option}>
              <input
                type="radio"
                checked={selectedOperability === 'nonrunning'}
                onChange={() => {
                  setSelectedOperability('nonrunning')
                  setPrice(null)
                  setCalculationId(null)
                }}
              />
              No
            </label>
          </div>
        </div>
      </div>
      
      <div className={styles.shippingDate}>
        <div>
          Select preferred shipping date:

          <div className={styles.shippingDate__options}>
            <label className={styles.shippingDate__option}>
              <input
                type="radio"
                checked={selectedShippingDateOption === 'asap'}
                onChange={() => {
                  setSelectedShippingDateOption('asap')
                  setSelectedShippingDate(getDateYYYY_MM_DD(0))
                  setPrice(null)
                  setCalculationId(null)
                }}
              />
              As soon as possible
            </label>

            <label className={styles.shippingDate__option}>
              <input
                type="radio"
                checked={selectedShippingDateOption === 'week'}
                onChange={() => {
                  setSelectedShippingDateOption('week')
                  setSelectedShippingDate(getDateYYYY_MM_DD(7))
                  setPrice(null)
                  setCalculationId(null)
                }}
              />
              In 1 week
            </label>

            <label className={styles.shippingDate__option}>
              <input
                type="radio"
                checked={selectedShippingDateOption === 'month'}
                onChange={() => {
                  setSelectedShippingDateOption('month')
                  setSelectedShippingDate(getDateYYYY_MM_DD(30))
                  setPrice(null)
                  setCalculationId(null)
                }}
              />
              In 30 days
            </label>

            <label className={styles.shippingDate__option}>
              <input
                type="radio"
                checked={selectedShippingDateOption === 'other'}
                onChange={() => {
                  setSelectedShippingDateOption('other')
                  setPrice(null)
                  setCalculationId(null)
                }}
              />
              Other
            </label>
          </div>
        </div>

        {selectedShippingDateOption === 'other' && (
          <div className={styles.shippingDate__calendar_wrapper}>
            <input
            className={styles.shippingDate_calendar}
              type="date"
              min={getDateYYYY_MM_DD()}
              value={selectedShippingDate}
              onChange={e => {
                const suggestedYear = +e.target.value.split('-')[0]
                const currentYear = +getDateYYYY_MM_DD().split('-')[0]

                if (![currentYear, currentYear + 1].includes(suggestedYear)) return

                setSelectedShippingDate(e.target.value)
              }}
            />
          </div>
        )}
      </div>

      <div className={styles.calculatePrice}>
        {calculationId === null
          ? (
            <button
              className={styles.calculatePrice__calculate_button}
              disabled={
                [selectedCityFrom, selectedCityTo, selectedYear, selectedMake, selectedModel].includes(null)
                || price !== null
                || priceIsLoading
              }
              onClick={async () => {
                setPriceIsLoading(true)

                const calculation = await getCalculation(
                  selectedCityFrom.value,
                  selectedCityTo.value,
                  selectedYear.value,
                  selectedMake.value,
                  selectedModel.value,
                  selectedTrailerType,
                  selectedOperability,
                  selectedShippingDate
                )
                
                setPriceIsLoading(false)

                setCalculationId(calculation.id)
                setPrice(calculation.price)
              }}
            >
              CALCULATE PRICE
            </button>
          ) : (
            <button
              className={styles.calculatePrice__calculate_button}
              onClick={() => setActiveScreen('contacts')}
            >
              Book an order
            </button>
          )
        }
      </div>

      <div className={styles.price}>
        {priceIsLoading && (
          <div>
            Loading...
          </div>
        )}

        {price !== null && (
          <div>
            <div>
              Regular price: ${Math.floor(price)}
            </div>

            <div>
              Dscounted cash price: ${Math.floor(price * 0.95)}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Calculator
