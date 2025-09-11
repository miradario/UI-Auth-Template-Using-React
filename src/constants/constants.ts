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
    { key: 'AnxDeepSleep', label: 'Ansiedad y sueño profundo' },
    { key: 'TLEX', label: 'TLEX' }
  ]

  static TABLE = {
    HEADER: [
      { label: 'Select', isOrder: false, key: 'select' },
      { label: 'Edit', isOrder: false, key: 'edit' },
      { label: 'Authenticate', isOrder: false, key: 'authenticate' },
      { label: 'Last Update', isOrder: true, key: 'updatedAt' },
      { label: 'Name', isOrder: true, key: 'name' },
      { label: 'Last Name', isOrder: true, key: 'lastName' },
      { label: 'Email', isOrder: true, key: 'email' },
      { label: 'Birthday', isOrder: true, key: 'birthday' },
      { label: 'Phone', isOrder: true, key: 'phone' },
      { label: 'Country Origin', isOrder: true, key: 'country' },
      { label: 'Country Residence', isOrder: true, key: 'teach_country' },
      { label: 'First TTC Date', isOrder: true, key: 'TTCDate' },
      { label: 'Code', isOrder: false, key: 'code' },
      { label: 'Manual Code', isOrder: false, key: 'manualCode' },
      { label: 'Kriya Notes Code', isOrder: false, key: 'kriyaNotesCode' },
      { label: 'Long', isOrder: false, key: 'long' },
      { label: 'Short', isOrder: false, key: 'short' },
      { label: 'Status', isOrder: false, key: 'status' },
      { label: 'TTC Place', isOrder: false, key: 'ttcPlace' },
      { label: 'Sign Contract', isOrder: false, key: 'signContract' },
      { label: 'Comment', isOrder: false, key: 'comment' },
      ...this.COURSE_OPTIONS.map(course => ({
        label: course.label,
        isOrder: false,
        key: course.key
      })),
      { label: 'ID', isOrder: false, key: 'id' }
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
    AnxDeepSleep: false,
    TLEX: false
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
    SKY: this.INITIAL_SKY_ADD_USER,
    manualCode: '',
    birthday: '',
    kriyaNotesCode: ''
  }

  static SKY_OPTIONS = [
    { key: 'long', label: 'Long' },
    { key: 'short', label: 'Short' }
  ]
}
