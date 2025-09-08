import { FiltersFieldsType } from '../types/filters.types'
import { UserType } from '../types/user.types'
import { StringsUtils } from './strings.utils'

export class UserUtils {
  static orderArray = (array: any[], param: string) => {
    let filterArray =
      param === 'updatedAt' ? array.filter(el => !!el.updatedAt) : array
    const notUpdated = array.filter(el => !el.updatedAt)

    filterArray =
      param === 'birthday'
        ? filterArray.filter(el => !!el.birthday)
        : filterArray
    const notBirthday = array.filter(el => !el.birthday)

    let min, aux
    for (let i = 0; i < filterArray.length - 1; i++) {
      min = i
      for (let j = i + 1; j < filterArray.length; j++) {
        if (param === 'email') {
          if (
            filterArray[j][param]?.toLowerCase() <
            filterArray[min][param]?.toLowerCase()
          )
            min = j
        } else {
          if (param === 'updatedAt') {
            if (filterArray[j].updatedAt <= filterArray[min].updatedAt) min = j
          } else {
            if (
              param === 'birthday' &&
              filterArray[j].birthday &&
              filterArray[min].birthday
            ) {
              const dateJ = new Date(filterArray[j].birthday).getMilliseconds()
              const dateMin = new Date(
                filterArray[min].birthday
              ).getMilliseconds()
              if (dateJ < dateMin) min = j
            } else {
              if (
                filterArray[j][param]?.toString()?.toLowerCase().trim() <
                filterArray[min][param]?.toString()?.toLowerCase().trim()
              )
                min = j
            }
          }
        }
      }

      if (min !== i) {
        aux = filterArray[i]
        filterArray[i] = filterArray[min]
        filterArray[min] = aux
      }
    }

    return param === 'updatedAt'
      ? [...filterArray, ...notUpdated]
      : param === 'birthday'
      ? [...filterArray, ...notBirthday]
      : filterArray
  }

  static filterDataSearch = (array: UserType[], value: string) => {
    const real_value = StringsUtils.removeAccents(value)
    return array.filter(
      el =>
        StringsUtils.removeAccents(el.name)
          ?.toLowerCase()
          .includes(real_value) ||
        StringsUtils.removeAccents(el.email)
          ?.toLowerCase()
          .includes(real_value) ||
        StringsUtils.removeAccents(el.lastName)
          ?.toLowerCase()
          .includes(real_value) ||
        StringsUtils.removeAccents(el.name + ' ' + el.lastName)
          ?.toLowerCase()
          .includes(real_value)
    )
  }

  static filterUsers = (array: UserType[], filters: FiltersFieldsType) => {
    let filterArray = [...array]

    //FILTRO EXISTENCIA DE NOMBRE
    if (filters.name !== null)
      filterArray = this.filterByValue([...filterArray], 'name', filters.name)

    //FILTRO EXISTENCIA DE LASTNAME
    if (filters.lastName !== null)
      filterArray = this.filterByValue(
        [...filterArray],
        'lastName',
        filters.lastName
      )

    //FILTRO EXISTENCIA DE EMAIL
    if (filters.email !== null)
      filterArray = this.filterByValue([...filterArray], 'email', filters.email)

    //FILTRO PAIS DE ORIGEN
    if (filters.country.length > 0)
      filterArray = this.multiFilters(
        [...filterArray],
        'country',
        filters.country
      )

    //FILTRO POR CURSOS
    if (filters.courses.length > 0)
      filterArray = this.filterPerCourses([...filterArray], filters.courses)

    //FILTRO TTCDATE
    if (filters.TTCDate.length > 0)
      filterArray = this.multiFilters(
        [...filterArray],
        'TTCDate',
        filters.TTCDate
      )

    //FILTRO ESTADO (AUTENTICADO/NO)
    if (filters.state !== null) {
      filterArray = this.filterByValue(
        [...filterArray],
        'authenticated',
        filters.state
      )
    }

    //FILTRO TELEFONO
    if (filters.phone !== null)
      filterArray = this.filterByValue([...filterArray], 'phone', filters.phone)

    //FILTRO PAIS DE RESIDENCIA
    if (filters.teach_country.length > 0)
      filterArray = this.multiFilters(
        [...filterArray],
        'teach_country',
        filters.teach_country
      )

    return filterArray
  }

  private static filterByValue = (
    array: any[],
    attribute: string,
    value: any,
    equal = true
  ) => {
    const filter = array.filter(el => {
      const boolAttribute =
        attribute === 'authenticated' && el[attribute] === undefined
          ? true
          : !!el[attribute]

      // eslint-disable-next-line eqeqeq
      return equal ? boolAttribute == value : boolAttribute != value
    })

    return filter
  }

  private static multiFilters = (
    array: any[],
    attribute: string,
    values: string[]
  ) => {
    const filter = array.filter(el => {
      return (
        typeof el[attribute] == 'string' &&
        values.includes(el[attribute]?.toLowerCase()?.trim())
      )
    })
    return filter
  }

  private static filterPerCourses = (array: any[], values: string[]) => {
    const filter = array.filter(el => {
      if (!el.course) return false

      const entries = Object.entries(el.course)
      const filterEntries = entries.filter(
        entry => values.includes(entry[0]) && entry[1] === 'si'
      )

      return filterEntries.length === values.length
    })

    return filter
  }
}
