import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';
import { fetchCountries } from './fetchCountries'; // Іменований імпорт

const DEBOUNCE_DELAY = 300; // затримка для дебоунс

const refs = {
  searchEl : document.querySelector('#search-box'),
 countryInfo : document.querySelector('.country-info'),
 countryList : document.querySelector('.country-list'),
};


const clearMarkup = ref => (ref.innerHTML = '');

const inputHandler = e => {
  const textInput = e.target.value.trim();

  if (!textInput) {
    clearMarkup(refs.countryList);
    clearMarkup(refs.countryInfo);
    return;
  }

  fetchCountries(textInput)
    .then(data => {
      console.log(data);
      if (data.length > 10) {
        Notify.info(
          'Too many matches found. Please enter a more specific name'
        );
        return;
      }
      renderMarkup(data);
    })
    .catch(err => {
      clearMarkup(refs.countryList);
      clearMarkup(refs.countryInfo);
      Notify.failure('Oops...🧟‍♂️, there is no country with that name');
    });
};

const renderMarkup = data => {
  if (data.length === 1) {
    clearMarkup(refs.countryList);
    const markupInfo = createInfoMarkup(data);
    refs.countryInfo.innerHTML = markupInfo;
  } else {
    clearMarkup(refs.countryInfo);
    const markupList = createListMarkup(data);
    refs.countryList.innerHTML = markupList;
  }
};

const createListMarkup = data => {
  return data
    .map(
      ({ name, flags }) =>
        `<li><img src="${flags.png}" alt="${name.official}" width="60" height="40">${name.official}</li>`
    )
    .join('');
};

const createInfoMarkup = data => {
  return data.map(
    ({ name, capital, population, flags, languages }) =>
      `<img src="${flags.png}" alt="${name.official}" width="200" height="100">
      <h1>${name.official}</h1>
      <p>Capital: ${capital}</p>
      <p>Population: ${population}</p>
      <p>Languages: ${Object.values(languages)}</p>`
  );
};

refs.searchEl.addEventListener('input', debounce(inputHandler, DEBOUNCE_DELAY));
