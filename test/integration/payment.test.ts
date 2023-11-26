// xrpl-helpers
import {
  LedgerTestContext,
  setupClient,
  teardownClient,
  testTransaction,
} from '../../dist/npm/src'

// Router: ACCEPT: success

describe('Invoke', () => {
  let testContext: LedgerTestContext

  beforeAll(async () => {
    testContext = await setupClient()
  })
  afterAll(async () => {
    teardownClient(testContext)
  })

  it('invoke - all', async () => {
    console.log('TESTING')
    await testTransaction(testContext, 'test/fixtures/01-payment/01-basic.json')
  })
})
