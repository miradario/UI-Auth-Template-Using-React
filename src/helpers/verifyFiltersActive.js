export const verifyFiltersActive = objectFilter => {
  const values = Object.values(objectFilter)

  const findDistinct = values.some(el => el !== 'Not selected')

  return findDistinct
}
