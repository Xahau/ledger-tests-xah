import { blobTransaction } from '../../dist/npm/src'
// xrpl-helpers
import { saveBinary } from '../tools'
import fs from 'fs'
import path from 'path'
import util from 'util'

const readdir = util.promisify(fs.readdir)
const stat = util.promisify(fs.stat)
const readFile = util.promisify(fs.readFile)

const ignoreFields = ['SigningPubKey', 'Sequence']
const ignoreFormats = ['NetworkID', 'URI']

// Helper function to format the amount
function formatAmount(amount: string) {
  // Assuming the amount is in drops (the smallest unit in XRP Ledger)
  // and 1 XRP = 1,000,000 drops
  const xrpAmount = parseInt(amount) / 1000000
  return `XAH ${xrpAmount.toFixed(0)}`
}

// Helper function to format the fee
function formatFee(fee: string) {
  // Assuming the fee is in drops
  const xrpFee = parseInt(fee) / 1000000
  return `XAH ${xrpFee.toFixed(6)}`
}

// Helper function to format the account and destination
function formatAccount(account: string) {
  // Insert spaces every 12 characters for readability
  return account.replace(/(.{11})/g, '  $1   ')
}

async function processFixtures(address: string, publicKey: string) {
  console.log(address)
  console.log(publicKey)

  const fixturesDir = 'test/fixtures'
  try {
    const folders = await readdir(fixturesDir)
    for (const folder of folders) {
      const folderPath = path.join(fixturesDir, folder)
      const folderStat = await stat(folderPath)
      if (folderStat.isDirectory()) {
        const files = await readdir(folderPath)
        for (const file of files) {
          if (file.endsWith('.json')) {
            const filepath = path.join(folderPath, file)
            console.log(filepath)
            const textFilePath = filepath.replace('.json', '.txt')
            const textFile = fs.createWriteStream(textFilePath)
            const fileContent = await readFile(filepath, 'utf8')
            // Parse the JSON content
            const jsonData = JSON.parse(fileContent)
            // Loop through the JSON fields
            const issuerAndDestination: any = [] // Array to hold Issuer and Destination fields
            for (const [key, value] of Object.entries(jsonData)) {
              if (!ignoreFields.includes(key)) {
                let formattedValue = value
                switch (key) {
                  case 'Amount':
                    formattedValue = formatAmount(value as string)
                    break
                  case 'Fee':
                    formattedValue = formatFee(value as string)
                    break
                  case 'Account':
                    const accountValue = (value as string).replace(
                      /OWN_ADDR/g,
                      address
                    )
                    formattedValue = formatAccount(accountValue)
                    break
                  case 'Destination':
                  case 'Issuer':
                    // Store Issuer and Destination fields for later processing
                    issuerAndDestination.push({
                      key: key,
                      value: formatAccount(value as string),
                    })
                    continue // Skip writing these fields for now
                }
                if (key === 'Flags' && formattedValue === 0) {
                  break
                }
                if (ignoreFormats.includes(key)) {
                  textFile.write(`${key}; ${formattedValue}\n`)
                } else {
                  textFile.write(
                    `${key
                      .replace(/^([A-Z])|([A-Z])/g, (match, p1, p2) =>
                        p1 ? match : ` ${match}`
                      )
                      .trim()}; ${formattedValue}\n`
                  )
                }
              }
            }
            for (const { key, value } of issuerAndDestination) {
              textFile.write(`${key}; ${value}\n`)
            }
            textFile.end()
            const ledgerRaw = await blobTransaction(
              address,
              publicKey,
              filepath
            )
            saveBinary(filepath.replace('.json', '.raw'), ledgerRaw)
          }
        }
      }
    }
  } catch (error) {
    console.error('Error processing fixtures:', error)
  }
}

describe('Generate All', () => {
  const address = 'rTooLkitCksh5mQa67eaa2JaWHDBnHkpy'
  const publicKey =
    '02B79DA34F4551CA976B66AA78A55C43707EC2BB2BEC39F95BD53F24E2E45A9E67'

  beforeAll(async () => {})
  afterAll(async () => {})

  it('generate all', async () => {
    await processFixtures(address, publicKey)
  })
})
