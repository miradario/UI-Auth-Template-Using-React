export const formatDateDMA = date => {
  if (!date) return null
  const dateObj = new Date(date)

  return `${dateObj.getDate().toString().padStart(2, '0')}/${(
    dateObj.getMonth() + 1
  )
    .toString()
    .padStart(2, '0')}/${dateObj.getFullYear()}`
}
