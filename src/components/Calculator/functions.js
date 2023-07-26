export async function getCarMakes(year){
    const res = await fetch(`https://done.ship.cars/makes/?year=${year}`)
    const data = await res.json()

    return data.map(car => car.make)
}

export async function getCarModels(year, make){
    const res = await fetch(`https://done.ship.cars/models/?year=${year}&make=${make}`)
    const data = await res.json()

    return data.map(car => car.model)
}

export async function getCities(shard, shardType) {
    /*return [
        {
          "fullName": "LOS ANGELES CA 90001",
          "city": "LOS ANGELES",
          "state": "CA"
        },
        {
          "fullName": "LOS RANCHOS DE ALBUQUERQUE NM 87107",
          "city": "ALBUQUERQUE",
          "state": "NM"
        },
        {
          "fullName": "LOS RANCHOS NM 87107",
          "city": "ALBUQUERQUE",
          "state": "NM"
        },
        {
          "fullName": "LOS PADILLAS NM 87105",
          "city": "ALBUQUERQUE",
          "state": "NM"
        },
        {
          "fullName": "LOS CUATES TX 78586",
          "city": "SAN BENITO",
          "state": "TX"
        },
        {
          "fullName": "LOS GATOS CA 95030",
          "city": "LOS GATOS",
          "state": "CA"
        },
        {
          "fullName": "LOS FELIZ CA 90027",
          "city": "LOS ANGELES",
          "state": "CA"
        },
        {
          "fullName": "LOS LUNAS NM 87031",
          "city": "LOS LUNAS",
          "state": "NM"
        }
      ]*/

    let shardTypeField

    switch (shardType) {
      case 'city':
        shardTypeField = 'citystate_suggest'
        break

      case 'zip':
        shardTypeField = 'name_suggest'
        break

      default:
        console.log('Invalid shard type in getCities() function!')
        return
    }

    const res = await fetch('https://hfspizdili-mw4nubnweq-uc.a.run.app/city', {
        method: 'POST',
        headers: { "Content-Type":"application/json" },
        body: JSON.stringify({
            city_state: {
                text: shard,
                completion: {
                    field: shardTypeField,
                    fuzzy: { fuzziness: 0 },
                    size: 8
                }
            }
        })
    })
    const data = await res.json()

    return data
      .city_state[0]
      .options
      .map(option => ({
        fullName: option._source.text,
        city: option._source.payload.city,
        state: option._source.payload.state
      }))
}

export async function getCalculation(cityFrom, cityTo, carYear, carMake, carModel, trailerType, operability, shippingDate) {
  const calculationRes = await fetch('https://hfspizdili-mw4nubnweq-uc.a.run.app/calculate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: `${cityFrom.city.split(' ').join('+')}%2C+${cityFrom.state}`,
      to: `${cityTo.city.split(' ').join('+')}%2C+${cityTo.state}`,
      year: carYear,
      make: carMake,
      model: carModel,
      operable: operability,
      type: trailerType,
      date: shippingDate
    })
  })

  const calculationData = await calculationRes.json()

  return {
    id: calculationData.data.id,
    price: calculationData.data.attributes.rates[3].price * 0.95
  }
}

export async function createOrderRequest(
  cityFrom,
  cityTo,
  carYear,
  carMake,
  carModel,
  trailerType,
  operability,
  shippingDate,
  calculationId,
  userEmail,
  userPhone,
  price
) {
  const body = {
    from: `${cityFrom.city.split(' ').join('+')}%2C+${cityFrom.state}`,
    to: `${cityTo.city.split(' ').join('+')}%2C+${cityTo.state}`,
    year: carYear,
    make: carMake,
    model: carModel,
    operable: operability,
    type: trailerType,
    date: shippingDate,
    calculationId,
    userEmail,
    userPhone,
    price
  }

  const res = await fetch('https://hfspizdili-mw4nubnweq-uc.a.run.app/createOrder', {
    method: 'POST',
    headers:  { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })

  const data = await res.text()
}
