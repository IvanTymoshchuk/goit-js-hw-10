export const fetchCountries = name => {
  const BASE_URL = 'https://restcountries.com/v3.1/name/';
  const properties = 'fields=name,capital,population,flags,languages';

  return fetch(`${BASE_URL}${name}?${properties}`).then(response => {
    console.log(response);
    if (!response.ok) {
      throw new Error(response.status);
    }
    return response.json();
  });
};