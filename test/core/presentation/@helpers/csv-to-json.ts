export function CSVToJSON<T>(csv: string): T[] {
  const [headerLine, ...lines] = csv.split('\n')
  const headers = headerLine
    .split(',')
    .map((header) => header.trim().replace(/"/g, ''))
  return lines.map((line) => {
    const values = line
      .split(',')
      .map((value) => value.trim().replace(/"/g, ''))
    const obj: Record<string, any> = {}
    headers.forEach((header, index) => {
      obj[header] = values[index]
    })
    return obj as T
  })
}
