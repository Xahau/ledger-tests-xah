import fs from 'fs'
import util from 'util'
import { Wallet, encode } from '@transia/xrpl'
import SpeculosTransport from '@ledgerhq/hw-transport-node-speculos'
import Xrp from '@ledgerhq/hw-app-xrp'
import { DeviceData, LedgerTestContext } from './types'
import { balance, fund, ICXRP, limit, pay, trust } from './xrpl-helpers/tools'
import { XrplIntegrationTestContext } from './xrpl-helpers/setup'
import ECDSA from '@transia/xrpl/dist/npm/ECDSA'

const apduPort = 40000

export async function setupLedger(
  testContext: XrplIntegrationTestContext
): Promise<LedgerTestContext> {
  console.log('Connecting to device...')

  try {
    const transport = await SpeculosTransport.open({ apduPort })
    const xrp = new Xrp(transport)
    const deviceData = await xrp.getAddress("44'/144'/0'/0/0")
    console.log(`Got address: ${deviceData.address}`)
    console.log('Connection established!')
    if ((await balance(testContext.client, deviceData.address)) < 1000) {
      await fund(
        testContext.client,
        testContext.master,
        new ICXRP(10000),
        ...[deviceData.address]
      )
    }
    if (
      (await limit(testContext.client, deviceData.address, testContext.ic)) <
      100000
    ) {
      await trust(
        testContext.client,
        testContext.ic.set(100000),
        ...[
          Wallet.fromMnemonic(process.env.LEDGER_MNEMONIC, {
            mnemonicEncoding: 'bip39',
            algorithm: ECDSA.ed25519,
          }),
        ]
      )
    }
    if (
      (await balance(testContext.client, deviceData.address, testContext.ic)) <
      10000
    ) {
      await pay(
        testContext.client,
        testContext.ic.set(50000),
        testContext.gw,
        ...[deviceData.address]
      )
    }
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
  testContext: XrplIntegrationTestContext,
  ledgerContext: LedgerTestContext,
  file: string
): Promise<string> {
  const fileContent = fs
    .readFileSync(file, { encoding: 'utf-8' })
    .replace(/OWN_ADDR/g, ledgerContext.deviceData.address)

  const transactionJSON = JSON.parse(fileContent)

  // clear fields
  delete transactionJSON.Fee
  delete transactionJSON.Sequence
  delete transactionJSON.SigningPubKey
  const preparedTx = await testContext.client.autofill(transactionJSON, 0)
  preparedTx.SigningPubKey = ledgerContext.deviceData.publicKey.toUpperCase()

  // Output pretty-printed test data
  console.log(
    util.inspect(preparedTx, {
      colors: true,
      compact: false,
      depth: Infinity,
    })
  )

  const transactionBlob = encode(preparedTx)

  console.log(
    util.inspect(transactionBlob, {
      colors: true,
      compact: false,
      depth: Infinity,
    })
  )

  try {
    const signature = await ledgerContext.app.signTransaction(
      "44'/144'/0'/0/0",
      transactionBlob
    )
    preparedTx.TxnSignature = signature.toUpperCase()
    return encode(preparedTx)
  } catch (error: any) {
    console.log(error)

    switch (error.statusText) {
      case 'UNKNOWN_ERROR':
        console.log(
          `Unsupported transaction (${error.statusCode.toString(16)})`
        )
        break
      case 'CONDITIONS_OF_USE_NOT_SATISFIED':
        console.log('Incorrect representation')
        break
      case 'INCORRECT_LENGTH':
        console.log(
          `Too large transaction (size: ${transactionBlob.length / 2})`
        )
        break
      default:
        console.log(error.statusText || `Unknown error (${error.message})`)
    }
  }
}

export async function blobTransaction(
  address: string,
  publicKey: string,
  file: string
): Promise<string> {
  const fileContent = fs
    .readFileSync(file, { encoding: 'utf-8' })
    .replace(/OWN_ADDR/g, address)
    .replace(/OWN_PUBKEY/g, publicKey.toUpperCase())

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
    return transactionBlob
  } catch (error: any) {
    fail(`Unknown (${error.message})`)
  }
}
