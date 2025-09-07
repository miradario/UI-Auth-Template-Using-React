import { FiltersType } from '../types/filters.types'
import {
  CourseType,
  SKYType,
  UserDataAddType,
  ValidRecordCourse
} from '../types/user.types'

export class Constants {
  static COLORS = {
    primary: '#feae00',
    green: 'green',
    red: 'red',
    error: '#b90025ff',
    white: '#ffffff',
    black: '#000000',
    grey: '#808080',
    lightGray: '#a5a5a5'
  }

  static INITIAL_FILTERS: FiltersType = {
    searchValue: '',
    orderActive: {
      by: '',
      value: '',
      active: false
    },
    filters: {
      name: null,
      lastName: null,
      email: null,
      country: [],
      state: null,
      TTCDate: [],
      courses: [],
      phone: null,
      teach_country: []
    },
    showInactive: false
  }

  static FILTERS = {
    ORDER_OPTIONS: [
      { key: 'updatedAt', label: 'Last Update' },
      { key: 'name', label: 'Name' },
      { key: 'lastName', label: 'Last Name' },
      { key: 'TTCDate', label: 'First TTC Date' },
      { key: 'country', label: 'Origin Country' },
      { key: 'teach_country', label: 'Residence Country' },
      { key: 'email', label: 'Email' },
      { key: 'phone', label: 'Phone' }
    ],
    PER_PAGE: [25, 50, 100]
  }

  static COURSE_OPTIONS: { key: ValidRecordCourse; label: string }[] = [
    { key: 'HP', label: 'Parte 1' },
    { key: 'premium', label: 'Premium' },
    { key: 'SSY', label: 'SSY' },
    { key: 'SkyCampus', label: 'SKY Campus' },
    { key: 'Yes', label: 'YES' },
    { key: 'AE', label: 'AE' },
    { key: 'Sahaj', label: 'Sahaj' },
    { key: 'Parte2', label: 'Parte 2' },
    { key: 'Parte2SSY', label: 'Parte2 SSY' },
    { key: 'Prision', label: 'Prision' },
    { key: 'DSN', label: 'DSN' },
    { key: 'VTP', label: 'VTP' },
    { key: 'TTC', label: 'TTC' },
    { key: 'RAS', label: 'RAS' },
    { key: 'Eternity', label: 'Eternity' },
    { key: 'Intuition', label: 'Intuition' },
    { key: 'Scanning', label: 'Scanning' },
    { key: 'Angels', label: 'Angels' },
    { key: 'AnxDeepSleep', label: 'Ansiedad y sueño profundo' }
  ]

  static TABLE = {
    HEADER: [
      'Edit',
      'Active',
      'Forgot Password',
      'Authenticate',
      '',
      'Delete',
      'Last Update',
      'Name',
      'Last Name',
      'Email',
      'Phone',
      'Country Origin',
      'Country Residence',
      'Code',
      'Long',
      'Short',
      'Status',
      'First TTC Date',
      'TTC Place',
      'Sign Contract',
      'Comment',
      ...this.COURSE_OPTIONS.map(course => course.label)
    ]
  }

  static ROUTES = {
    SIGN_UP: '/signup',
    SIGN_IN: '/signin',
    LANDING: '/',
    HOME: '/home',
    CARD: '/card/:id',
    ACCOUNT: '/account',
    USERS: '/users',
    ADDUSERS: '/add-users',
    PASSWORD_FORGET: '/pw-forget'
  }

  static INITIAL_COURSES_ADD_USER: CourseType<boolean> = {
    AE: false,
    DSN: false,
    HP: false,
    Parte2: false,
    Parte2SSY: false,
    Prision: false,
    SSY: false,
    Sahaj: false,
    SkyCampus: false,
    TTC: false,
    VTP: false,
    Yes: false,
    premium: false,
    RAS: false,
    Eternity: false,
    Intuition: false,
    Scanning: false,
    Angels: false,
    AnxDeepSleep: false
  }

  static INITIAL_SKY_ADD_USER: SKYType = {
    ae: 0,
    long: 0,
    short: 0
  }

  static INITIAL_DATA_ADD_USER: UserDataAddType = {
    name: '',
    lastName: '',
    email: '',
    phone: '',
    placeTTC: '',
    sign: 0,
    teach_country: '',
    TTCDate: '',
    authenticated: 0,
    comment: '',
    country: '',
    inactive: false,
    code: '',
    course: this.INITIAL_COURSES_ADD_USER,
    SKY: this.INITIAL_SKY_ADD_USER
  }

  static SKY_OPTIONS = [
    { key: 'ae', label: 'AE' },
    { key: 'long', label: 'Long' },
    { key: 'short', label: 'Short' }
  ]
}
