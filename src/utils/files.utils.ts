import { UserType } from '../types/user.types'
import * as XLSX from 'xlsx'

export class FileUtils {
  static exportDataToExcel = async (users: UserType[]) => {
    const dataWithoutId = users.map((el: UserType) => {
      const newData: any = {
        id: el.userKey,
        ...el,
        ...el.SKY,
        ...el.course,
        authenticated: el.authenticated !== undefined ? el.authenticated : 1
      }

      delete newData.SKY
      delete newData.course

      return newData
    })

    const libro = XLSX.utils.book_new()
    const hoja = XLSX.utils.json_to_sheet(dataWithoutId)
    XLSX.utils.book_append_sheet(libro, hoja, 'Users')

    await new Promise(resolve => setTimeout(resolve, 1500))

    XLSX.writeFile(libro, 'Users_TeachersAOL.xlsx')
  }

  static exportDataToJSON = (users: UserType[]) => {
    try {
      const generateObject: any = {}

      users.forEach(user => {
        const { userKey, ...userData } = user
        generateObject[userKey] = userData
      })

      const quantityUsers = Object.keys(generateObject).length

      const json = JSON.stringify(
        {
          quantity: quantityUsers,
          users: generateObject
        },
        null,
        2
      )
      const blob = new Blob([json], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      const dateTodayMMDDYYYY = new Date()
        .toLocaleDateString('en-GB')
        .replace(/\//g, '-')

      a.href = url
      a.download = `Users_TeachersAOL_${dateTodayMMDDYYYY}.json`

      document.body.appendChild(a)

      a.click()

      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error exporting data to JSON:', error)
      alert('An error occurred while exporting data to JSON.')
    }
  }
}
