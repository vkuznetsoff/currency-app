import "./styles.css"

const apiKey = "d18ezMeDAF4oR8sVTiOZzWZIMfVAt2SadfJmDyxn"
const geoApiKey = "16c29522b5e1d3434c4018b75148e61c"
let currencyList 

window.addEventListener('load', () => {

   getCurrencyList().then(data => currencyList = Object.keys(data) )
   .then( () =>  setSelect(currencyList) )
   
})


function setSelect(values) {
    const selects = document.querySelectorAll('select')
    console.log(selects) 

    selects.forEach( select => {
        for (const el of currencyList) {
            const option = document.createElement('option')
            option.value = el;
            option.innerHTML = el;
                select.appendChild(option);
         }
    })
 

//     var min = 12,
//     max = 100,
//     select = document.getElementById('selectElementId');

// for (var i = min; i<=max; i++){
//     var opt = document.createElement('option');
//     opt.value = i;
//     opt.innerHTML = i;
//     select.appendChild(opt);
// }

//     selects.forEach(s => s.)
}

function getCurrencyList() {
    return fetch('https://api.currencyapi.com/v3/currencies', {
        headers: {
            apikey: apiKey
        }
    })
    .then( response => response.json())
    .then(response => (response.data))
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
    .then(data => console.log(data[0].country))
}

// getGeolocation()
// getCurrencyList()



