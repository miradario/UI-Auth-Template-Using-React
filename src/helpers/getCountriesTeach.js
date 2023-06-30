export const getCountriesTeach = array => {
  const countries = new Set()
  array.forEach(el => {
    if (el[1]?.country)
      countries.add(el[1]?.teach_country?.toLowerCase().trim())
  })
  const arrayCountry = [...countries]
  return arrayCountry
}
