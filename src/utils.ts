import fs from 'fs'
import util from 'util'
import { encode } from '@transia/xrpl'
import SpeculosTransport from '@ledgerhq/hw-transport-node-speculos'
import Xrp from '@ledgerhq/hw-app-xrp'
import { DeviceData, LedgerTestContext } from './types'
const apduPort = 40000

export async function setupLedger(): Promise<LedgerTestContext> {
  console.log('Connecting to device...')

  try {
    const transport = await SpeculosTransport.open({ apduPort })
    const xrp = new Xrp(transport)
    const deviceData = await xrp.getAddress("44'/144'/0'/0/0")
    console.log(`Got address: ${deviceData.address}`)
    console.log('Connection established!')
    return {
      transport: transport,
      app: xrp,
      deviceData: deviceData as DeviceData,
    } as LedgerTestContext
  } catch (error: any) {
    console.error(
      `Failed to establish connection to device! (${
        error.message || 'Unknown reason'
      })`
    )
    throw 'No transport found'
  }
}

export async function teardownLedger(context: LedgerTestContext) {
  context.transport.close()
}

export async function testTransaction(
  context: LedgerTestContext,
  file: string
): Promise<string> {
  const fileContent = fs
    .readFileSync(file, { encoding: 'utf-8' })
    .replace(/OWN_ADDR/g, context.deviceData.address)
    .replace(/OWN_PUBKEY/g, context.deviceData.publicKey.toUpperCase())

  const transactionJSON = JSON.parse(fileContent)

  // Output pretty-printed test data
  console.log(
    util.inspect(transactionJSON, {
      colors: true,
      compact: false,
      depth: Infinity,
    })
  )

  const transactionBlob = encode(transactionJSON)

  try {
    const signature = await context.app.signTransaction(
      "44'/144'/0'/0/0",
      transactionBlob
    )
    return signature.toUpperCase()
  } catch (error: any) {
    console.log(error.message)

    switch (error.statusText) {
      case 'UNKNOWN_ERROR':
        fail(`Unsupported transaction (${error.statusCode.toString(16)})`)
        break
      case 'CONDITIONS_OF_USE_NOT_SATISFIED':
        fail('Incorrect representation')
        break
      case 'INCORRECT_LENGTH':
        fail(`Too large transaction (size: ${transactionBlob.length / 2})`)
        break
      default:
        fail(error.statusText || `Unknown error (${error.message})`)
    }
  }
}
