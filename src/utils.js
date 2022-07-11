//Заполнение Select списком валют
export function setSelect(selects, source) {
  selects.forEach((select) => {
    for (const el of source) {
      const option = document.createElement("option");
      option.value = el[0];
      const name = el[1] ? el[1].name : "";
      option.innerHTML = el[0] + " - " + name;
      select.appendChild(option);
    }
  });
}

//Конвертация
export function exchange(fromValue, course, currency) {
  return `${(fromValue * course).toFixed(2)} ${currency}`;
}

//получение координат геопозиции пользователя
export function getGeolocation() {
  return new Promise((res, rej) => {
    navigator.geolocation.getCurrentPosition((position) =>
      res(position.coords)
    );
  });
}

//установка активного пункта SELECT
export function setActiveOption(select, value) {
  const optionsArr = Array.apply(null, select.options);
  const initIdx = optionsArr.findIndex((el) => el.value === value);
  select[initIdx].selected = true;
}

//определение выбранного пункт SELECT
export function getCurrencyCode(sourseSelect) {
  return sourseSelect.options[sourseSelect.selectedIndex].value;
}
