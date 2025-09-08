export class DatesUtils {
  static formatTimestampToDDMMAAAA = (date: number) => {
    try {
      if (!date) return null
      const dateObj = new Date(date)

      return `${dateObj.getDate().toString().padStart(2, '0')}/${(
        dateObj.getMonth() + 1
      )
        .toString()
        .padStart(2, '0')}/${dateObj.getFullYear()}`
    } catch {
      console.error('Error formatting date (formatTimestampToDDMMAAAA):', date)
      return null
    }
  }

  static formatDateToInput = (date: number) => {
    if (!date) return null
    return new Date(date).toISOString().split('T')[0]
  }

  static formatAAAAMMDDtoDDMMYYYY = (str: string) => {
    if (!str) return str

    const split = str.split('-')
    if (split.length !== 3) return str
    return `${split[2]}/${split[1]}/${split[0]}` // DD/MM/YYYY
  }
}
