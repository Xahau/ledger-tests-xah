import {
  LedgerTestContext,
  setupLedger,
  teardownLedger,
  testTransaction,
} from '../../dist/npm/src'
// xrpl-helpers
import {
  XrplIntegrationTestContext,
  setupClient,
  teardownClient,
} from '../../dist/npm/src/xrpl-helpers/setup'
import { close } from '../../dist/npm/src/xrpl-helpers/tools'

describe('Remit', () => {
  let ledgerContext: LedgerTestContext
  let testContext: XrplIntegrationTestContext

  beforeAll(async () => {
    testContext = await setupClient()
    ledgerContext = await setupLedger(testContext)
  })
  afterAll(async () => {
    teardownClient(testContext)
    teardownLedger(ledgerContext)
  })

  // it('remit - activate', async () => {
  //   const filepath = 'test/fixtures/28-remit/01-activate.json'
  //   const txBlob = await testTransaction(testContext, ledgerContext, filepath)
  //   const response = await testContext.client.submit(txBlob)
  //   expect(response.result.engine_result).toMatch('tesSUCCESS')
  //   await close(testContext.client)
  // })
  // it('remit - native', async () => {
  //   const filepath = 'test/fixtures/28-remit/02-native.json'
  //   const txBlob = await testTransaction(testContext, ledgerContext, filepath)
  //   const response = await testContext.client.submit(txBlob)
  //   expect(response.result.engine_result).toMatch('tesSUCCESS')
  //   await close(testContext.client)
  // })
  it('remit - issued currency', async () => {
    const filepath = 'test/fixtures/28-remit/03-issued-currency.json'
    const txBlob = await testTransaction(testContext, ledgerContext, filepath)
    const response = await testContext.client.submit(txBlob)
    expect(response.result.engine_result).toMatch('tesSUCCESS')
    await close(testContext.client)
  })
  // it('remit - mint token', async () => {
  //   const filepath = 'test/fixtures/28-remit/04-mint-token.json'
  //   const txBlob = await testTransaction(testContext, ledgerContext, filepath)
  //   const response = await testContext.client.submit(txBlob)
  //   expect(response.result.engine_result).toMatch('tesSUCCESS')
  //   await close(testContext.client)
  // })
  // it('remit - transfer token', async () => {
  //   const filepath = 'test/fixtures/28-remit/05-transfer-token.json'
  //   const txBlob = await testTransaction(testContext, ledgerContext, filepath)
  //   const response = await testContext.client.submit(txBlob)
  //   expect(response.result.engine_result).toMatch('tesSUCCESS')
  //   await close(testContext.client)
  // })
  // it('remit - all', async () => {
  //   const filepath = 'test/fixtures/28-remit/06-all.json'
  //   const txBlob = await testTransaction(testContext, ledgerContext, filepath)
  //   const response = await testContext.client.submit(txBlob)
  //   expect(response.result.engine_result).toMatch('tesSUCCESS')
  //   await close(testContext.client)
  // })
})
