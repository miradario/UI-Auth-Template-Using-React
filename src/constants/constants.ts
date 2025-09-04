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
      'P1',
      'SSY',
      'SKY campus',
      'Yes',
      'AE',
      'Sahaj',
      'P2',
      'SSY2',
      'Prision',
      'DSN',
      'VTP',
      'TTC',
      'Premium',
      'RAS',
      'Eternity',
      'Intuition',
      'Scanning',
      'Angels',
      'Ansiedad y sueño profundo'
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
}
