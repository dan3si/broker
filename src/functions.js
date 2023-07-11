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

export async function getCities(shard) {
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

    const res = await fetch('https://cors-anywhere.herokuapp.com/https://www.montway.com/es/gis/_suggest', {
        method: 'POST',
        headers: { "Authority": "www.montway.com" },
        body: JSON.stringify({
            city_state: {
                text: shard,
                completion: {
                    field: "citystate_suggest",
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
                fullName: option.text,
                city: option._source.payload.city,
                state: option._source.payload.state
            })
        )
}

export async function getPrice(cityFrom, cityTo, carYear, carMake, carModel) {
    //GETTING _WPNONCE PARAMETER
    const _wpnonceRes = await fetch("https://cors-anywhere.herokuapp.com/https://www.montway.com/wp/wp-admin/admin-ajax.php", {
        method: "POST",
        headers: {
            "Authority": "www.montway.com",
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        body: 'action=calculator_nonce_create',
    })

    const _wpnonceData = await _wpnonceRes.text()
    const _wpnonce = _wpnonceData.slice(
        _wpnonceData.indexOf('value') + 7,
        _wpnonceData.indexOf('/>') - 2,
    )


    //CREATING CALCULATION AND GETTING CALCULATION ID
    const body = `_wpnonce=${_wpnonce}&_wp_http_referer=%2Fwp%2Fwp-admin%2Fadmin-ajax.php&city_midpoint=&city_from=${cityFrom.city.split(' ').join('+')}%2C+${cityFrom.state}&city_to=${cityTo.city.split(' ').join('+')}%2C+${cityTo.state}&transport_type=open&select_year=${carYear}&vehicle=${carMake}&vehicle_model=${carModel}&operable=running&email_address=myemail123%40gmail.com&selected_shipping_date=2023-07-21&date_value=&telephone=&action=calculator`
    const calculationIdRes = await fetch(
        "https://cors-anywhere.herokuapp.com/https://www.montway.com/wp/wp-admin/admin-ajax.php",
        {
            method: "POST",
            body: body,
            headers: { "Authority": "www.montway.com", 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
        }
    )

    const calculationIDData = await calculationIdRes.text()
    const calculationID = calculationIDData.slice(
        calculationIDData.indexOf('gtmData') + 11,
        calculationIDData.indexOf("');")
    )


    //GETTING PRICE
    const calculationURL = `https://cors-anywhere.herokuapp.com/montway.com/partners/api/calculations/${calculationID}`
    const priceRes = await fetch(calculationURL)
    const priceData = await priceRes.json()
    const price = priceData.data.attributes.rates[7].price
    
    return price
}