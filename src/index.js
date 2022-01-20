import { fetchCountries } from './fetchCountries';
import { debounce } from 'lodash';
import { Notify } from 'notiflix';
import templateList from './list-template.hbs';
import templateInfo from './info-template.hbs';
import './css/styles.css';

const refs = {
  input: document.querySelector('#search-box'),
  list: document.querySelector('.country-list'),
  info: document.querySelector('.country-info'),
};
const DEBOUNCE_DELAY = 300;

refs.input.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY))

function onSearch(e) {
    let countryName = e.target.value;
    if (countryName === '') {
        clearList();
        return;
    } else {
        clearList();
        fetchCountries(countryName)
        .then(resultJson)
        .then(renderCountries)
        .catch(onError)
    }
}

function resultJson(result) {
    return result.json();
}

function renderCountries(country) {
    if (country.length > 10) {
        return Notify.warning("Too many matches found. Please enter a more specific name.")
    }
    else if (country.length > 1) {
        const markupList = templateList(country);
        refs.list.innerHTML = markupList;
    }
    else if (country.length === 1) {
        const makrupInfo = templateInfo(country);
        refs.info.innerHTML = makrupInfo;
    }
    else {
        onError();
    }
}

function clearList() {
    refs.list.innerHTML = '';
    refs.info.innerHTML = '';
};
 
function onError() {
    Notify.failure("Oops, there is no country with that name")   
}