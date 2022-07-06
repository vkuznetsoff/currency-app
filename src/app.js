import "./styles.css"

const apiKey = "d18ezMeDAF4oR8sVTiOZzWZIMfVAt2SadfJmDyxn"
const geoApiKey = "16c29522b5e1d3434c4018b75148e61c"

function getCurrencyList() {
    return fetch('https://api.currencyapi.com/v3/currencies', {
        headers: {
            apikey: apiKey
        }
    })
    .then( response => response.json())
    .then(response => response.data)
}

function getGeolocation() {
    navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude } = position.coords;
        getCountry(latitude, longitude)
      });
    
   
}

function getCountry(lat, lon) {
    return fetch(
        `http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${geoApiKey}`
    )
    .then(response => response.json())
    .then(data => console.log(data))
}

getGeolocation()



