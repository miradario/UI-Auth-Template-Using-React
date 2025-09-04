export class ObjectUtils {
  static parseJson = (data: any) => {
    if (!data || typeof data !== 'object') return null

    const entries = Object.entries(data)
    const obj: any = {}

    entries.forEach((el: [string, any]) => {
      obj[el[0]] = el[1] === 'true' ? true : el[1] === 'false' ? false : el[1]
    })

    return obj
  }
}
