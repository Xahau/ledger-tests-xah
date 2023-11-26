import definitions from './definitions.json'

function convertCamelToScreamingSnake(camelCaseStr: string): string {
  // Use a regular expression to insert an underscore before each uppercase letter
  // and convert the entire string to uppercase.
  return (
    camelCaseStr
      .replace(/([A-Z])/g, '_$1')
      .toUpperCase()
      // Remove the initial underscore if the string starts with a capital letter
      .replace(/^_/, '')
  )
}

function toPaddedHexString(num: number): string {
  if (num < 0 || num > 255) {
    throw new Error('Number must be between 0 and 255.')
  }
  return '0x' + num.toString(16).padStart(2, '0').toUpperCase()
}

async function main() {
  // console.log(definitions.FIELDS)
  for (let index = 0; index < definitions.FIELDS.length; index++) {
    const element = definitions.FIELDS[index]
    if ((element[1] as any).type === 'UInt8') {
      // console.log(element)
      const type = (element[1] as any).type.toUpperCase()
      const name = convertCamelToScreamingSnake(element[0] as string)
      const hex = toPaddedHexString((element[1] as any).nth)
      console.log(`#define XAH_${type}_${name}     ${hex}`)
    }
    if ((element[1] as any).type === 'UInt16') {
      // console.log(element)
      const type = (element[1] as any).type.toUpperCase()
      const name = convertCamelToScreamingSnake(element[0] as string)
      const hex = toPaddedHexString((element[1] as any).nth)
      console.log(`#define XAH_${type}_${name}     ${hex}`)
    }
    if ((element[1] as any).type === 'UInt32') {
      // console.log(element)
      const type = (element[1] as any).type.toUpperCase()
      const name = convertCamelToScreamingSnake(element[0] as string)
      const hex = toPaddedHexString((element[1] as any).nth)
      console.log(`#define XAH_${type}_${name}     ${hex}`)
    }
    if ((element[1] as any).type === 'UInt64') {
      // console.log(element)
      const type = (element[1] as any).type.toUpperCase()
      const name = convertCamelToScreamingSnake(element[0] as string)
      const hex = toPaddedHexString((element[1] as any).nth)
      console.log(`#define XAH_${type}_${name}     ${hex}`)
    }
    if ((element[1] as any).type === 'Hash128') {
      // console.log(element)
      const type = (element[1] as any).type.toUpperCase()
      const name = convertCamelToScreamingSnake(element[0] as string)
      const hex = toPaddedHexString((element[1] as any).nth)
      console.log(`#define XAH_${type}_${name}     ${hex}`)
    }
    if ((element[1] as any).type === 'Hash160') {
      // console.log(element)
      const type = (element[1] as any).type.toUpperCase()
      const name = convertCamelToScreamingSnake(element[0] as string)
      const hex = toPaddedHexString((element[1] as any).nth)
      console.log(`#define XAH_${type}_${name}     ${hex}`)
    }
    if (
      (element[1] as any).type === 'Hash256' &&
      element[0] !== 'hash' &&
      element[0] !== 'index'
    ) {
      // console.log(element)
      const type = (element[1] as any).type.toUpperCase()
      const name = convertCamelToScreamingSnake(element[0] as string)
      const hex = toPaddedHexString((element[1] as any).nth)
      console.log(`#define XAH_${type}_${name}     ${hex}`)
    }
    if (
      (element[1] as any).type === 'Amount' &&
      element[0] !== 'taker_gets_funded' &&
      element[0] !== 'taker_pays_funded'
    ) {
      // console.log(element)
      const type = (element[1] as any).type.toUpperCase()
      const name = convertCamelToScreamingSnake(element[0] as string)
      const hex = toPaddedHexString((element[1] as any).nth)
      console.log(`#define XAH_${type}_${name}     ${hex}`)
    }
    if ((element[1] as any).type === 'Blob') {
      // console.log(element)
      const name = convertCamelToScreamingSnake(element[0] as string)
      const hex = toPaddedHexString((element[1] as any).nth)
      console.log(`#define XAH_VL_${name}     ${hex}`)
    }
    if ((element[1] as any).type === 'AccountID') {
      // console.log(element)
      const name = convertCamelToScreamingSnake(element[0] as string)
      const hex = toPaddedHexString((element[1] as any).nth)
      console.log(`#define XAH_ACCOUNT_${name}     ${hex}`)
    }
    if ((element[1] as any).type === 'Vector256') {
      // console.log(element)
      const type = (element[1] as any).type.toUpperCase()
      const name = convertCamelToScreamingSnake(element[0] as string)
      const hex = toPaddedHexString((element[1] as any).nth)
      console.log(`#define XAH_${type}_${name}     ${hex}`)
    }
    if ((element[1] as any).type === 'STObject') {
      // console.log(element)
      const type = (element[1] as any).type.toUpperCase()
      const name = convertCamelToScreamingSnake(element[0] as string)
      const hex = toPaddedHexString((element[1] as any).nth)
      console.log(`#define XAH_${type}_${name}     ${hex}`)
    }
    if ((element[1] as any).type === 'STArray') {
      // console.log(element)
      const type = (element[1] as any).type.toUpperCase()
      const name = convertCamelToScreamingSnake(element[0] as string)
      const hex = toPaddedHexString((element[1] as any).nth)
      console.log(`#define XAH_${type}_${name}     ${hex}`)
    }
  }
}

main()
