import {
  getCountryCode,
  getCurrencyCodeByCountry,
  getCurrencyList,
  getCurrencyStrByCode,
  getCurrentCourse,
} from "./api";
import "./styles.css";
import {
  exchange,
  getCurrencyCode,
  getGeolocation,
  setActiveOption,
  setSelect,
} from "./utils";

let currencyList;

let position = {
  latitude: "",
  longitude: "",
  setCoordinates: function (coords) {
    (this.longitude = coords.longitude), (this.latitude = coords.latitude);
  },
};

let exchangeParams = {
  from: "",
  to: "",
  course: "",
  date: "",
};

const selects = document.querySelectorAll("select");
const fromCurrencySelect = selects[0];
const toCurrencySelect = selects[1];

const fromInput = document.getElementById("from_input");
const toInput = document.getElementById("to_input");

const dateDiv = document.getElementById("date");

toInput.disabled = true;

currencyList = ["EUR", "USD", "RUB"];

function exchangeRun() {
  return exchange(fromInput.value, exchangeParams.course, exchangeParams.to);
}

function renderResult() {
  toInput.innerText = exchangeRun();
  dateDiv.innerText = `Last updated course: ${exchangeParams.date}`;
}
window.addEventListener("load", () => {
  initApp();
  fromInput.value = "1.00";
});

async function initApp() {
  //Получить список валют
  const data = await getCurrencyList();
  currencyList = Object.entries(data);

  //Заполнить SELECT
  setSelect(selects, currencyList);

  fromCurrencySelect.disabled = true;
  toCurrencySelect.disabled = true;
  fromInput.disabled = true;

  //Определить координаты и получить код страны
  const coords = await getGeolocation();
  position.setCoordinates(coords);

  const countryCode = await getCountryCode(
    position.latitude,
    position.longitude
  );

  //По коду страны определить код валюты
  const currCode = await getCurrencyCodeByCountry(countryCode);

  //По коду валюты определить название валюты
  const currStrCode = await getCurrencyStrByCode(currCode);

  //Выбрать валюту по умолчанию(местоположение)
  exchangeParams.from = currStrCode;
  setActiveOption(fromCurrencySelect, exchangeParams.from);

  //USD по умолчанию базовая валюта
  exchangeParams.to = "USD";
  setActiveOption(toCurrencySelect, "USD");

  //Получить курс валюты
  const response = await getCurrentCourse(
    exchangeParams.to,
    exchangeParams.from
  );
  parseResponse(response);

  //   toInput.value = exchangeRun();
  //   dateDiv.innerText = exchangeParams.date;
  renderResult();
  //
  fromCurrencySelect.disabled = false;
  toCurrencySelect.disabled = false;
  fromInput.disabled = false;
}

function parseResponse(response) {
  const date = new Date(response.meta.last_updated_at);
  exchangeParams.date = date.toLocaleDateString();
  exchangeParams.course = response.data[exchangeParams.to].value.toFixed(2);
}

function selectHandle(type) {
  if (type === "from") {
    return getCurrentCourse(exchangeParams.to, exchangeParams.from)
      .then((response) => parseResponse(response))
      .then(() => {
        // toInput.value = exchangeRun();
        // dateDiv.innerText = exchangeParams.date;
        renderResult()
      });
  } else if (type === "to") {
    return getCurrentCourse(exchangeParams.to, exchangeParams.from)
      .then((response) => parseResponse(response))
      .then(() => renderResult());
  }
}

fromCurrencySelect.addEventListener("change", () => {
  exchangeParams.from = getCurrencyCode(fromCurrencySelect);
  selectHandle("from");
});

toCurrencySelect.addEventListener("change", () => {
  exchangeParams.to = getCurrencyCode(toCurrencySelect);
  selectHandle("to");
});

fromInput.addEventListener("input", () => {
//   toInput.value = exchangeRun();
renderResult()
});
