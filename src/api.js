//Получение списка валют с API
const apiKey = "285pI9mMInPFLzXjpm7FRPz6he3lckiuqaWKoAEl";
const geoApiKey = "16c29522b5e1d3434c4018b75148e61c";

//получение списка валют
export function getCurrencyList() {
  return fetch("https://api.currencyapi.com/v3/currencies", {
    headers: {
      apikey: apiKey,
    },
  })
    .then((response) => response.json())
    .then((response) => response.data);
}

//Получение кода страны
export function getCountryCode(lat, lon) {
  return fetch(
    `http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${geoApiKey}`
  )
    .then((response) => response.json())
    .then((data) => data[0].country)
    .catch(() => "US");
}

//Настройка параметров запроса
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

//получение валюты с API
function fetchCurrency(url, field, options) {
  return fetch(url, options)
    .then((response) => response.json())
    .then((result) => result.suggestions[0].data[field])
    .catch((error) => {
      console.log("error", error);
      return -1;
    });
}

//Получение цифрового кода валюты по коду страны
export function getCurrencyCodeByCountry(query) {
  const url =
    "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/country";
  const options = setQueryParams(query);
  return fetchCurrency(url, "code", options);
}

//Получение символьного кода валюты по цифровому коду валюты
export function getCurrencyStrByCode(currencyCode) {
  const url =
    "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/currency";
  const options = setQueryParams(currencyCode);
  return fetchCurrency(url, "strcode", options);
}

//Получение текущего курса
export function getCurrentCourse(currencies, base) {
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
    .then((response) => response)
    .catch((error) => {
      console.log("Get course ERROR: ", error);
    });
}
