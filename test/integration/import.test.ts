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

describe('Import', () => {
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

  it('import - basic', async () => {
    const txBlob = await testTransaction(
      testContext,
      ledgerContext,
      'test/testcases/20-import/01-basic.json'
    )
    const response = await testContext.client.submit(txBlob)
    expect(response.result.engine_result).toMatch('tesSUCCESS')
    await close(testContext.client)
  })
  it('import - isser', async () => {
    const txBlob = await testTransaction(
      testContext,
      ledgerContext,
      'test/testcases/21-import/02-isser.json'
    )
    const response = await testContext.client.submit(txBlob)
    expect(response.result.engine_result).toMatch('tesSUCCESS')
    await close(testContext.client)
  })
})
