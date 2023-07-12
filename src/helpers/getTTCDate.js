export const getTTCDate = array => {
  const ttc = new Set()
  array.forEach(el => {
    if (el[1]?.TTCDate) ttc.add(el[1]?.TTCDate?.toLowerCase().trim())
  })
  const arrayTTC = [...ttc]
  const finalArray = arrayTTC.map(el => {
    return { option: el, select: false }
  })
  return finalArray
}
