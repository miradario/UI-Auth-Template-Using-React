import { UserType } from '../types/user.types'
import * as XLSX from 'xlsx'

export class ExcelUtils {
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
}
