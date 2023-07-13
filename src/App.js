import { useState } from 'react'
import './App.css'
import cn from 'classnames'
import { getPrice, getCities, getCarMakes, getCarModels } from './functions'
import Select from 'react-select'

function App() {
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

  function getDateYYYY_MM_DD(daysAdded = 0) {
    const laterDate = new Date()
    laterDate.setDate(laterDate.getDate() + daysAdded)

    return laterDate.toISOString().split('T')[0]
  }

  return (
    <div className="app">
      <Select
        options={citiesFrom}
        onInputChange={shard => {
          if (!readyToRequestCities) return

          const consistsOfLetters = str => str.split('').every(symbol => 'abcdefghijklmnopqrstuvwxyz '.includes(symbol.toLowerCase()))
          const consistsOfDigits = str => str.split('').every(symbol => '1234567890'.includes(symbol))

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
        }}
        placeholder="Departure city or zip"
      />

      <Select
        options={citiesTo}
        onInputChange={shard => {
          if (!readyToRequestCities) return

          const consistsOfLetters = str => str.split('').every(symbol => 'abcdefghijklmnopqrstuvwxyz '.includes(symbol.toLowerCase()))
          const consistsOfDigits = str => str.split('').every(symbol => '1234567890'.includes(symbol))

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
        }}
        placeholder="Destination city or zip"
      />

      <div className="car_make_info">
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
          }}
          placeholder="Car model"
          isDisabled={models.length === 0}
        />
      </div>

      <div className="car_details">
        <div>
          Select trailer type:

          <div className="car_details_options">
            <label className="car_details_option">
              <input
                type="radio"
                checked={selectedTrailerType === 'open'}
                onChange={() => {
                  setSelectedTrailerType('open')
                  setPrice(null)
                }}
              />
              Open
            </label>

            <label className="car_details_option">
              <input
                type="radio"
                checked={selectedTrailerType === 'enclosed'}
                onChange={() => {
                  setSelectedTrailerType('enclosed')
                  setPrice(null)
                }}
              />
              Enclosed
            </label>
          </div>
        </div>

        <div>
          Is the car operable?:

          <div className="car_details_options">
            <label className="car_details_option">
              <input
                type="radio"
                checked={selectedOperability === 'running'}
                onChange={() => {
                  setSelectedOperability('running')
                  setPrice(null)
                }}
              />
              Yes
            </label>

            <label className="car_details_option">
              <input
                type="radio"
                checked={selectedOperability === 'nonrunning'}
                onChange={() => {
                  setSelectedOperability('nonrunning')
                  setPrice(null)
                }}
              />
              No
            </label>
          </div>
        </div>
      </div>
      
      <div className="shippingDate_wrapper">
        <div className="shippingDate_options_wrapper">
          Select preferred shipping date:

          <div className="shippingDate_options">
            <label className="shippingDate_option">
              <input
                type="radio"
                checked={selectedShippingDateOption === 'asap'}
                onChange={() => {
                  setSelectedShippingDateOption('asap')
                  setSelectedShippingDate(getDateYYYY_MM_DD(0))
                  setPrice(null)
                }}
              />
              As soon as possible
            </label>

            <label className="shippingDate_option">
              <input
                type="radio"
                checked={selectedShippingDateOption === 'week'}
                onChange={() => {
                  setSelectedShippingDateOption('week')
                  setSelectedShippingDate(getDateYYYY_MM_DD(7))
                  setPrice(null)
                }}
              />
              In 1 week
            </label>

            <label className="shippingDate_option">
              <input
                type="radio"
                checked={selectedShippingDateOption === 'month'}
                onChange={() => {
                  setSelectedShippingDateOption('month')
                  setSelectedShippingDate(getDateYYYY_MM_DD(30))
                  setPrice(null)
                }}
              />
              In 30 days
            </label>

            <label className="shippingDate_option">
              <input
                type="radio"
                checked={selectedShippingDateOption === 'other'}
                onChange={() => {
                  setSelectedShippingDateOption('other')
                  setPrice(null)
                }}
              />
              Other
            </label>
          </div>
        </div>

        {selectedShippingDateOption === 'other' && (
          <div className="shippingDate_calendar_wrapper">
            <input
              className="shippingDate_calendar"
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

      <div className="calculatePrice_button_wrapper">
        <button
          className="calculatePrice_button"
          disabled={
            [selectedCityFrom, selectedCityTo, selectedYear, selectedMake, selectedModel].includes(null)
            || price !== null
            || priceIsLoading
          }
          onClick={async () => {
            setPriceIsLoading(true)

            const price = await getPrice(
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
            setPrice(price)
          }}
        >
          CALCULATE PRICE
        </button>
      </div>

      {priceIsLoading && (
        <div className="priceLoading_wrapper">
          Loading...
        </div>
      )}

      {price !== null && (
        <div className="price_wrapper">
          <div className="regular_price_wrapper">
            Regular price: ${price}
          </div>

          <div className="discounted_price_wrapper">
            Dscounted cash price: ${Math.floor(price * 0.95)}
          </div>
        </div>
      )}
    </div>
  )
}

export default App
