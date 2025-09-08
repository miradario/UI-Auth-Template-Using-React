export class StringsUtils {
  static removeAccents = (str: string) => {
    return str?.normalize('NFD')?.replace(/[\u0300-\u036f]/g, '')
  }
}
