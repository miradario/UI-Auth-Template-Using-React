export type FiltersFieldsType = {
  name: string | null
  lastName: string | null
  email: string | null
  country: string[]
  state: string | null
  TTCDate: string[] // o Date[] si realmente son fechas
  courses: string[]
  phone: string | null
  teach_country: string[]
}

export type OrderActive = {
  by: string
  value: string
  active: boolean
}

export type FiltersType = {
  searchValue: string
  orderActive: OrderActive
  filters: FiltersFieldsType
  showInactive: boolean
}

export type PaginationType = {
  page: number
  perPage: number
  totalPages: number
}
