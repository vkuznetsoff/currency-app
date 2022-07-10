import "./styles.css";

const apiKey = "d18ezMeDAF4oR8sVTiOZzWZIMfVAt2SadfJmDyxn";
const geoApiKey = "16c29522b5e1d3434c4018b75148e61c";
const daDataApiKey = "7f8a786da68ade6636ea30508ea8f44710ea1a92";

let currencyList;

const currencyExchage = {
  from: "",
  to: "",
  course: "65",
};

let initCountry = {
  code: "US",
  currencySymbols: "USD",
  currencyCode: "",
};

const selects = document.querySelectorAll("select");

const fromCurrencySelect = selects[0];
const toCurrencySelect = selects[1];

const fromInput = document.getElementById("from_input");
const toInput = document.getElementById("to_input");

toInput.disabled = true;

function getCurrencyCode(sourseSelect) {
  return sourseSelect.options[sourseSelect.selectedIndex].text;
}

window.addEventListener("load", () => {
  //    getCurrencyList().then(data => currencyList = Object.keys(data) )
  //    .then( () =>  setSelect(currencyList))
  currencyList = ["RUB", "USD", "EUR"];
  setSelect(currencyList);
  fromInput.value = "1.00";
  calcResult();
});

function calcResult() {
  toInput.value = exchange(
    fromInput.value,
    currencyExchage.to,
    currencyExchage.course
  );
}

fromCurrencySelect.addEventListener("change", () => {
  currencyExchage.from = getCurrencyCode(fromCurrencySelect);
});

toCurrencySelect.addEventListener("change", () => {
  currencyExchage.to = getCurrencyCode(toCurrencySelect);
  // toCurrencySelect.options[toCurrencySelect.selectedIndex].text
});

fromInput.addEventListener("input", () => {
  calcResult();
});

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

function getCurrencyByCode(currCode) {
  const url =
    "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/currency";
  const options = setQueryParams(currCode);
  return fetch(url, options)
    .then((response) => response.json())
    .then((result) => {
      if (result.suggestions.length !== 0)
        initCountry.currencySymbols = result.suggestions[0].data.strcode;
      console.log(result);
    })
    .catch((error) => console.log("error", error));
}

//Ищем код валюты по аббревиатуре страны
function findCurrencyCodeByCountryStr(query) {
  // const url = "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/country"
  // const options = setQueryParams(setQueryParams(initCountry.code))
  // fetch(url, options)
  //   .then((response) => response.text())
  //   .then((result) =>  console.log("result", result))
  //    .catch((error) => console.log("error", error));

  const url =
    "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/country";
  const token = "7f8a786da68ade6636ea30508ea8f44710ea1a92";
  // const query = "US";

  const options = {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: "Token " + token,
    },
    body: JSON.stringify({ query: query }),
  };

  return fetch(url, options)
    .then((response) => response.json())
    .then(
      (result) => (initCountry.currencyCode = result.suggestions[0].data.code)
    )
    .catch((error) => console.log("error", error));
}

function getGeolocation() {
  navigator.geolocation.getCurrentPosition((position) => {
    const { latitude, longitude } = position.coords;
    getCountry(latitude, longitude);
  });

  //   findCurrencyCodeByCountryStr(initCountry.code)
  // .then( () => getCurrencyByCode(initCountry.currencyCode))
  // .then( () => console.log(initCountry))
}

function getCountry(lat, lon) {
  fetch(
    `http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${geoApiKey}`
  )
    .then((response) => response.json())
    .then((data) => {
      initCountry.code = data[0].country;
      return data[0].country;
    })
    .then((countryCode) => findCurrencyCodeByCountryStr(countryCode)).
    then(() => getCurrencyByCode(initCountry.currencyCode))
    .then(() => console.log(initCountry))
    .catch((error) => {
      console.log("ERROR - getCountry:", error);
    });
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
      (response) => (currencyExchage.course = response.data[currencies].value)
    );
}

function exchange(value, base, course) {
  return (value * course).toFixed(2);
}

// getGeolocation();
// getCurrencyList()
// getCurrentCourse('USD', 'USD')

function setQueryParams(query) {
  const token = "7f8a786da68ade6636ea30508ea8f44710ea1a92";

  const options = {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: "Token " + token,
    },
    body: JSON.stringify({ query: query }),
  };
  return options;
}

getGeolocation();
