export type ValidRecordCourse =
  | 'AE'
  | 'DSN'
  | 'HP'
  | 'Parte2'
  | 'Parte2SSY'
  | 'Prision'
  | 'SSY'
  | 'Sahaj'
  | 'SkyCampus'
  | 'TTC'
  | 'VTP'
  | 'Yes'
  | 'premium'
  | 'RAS'
  | 'Eternity'
  | 'Intuition'
  | 'Scanning'
  | 'Angels'
  | 'AnxDeepSleep'

export type CourseType<T> = Record<ValidRecordCourse, T>

export type SKYType = {
  ae: 0 | 1
  long: 0 | 1
  short: 0 | 1
}

export type UserType = {
  SKY: SKYType
  email: string
  inactive: boolean
  lastName: string
  name: string
  phone: string
  placeTTC: string
  sign: 0 | 1
  teach_country: string
  userKey: string
  TTCDate: string
  authenticated: 0 | 1
  comment: string
  country: string
  course: CourseType<'si' | 'no'>
  updatedAt: number
  code: string
}

export type UserDataAddType = {
  name: string
  lastName: string
  email: string
  phone: string
  placeTTC: string
  sign: 0 | 1
  teach_country: string
  TTCDate: string
  authenticated: 0 | 1
  comment: string
  country: string
  inactive: boolean
  code: string
  SKY: SKYType
  course: CourseType<boolean>
}
