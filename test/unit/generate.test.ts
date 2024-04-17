import { convertHexToString, decode } from '@transia/xrpl'
import { blobTransaction } from '../../dist/npm/src'
// xrpl-helpers
import { saveBinary, saveJson } from '../tools'
import fs from 'fs'
import path from 'path'
import util from 'util'
import {
  accountSetFlagsToString,
  claimRewardFlagsToString,
  offerCreateFlagsToString,
  paymentChannelClaimFlagsToString,
  paymentFlagsToString,
  trustSetFlagsToString,
  uriTokenMintFlagsToString,
} from './xrplJS'

const readdir = util.promisify(fs.readdir)
const stat = util.promisify(fs.stat)
const readFile = util.promisify(fs.readFile)

const ignoreFields = ['SigningPubKey', 'Sequence']
// const ignoreFormats = [
//   'URI',
//   'SigningPubKey',
//   'NetworkID',
//   'InvoiceID',
//   'AccountTxnID',
//   'CheckID',
//   'EscrowID',
//   'OfferID',
//   'URITokenID',
// ]

// Helper function to format the amount
// function formatPaths(paths: any) {}

// Helper function to format the amount
function formatAmount(amount: any) {
  if (typeof amount === 'string') {
    const xrpAmount = parseInt(amount) / 1000000
    return `XAH ${xrpAmount.toFixed(0)}`
  }
  if (amount.currency > 3) {
    return amount.value
  }
  return `${amount.currency} ${amount.value}`
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
  if (account.length === 33) {
    return account.replace(/(.{11})/g, '  $1   ')
  }
  return account.replace(/(.{12})/g, '  $1   ')
}

function formatPathCurrency(i: number, ii: number, element: any) {
  return `Currency [P${i}: S${ii}]; ${element.currency}\n`
}
function formatPathIssuer(i: number, ii: number, element: any) {
  return `Issuer [P${i}: S${ii}]; ${formatAccount(element.issuer)}\n`
}
function formatPathAccount(i: number, ii: number, element: any) {
  return `Account [P${i}: S${ii}]; ${formatAccount(element.account)}\n`
}
function formatMemoData(i: number, element: any) {
  return `Memo Data [${i}]; ${convertHexToString(element.MemoData)}\n`
}
function formatMemoFormat(i: number, element: any) {
  return `Memo Fmt [${i}]; ${convertHexToString(element.MemoFormat)}\n`
}
function formatMemoType(i: number, element: any) {
  return `Memo Type [${i}]; ${convertHexToString(element.MemoType)}\n`
}
function formatParamName(i: number, element: any) {
  return `Hook Param Name [${i}]; ${element.HookParameterName}\n`
}
function formatParamValue(i: number, element: any) {
  return `Hook Param Value [${i}]; ${element.HookParameterValue}\n`
}
function formatSignerPK(i: number, element: any) {
  return `Sig.PubKey [${i}]; ${element.TxnSignature}\n`
}
function formatSignerTxn(i: number, element: any) {
  return `Txn Sig. [${i}]; ${element.SigningPubKey}\n`
}
function formatSignerAccount(i: number, element: any) {
  return `Account [${i}]; ${element.Account}\n`
}

const filterMultisign = [
  '17-multi-sign-parallel.json',
  '18-multi-sign-serial.json',
]
async function processFixtures(address: string, publicKey: string) {
  const fixturesDir = 'test/testcases'
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
            const name = filepath.split('/').pop() as string
            const isMultiSign = filterMultisign.includes(name)
            const textFilePath = filepath.replace('.json', '.txt')
            const textFile = fs.createWriteStream(textFilePath)
            const fileContent = await readFile(filepath, 'utf8')
            // Parse the JSON content
            const jsonData = JSON.parse(fileContent)
            // Loop through the JSON fields
            for (const [key, value] of Object.entries(jsonData)) {
              if (ignoreFields.includes(key)) {
                continue
              }
              let formattedValue = value

              // Format
              switch (key) {
                case 'DeliverMax':
                case 'DeliverMin':
                case 'SendMax':
                case 'TakerPays':
                case 'TakerGets':
                case 'Balance':
                case 'Amount':
                  formattedValue = formatAmount(value as any)
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
                case 'Owner':
                case 'Destination':
                case 'Issuer':
                  formattedValue = formatAccount(value as string)
                  break
              }

              // Write to File
              switch (key) {
                case 'Flags':
                  if ((formattedValue as number) === 0) {
                    continue
                  }
                  if (jsonData.TransactionType === 'Payment') {
                    const flagsString = paymentFlagsToString(
                      formattedValue as number
                    )
                    textFile.write(`Flags; ${flagsString}\n`)
                  }
                  if (jsonData.TransactionType === 'AccountSet') {
                    const flagsString = accountSetFlagsToString(
                      formattedValue as number
                    )
                    textFile.write(`Flags; ${flagsString}\n`)
                  }
                  if (jsonData.TransactionType === 'OfferCreate') {
                    const flagsString = offerCreateFlagsToString(
                      formattedValue as number
                    )
                    textFile.write(`Flags; ${flagsString}\n`)
                  }
                  if (jsonData.TransactionType === 'PaymentChannelClaim') {
                    const flagsString = paymentChannelClaimFlagsToString(
                      formattedValue as number
                    )
                    textFile.write(`Flags; ${flagsString}\n`)
                  }
                  if (jsonData.TransactionType === 'TrustSet') {
                    const flagsString = trustSetFlagsToString(
                      formattedValue as number
                    )
                    textFile.write(`Flags; ${flagsString}\n`)
                  }
                  if (jsonData.TransactionType === 'URITokenMint') {
                    const flagsString = uriTokenMintFlagsToString(
                      formattedValue as number
                    )
                    textFile.write(`Flags; ${flagsString}\n`)
                  }
                  if (jsonData.TransactionType === 'ClaimReward') {
                    const flagsString = claimRewardFlagsToString(
                      formattedValue as number
                    )
                    textFile.write(`Flags; ${flagsString}\n`)
                  }
                  break
                case 'Paths':
                  const paths = value as any[]
                  for (let i = 0; i < paths.length; i++) {
                    const _element = paths[i]
                    const _i = i + 1
                    for (let ii = 0; ii < _element.length; ii++) {
                      const __element = _element[ii]
                      const _ii = ii + 1
                      if (__element.issuer !== undefined) {
                        textFile.write(formatPathCurrency(_i, _ii, __element))
                        textFile.write(formatPathIssuer(_i, _ii, __element))
                      } else {
                        textFile.write(formatPathAccount(_i, _ii, __element))
                      }
                    }
                  }
                  break
                case 'Memos':
                  const memos = value as any[]
                  for (let i = 0; i < memos.length; i++) {
                    const element = memos[i].Memo
                    const _i = i + 1
                    if (element.MemoData) {
                      textFile.write(formatMemoData(_i, element))
                    }
                    if (element.MemoType) {
                      textFile.write(formatMemoType(_i, element))
                    }
                    if (element.MemoFormat) {
                      textFile.write(formatMemoFormat(_i, element))
                    }
                  }
                  break
                case 'HookParameters':
                  const hookParams = value as any[]
                  for (let i = 0; i < hookParams.length; i++) {
                    const element = hookParams[i].HookParameter
                    const _i = i + 1
                    if (element.HookParameterName) {
                      textFile.write(formatParamName(_i, element))
                    }
                    if (element.HookParameterValue) {
                      textFile.write(formatParamValue(_i, element))
                    }
                  }
                  break
                case 'Signers':
                  const signers = value as any[]
                  for (let i = 0; i < signers.length; i++) {
                    const element = signers[i].Signer
                    const _i = i + 1
                    if (element.SigningPubKey) {
                      textFile.write(formatSignerPK(_i, element))
                    }
                    if (element.TxnSignature) {
                      textFile.write(formatSignerTxn(_i, element))
                    }
                    if (element.Account) {
                      textFile.write(formatSignerAccount(_i, element))
                    }
                  }
                  break
                case 'NetworkID':
                  textFile.write(
                    `${key.split('ID')[0]} ID; ${formattedValue}\n`
                  )
                  break
                case 'InvoiceID':
                case 'CheckID':
                case 'EscrowID':
                case 'OfferID':
                case 'URITokenID':
                  textFile.write(
                    `${key.split('ID')[0]} ID; ${(
                      formattedValue as string
                    ).toLowerCase()}\n`
                  )
                  break
                case 'AccountTxnID':
                  textFile.write(
                    `Account Txn ID; ${(
                      formattedValue as string
                    ).toLowerCase()}\n`
                  )
                  break
                case 'URI':
                  textFile.write(
                    `URI; ${(formattedValue as string).toLowerCase()}\n`
                  )
                  break
                default:
                  textFile.write(
                    `${key
                      .replace(/^([A-Z])|([A-Z])/g, (match, p1, p2) =>
                        p1 ? match : ` ${match}`
                      )
                      .trim()}; ${formattedValue}\n`
                  )
                  if (
                    (key === 'DeliverMax' ||
                      key === 'DeliverMin' ||
                      key === 'SendMax' ||
                      key === 'TakerPays' ||
                      key === 'TakerGets' ||
                      key === 'Balance' ||
                      key === 'Amount') &&
                    typeof value === 'object'
                  ) {
                    if (
                      // @ts-expect-error -- ignore
                      value.currency.length > 3
                    ) {
                      // @ts-expect-error -- ignore
                      textFile.write(`Currency; ${value.currency}\n`)
                    }
                    // @ts-expect-error -- ignore
                    textFile.write(`Issuer; ${formatAccount(value.issuer)}\n`)
                  }
                  break
              }
            }
            textFile.end()
            const ledgerRaw = await blobTransaction(
              address,
              publicKey,
              filepath
            )
            const decoded = decode(ledgerRaw)
            decoded.Account = 'OWN_ADDR'
            if (!isMultiSign) {
              decoded.SigningPubKey = 'OWN_PUBKEY'
            }
            saveJson(filepath, decoded)
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
