import "./styles.css";

const apiKey = "d18ezMeDAF4oR8sVTiOZzWZIMfVAt2SadfJmDyxn";
const geoApiKey = "16c29522b5e1d3434c4018b75148e61c";

let currencyList;

const currencyExchage = {
  from: "",
  to: "",
  course: "65",
};

const selects = document.querySelectorAll("select");

const fromCurrencySelect = selects[0];
const toCurrencySelect = selects[1];

const fromInput = document.getElementById("from_input");
const toInput = document.getElementById("to_input");

toInput.disabled = true

function getCurrencyCode(sourseSelect) {
  return sourseSelect.options[sourseSelect.selectedIndex].text;
}

window.addEventListener("load", () => {
  //    getCurrencyList().then(data => currencyList = Object.keys(data) )
  //    .then( () =>  setSelect(currencyList))
  currencyList = ["RUB", "USD", "EUR"];
  setSelect(currencyList);
  fromInput.value = "1.00";

  calcResult()
});

function calcResult() {
    toInput.value = exchange(fromInput.value, currencyExchage.to, currencyExchage.course)
}

fromCurrencySelect.addEventListener("change", () => {
  currencyExchage.from = getCurrencyCode(fromCurrencySelect);
});

toCurrencySelect.addEventListener("change", () => {
  currencyExchage.to = getCurrencyCode(toCurrencySelect);
  // toCurrencySelect.options[toCurrencySelect.selectedIndex].text
});

fromInput.addEventListener('input', () => {
    calcResult()
}
)

function setSelect(values) {
  selects.forEach((select) => {
    for (const el of currencyList) {
      const option = document.createElement("option");
      option.value = el;
      option.innerHTML = el;
      select.appendChild(option);
    }
  });
}

function getCurrencyList() {
  return fetch("https://api.currencyapi.com/v3/currencies", {
    headers: {
      apikey: apiKey,
    },
  })
    .then((response) => response.json())
    .then((response) => response.data);
}

function getGeolocation() {
  navigator.geolocation.getCurrentPosition((position) => {
    const { latitude, longitude } = position.coords;
    getCountry(latitude, longitude);
  });
}

function getCountry(lat, lon) {
  return fetch(
    `http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${geoApiKey}`
  )
    .then((response) => response.json())
    .then((data) => console.log(data[0].country));
}

function getCurrentCourse(base, currencies) {
  return fetch(
    `https://api.currencyapi.com/v3/latest?base_currency=${base}&currencies=${currencies}`,
    {
      method: "GET",
      headers: {
        apikey: apiKey,
      },
    }
  )
    .then((response) => response.json())
    .then(
      (response) => currencyExchage.course = response.data[currencies].value
    );
}

function exchange(value, base, course) {
  return (value * course).toFixed(2);
}

// getGeolocation()
// getCurrencyList()
// getCurrentCourse('USD', 'USD')
