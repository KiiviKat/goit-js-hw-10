import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

import { fetchCountries } from './js/fetchCountries';

const refs = {
  searchBoxEl: document.querySelector('#search-box'),
  countryListEl: document.querySelector('.country-list'),
  countryInfoEl: document.querySelector('.country-info'),
};

const DEBOUNCE_DELAY = 300;

refs.searchBoxEl.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch() {
  const searchCountry = refs.searchBoxEl.value.trim();

  if (!searchCountry) {
    refs.countryInfoEl.innerHTML = '';
    refs.countryListEl.innerHTML = '';
    return;
  }

  fetchCountries(searchCountry)
    .then(data => {
      if (data.length > 10) {
        return Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      }
      if (data.length > 2 && data.length <= 9) {
        refs.countryInfoEl.innerHTML = '';
        return renderCountryList(data);
      } else refs.countryListEl.innerHTML = '';
      renderCountryInfo(data);
    })
    .catch(error => {
      Notiflix.Notify.failure(
        'Oops, there is no country with that name',
        error
      );
    });
}

function renderCountryList(countries) {
  const markup = countries
    .map(country => {
      return `<li>
            <p><img src="${country.flags.svg}" alt="country flag ${country.name}" width='35' height='20'></img> <b>${country.name.official}</b></p>
          </li>`;
    })
    .join('');
  refs.countryListEl.innerHTML = markup;
}

function renderCountryInfo(country) {
  const markup = country
    .map(country => {
      return `<p style="font-size:24px;"><img src="${
        country.flags.svg
      }" alt="country flag ${country.name}" width='70' height='40'></img> <b>${
        country.name.official
      }</b></p>
            <p><b>Capital</b>: ${country.capital}</p>
            <p><b>Population</b>: ${country.population}</p>
            <p><b>Languages</b>: ${Object.values(country.languages)}</p>`;
    })
    .join('');
  refs.countryInfoEl.innerHTML = markup;
}
