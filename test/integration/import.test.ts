// xrpl-helpers
import {
  LedgerTestContext,
  setupLedger,
  teardownLedger,
  testTransaction,
} from '../../dist/npm/src'

describe('Import', () => {
  let ledgerContext: LedgerTestContext

  beforeAll(async () => {
    ledgerContext = await setupLedger()
  })
  afterAll(async () => {
    teardownLedger(ledgerContext)
  })

  it('import - all', async () => {
    const signature = await testTransaction(
      ledgerContext,
      'test/fixtures/XX-import/01-basic.json'
    )
    expect(signature).toMatch(
      '3045022100F629BEBD9A7477FAD3BD81A7BCAC23C94EEF9F2D1DA697937ACB26C8814C8EF0022008ED0473A5D3F6DB168F4A7F871DA3EA8105782E2498F4532812A016917A5F00'
    )
  })
})
