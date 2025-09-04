export const getDataSet = (array: any[], attribute: string) => {
  const set = new Set()
  array.forEach(el => {
    if (el[attribute]) set.add(el[attribute]?.toLowerCase().trim())
  })
  const arr = orderArray(Array.from(set))
  return arr
}

const orderArray = (array: any[]) => {
  let min, aux
  for (let i = 0; i < array.length - 1; i++) {
    min = i
    for (let j = i + 1; j < array.length; j++) {
      if (array[j] < array[min]) min = j
    }

    if (min != i) {
      aux = array[i]
      array[i] = array[min]
      array[min] = aux
    }
  }
  return array
}
