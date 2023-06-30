export const filterUsers = (array, filtros) => {
  let filterArray = [...array]

  //FILTRO EXISTENCIA DE NOMBRE
  if (filtros.name !== 'Not selected')
    filterArray = filterByValue(
      [...filterArray],
      'name',
      '',
      filtros.name === 'vacio'
    )

  //FILTRO EXISTENCIA DE LASTNAME
  if (filtros.lastName !== 'Not selected')
    filterArray = filterByValue(
      [...filterArray],
      'lastName',
      '',
      filtros.lastName === 'vacio'
    )

  //FILTRO EXISTENCIA DE EMAIL
  if (filtros.email !== 'Not selected')
    filterArray = filterByValue(
      [...filterArray],
      'email',
      '',
      filtros.email === 'vacio'
    )

  //FILTRO PAIS DE ORIGEN
  if (filtros.country !== 'Not selected')
    filterArray = filterByValue(
      [...filterArray],
      'country',
      filtros.country === 'vacio' ? '' : filtros.country
    )
  //FILTRO TTCDATE
  if (filtros.TTCDate !== 'Not selected')
    filterArray = filterByValue(
      [...filterArray],
      'TTCDate',
      filtros.TTCDate === 'vacio' ? '' : filtros.TTCDate
    )

  //FILTRO ESTADO (AUTENTICADO/NO)
  if (filtros.state !== 'Not selected')
    filterArray = filterByValue(
      [...filterArray],
      'authenticated',
      filtros.state === 'autenticados' ? '1' : '0'
    )

  //FILTRO TELEFONO
  if (filtros.phone !== 'Not selected')
    filterArray = filterByValue(
      [...filterArray],
      'phone',
      '',
      filtros.phone === 'vacio'
    )

  //FILTRO PAIS DE RESIDENCIA
  if (filtros.teach_country !== 'Not selected') {
    filterArray = filterByValue(
      [...filterArray],
      'teach_country',
      filtros.teach_country === 'vacio' ? '' : filtros.teach_country
    )
  }

  return filterArray
}

const filterByValue = (array, attribute, value, equal = true) => {
  const filter = array.filter(el => {
    let valueAux =
      attribute === 'authenticated' &&
      value != 0 &&
      el[1][attribute]?.toString().toLowerCase() === undefined
        ? undefined
        : value

    return equal
      ? el[1][attribute]?.toString().toLowerCase() == valueAux
      : el[1][attribute]?.toString().toLowerCase() != valueAux
  })
  return filter
}
