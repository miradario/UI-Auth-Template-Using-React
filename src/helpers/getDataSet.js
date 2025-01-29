export const getDataSet = (array, attribute) => {
  const set = new Set();
  array.forEach((el) => {
    if (el[1][attribute]) set.add(el[1][attribute]?.toLowerCase().trim());
  });
  const arr = orderArray([...set]);
  return arr;
};

const orderArray = (array) => {
  let min, aux;
  for (let i = 0; i < array.length - 1; i++) {
    min = i;
    for (let j = i + 1; j < array.length; j++) {
      if (array[j] < array[min]) min = j;
    }

    if (min != i) {
      aux = array[i];
      array[i] = array[min];
      array[min] = aux;
    }
  }
  return array;
};
