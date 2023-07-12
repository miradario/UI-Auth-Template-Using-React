export const getCountriesTeach = array => {
  const countries = new Set()
  array.forEach(el => {
    if (el[1]?.teach_country)
      countries.add(el[1]?.teach_country?.toLowerCase().trim())
  })
  const arrayTeachCountry = [...countries]
  const finalArray = arrayTeachCountry.map(el => {
    return { option: el, select: false }
  })
  return finalArray
}
