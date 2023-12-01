import {
  LedgerTestContext,
  setupLedger,
  blobTransaction,
  teardownLedger,
  testTransaction,
} from '../../dist/npm/src'
// xrpl-helpers
import {
  XrplIntegrationTestContext,
  setupClient,
  teardownClient,
  serverUrl,
  close,
} from '@transia/hooks-toolkit/dist/npm/src/libs/xrpl-helpers'
import { saveBinary } from '../tools'

describe('ClaimReward', () => {
  let ledgerContext: LedgerTestContext
  let testContext: XrplIntegrationTestContext

  beforeAll(async () => {
    testContext = await setupClient(serverUrl)
    ledgerContext = await setupLedger(testContext)
  })
  afterAll(async () => {
    teardownClient(testContext)
    teardownLedger(ledgerContext)
  })

  it('claim reward - basic', async () => {
    const filepath = 'test/fixtures/19-claim-reward/01-basic.json'
    const txBlob = await testTransaction(testContext, ledgerContext, filepath)
    await testContext.client.submit(txBlob)
    const response = await testContext.client.submit(txBlob)
    console.log(response)

    // expect(response.result.engine_result).toMatch('tesSUCCESS')
    await close(testContext.client)

    const ledgerRaw = await blobTransaction(ledgerContext, filepath)
    saveBinary(filepath.replace('.json', '.raw'), ledgerRaw)
  })
})
