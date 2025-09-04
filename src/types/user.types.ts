export type CourseType = {
  AE: 'si' | 'no'
  DSN: 'si' | 'no'
  HP: 'si' | 'no'
  Parte2: 'si' | 'no'
  Parte2SSY: 'si' | 'no'
  Prision: 'si' | 'no'
  SSY: 'si' | 'no'
  Sahaj: 'si' | 'no'
  SkyCampus: 'si' | 'no'
  TTC: 'si' | 'no'
  VTP: 'si' | 'no'
  Yes: 'si' | 'no'
  premium: 'si' | 'no'
  RAS: 'si' | 'no'
  Eternity: 'si' | 'no'
  Intuition: 'si' | 'no'
  Scanning: 'si' | 'no'
  Angels: 'si' | 'no'
  AnxDeepSleep: 'si' | 'no'
}

export type SKYType = {
  ae: number
  long: number
  short: number
}

export type UserType = {
  SKY: SKYType
  email: string
  inactive: boolean
  lastName: string
  name: string
  phone: string
  placeTTC: string
  sign: number
  teach_country: string
  userKey: string
  TTCDate: string
  authenticated: number
  comment: string
  country: string
  course: CourseType
  updatedAt: number
  code: string
}
