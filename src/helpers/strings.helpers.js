export const removeAccents = cadena => {
  return cadena?.normalize('NFD')?.replace(/[\u0300-\u036f]/g, '')
}
