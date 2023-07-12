export const getDataSet = (array, attribute) => {
  const set = new Set()
  array.forEach(el => {
    if (el[1][attribute]) set.add(el[1][attribute]?.toLowerCase().trim())
  })
  const arr = [...set]
  const finalArray = arr.map(el => {
    return { option: el, select: false }
  })
  return finalArray
}
