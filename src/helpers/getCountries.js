export const getCountries = array => {
  const countries = new Set()
  array.forEach(el => {
    if (el[1]?.country) countries.add(el[1]?.country?.toLowerCase().trim())
  })
  const arrayCountry = [...countries]
  return arrayCountry
}
