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

describe('SetHook', () => {
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

  // it('set hook - no-op', async () => {
  //   const txBlob = await testTransaction(
  //     testContext,
  //     ledgerContext,
  //     'test/testcases/22-set-hook/01-noop.json'
  //   )
  //   const response = await testContext.client.submit(txBlob)
  //   expect(response.result.engine_result).toMatch('tesSUCCESS')
  //   await close(testContext.client)
  // })
  // it('set hook - create', async () => {
  //   const txBlob = await testTransaction(
  //     testContext,
  //     ledgerContext,
  //     'test/testcases/22-set-hook/02-create.json'
  //   )
  //   console.log(txBlob)

  //   const response = await testContext.client.submit(txBlob)
  //   expect(response.result.engine_result).toMatch('tesSUCCESS')
  //   await close(testContext.client)
  // })
  // it('set hook - create-params', async () => {
  //   const txBlob = await testTransaction(
  //     testContext,
  //     ledgerContext,
  //     'test/testcases/22-set-hook/03-create-params.json'
  //   )
  //   console.log(txBlob)

  //   const response = await testContext.client.submit(txBlob)
  //   expect(response.result.engine_result).toMatch('tesSUCCESS')
  //   await close(testContext.client)
  // })
  // it('set hook - create-grants', async () => {
  //   const txBlob = await testTransaction(
  //     testContext,
  //     ledgerContext,
  //     'test/testcases/22-set-hook/04-create-grants.json'
  //   )
  //   console.log(txBlob)

  //   const response = await testContext.client.submit(txBlob)
  //   expect(response.result.engine_result).toMatch('tesSUCCESS')
  //   await close(testContext.client)
  // })
  // it('set hook - install', async () => {
  //   const txBlob = await testTransaction(
  //     testContext,
  //     ledgerContext,
  //     'test/testcases/22-set-hook/05-install.json'
  //   )
  //   console.log(txBlob)

  //   const response = await testContext.client.submit(txBlob)
  //   expect(response.result.engine_result).toMatch('tesSUCCESS')
  //   await close(testContext.client)
  // })
  // it('set hook - update', async () => {
  //   const txBlob = await testTransaction(
  //     testContext,
  //     ledgerContext,
  //     'test/testcases/22-set-hook/06-update.json'
  //   )
  //   console.log(txBlob)

  //   const response = await testContext.client.submit(txBlob)
  //   expect(response.result.engine_result).toMatch('tesSUCCESS')
  //   await close(testContext.client)
  // })
  it('set hook - delete', async () => {
    const txBlob = await testTransaction(
      testContext,
      ledgerContext,
      'test/testcases/22-set-hook/07-delete.json'
    )
    const response = await testContext.client.submit(txBlob)
    expect(response.result.engine_result).toMatch('tesSUCCESS')
    await close(testContext.client)
  })
  // it('set hook - delete-ns', async () => {
  //   const txBlob = await testTransaction(
  //     testContext,
  //     ledgerContext,
  //     'test/testcases/22-set-hook/08-delete-ns.json'
  //   )
  //   console.log(txBlob)

  //   const response = await testContext.client.submit(txBlob)
  //   expect(response.result.engine_result).toMatch('tesSUCCESS')
  //   await close(testContext.client)
  // })
})
