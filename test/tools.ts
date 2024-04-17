import * as fs from 'fs'

function readFileSync(filePath: string): Buffer {
  return fs.readFileSync(filePath)
}

function writeToFile(filePath: string, data: Buffer): void {
  fs.writeFileSync(filePath, data)
}

// 'tests/testcases/01-payment/01-basic.raw'
export function loadBinary(filepath: string): string {
  // Usage
  const fileContents: Buffer = readFileSync(filepath)
  const hexRepresentation: string = fileContents.toString('hex').toUpperCase()
  return hexRepresentation
}

// 'tests/testcases/01-payment/01-basic.raw'
export function saveBinary(filepath: string, hex: string): void {
  const bufferFromHex: Buffer = Buffer.from(hex, 'hex')
  writeToFile(filepath, bufferFromHex)
}

// 'tests/testcases/01-payment/01-basic.json'
export function saveJson(filepath: string, json: any): void {
  fs.writeFileSync(filepath, JSON.stringify(json, null, 2))
}
