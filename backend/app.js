const XLSX = require('xlsx')
const fs = require('fs')
// Ruta del archivo Excel
const filePath = 'altas_aol.xlsx'

// Cursos válidos según tipado
const validCourses = [
  'AE',
  'DSN',
  'HP',
  'Parte2',
  'Parte2SSY',
  'Prision',
  'SSY',
  'Sahaj',
  'SkyCampus',
  'TTC',
  'VTP',
  'Yes',
  'premium',
  'RAS',
  'Eternity',
  'Intuition',
  'Scanning',
  'Angels',
  'AnxDeepSleep'
]

// Leer Excel
const workbook = XLSX.readFile(filePath)
const sheetName = workbook.SheetNames[0]
const rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName])

// Función para mapear cada fila
function mapRow (row) {
  // SKY (ae siempre 0)
  const SKY = {
    ae: 0,
    long: Number(row.long || 0),
    short: Number(row.short || 0)
  }

  // Courses
  const course = {}
  for (const c of validCourses) {
    let val = row[c]
    if (!val || String(val).trim() === '') {
      val = 'no'
    } else {
      val = String(val).toLowerCase()
      if (val !== 'si' && val !== 'no') {
        val = 'no'
      }
    }
    course[c] = val
  }

  return {
    SKY,
    email: String(row.email || '').trim(),
    inactive: Boolean(row.inactive || false),
    lastName: String(row.lastName || '').trim(),
    name: String(row.name || '').trim(),
    phone: String(row.phone || '').trim(),
    placeTTC: String(row.placeTTC || '').trim(),
    sign: Number(row.sign || 0),
    teach_country: String(row.teach_country || '').trim(),
    TTCDate: String(row.TTCDate || '').trim(),
    authenticated: 1, // forzado a 1
    comment: String(row.comment || '').trim(),
    country: String(row.country || '').trim(),
    course,
    updatedAt: Date.now(),
    code: String(row.code || '').trim()
  }
}

// Construir objeto final
const jsonData = {}
for (const row of rows) {
  const email = String(row.email || '').trim()
  if (email) {
    jsonData[email] = mapRow(row)
  }
}

// Guardar en archivo JSON
fs.writeFileSync('users_data.json', JSON.stringify(jsonData, null, 2), 'utf8')

console.log('✅ Archivo users_data.json generado correctamente')
