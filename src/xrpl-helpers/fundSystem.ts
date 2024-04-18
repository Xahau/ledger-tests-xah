import { AccountSetAsfFlags, Client, Wallet } from '@transia/xrpl'
import {
  Account,
  ICXRP,
  IC,
  fund,
  trust,
  pay,
  balance,
  limit,
  accountSet,
  sell,
} from './tools'
import { appLogger } from '../logger'

/**
 * This function will fund a new wallet on the Hooks Local Ledger.
 *
 * @returns {Wallet}
 */
export async function fundSystem(
  client: Client,
  wallet: Wallet,
  ic: IC
): Promise<void> {
  const userAccounts = [
    'gw',
    'alice',
    'bob',
    'carol',
    'dave',
    'elsa',
    'frank',
    'grace',
    'heidi',
    'ivan',
    'judy',
  ]
  const userWallets = userAccounts.map((account) => new Account(account))
  const hookAccounts = ['hook1', 'hook2', 'hook3', 'hook4', 'hook5']
  const hookWallets = hookAccounts.map((account) => new Account(account))

  const USD = ic as IC

  // FUND GW
  const gw = userWallets[0]
  if ((await balance(client, gw.wallet.classicAddress)) == 0) {
    appLogger.debug(
      `SETUP GW: ${await balance(client, gw.wallet.classicAddress)}`
    )
    await fund(client, wallet, new ICXRP(10000000), gw.wallet.classicAddress)
    await accountSet(client, gw.wallet, AccountSetAsfFlags.asfDefaultRipple)
    await sell(client, USD.set(20000), gw.wallet, 0.8)
  }

  const needsFunding = []
  const needsLines = []
  const needsIC = []

  for (let i = 1; i < userWallets.length; i++) {
    const wallet = userWallets[i]

    if ((await balance(client, wallet.wallet.classicAddress)) < 10000000000) {
      appLogger.debug(
        `${wallet.wallet.classicAddress} NEEDS FUNDING: ${await balance(
          client,
          wallet.wallet.classicAddress
        )}`
      )
      needsFunding.push(wallet.wallet.classicAddress)
    }

    if ((await limit(client, wallet.wallet.classicAddress, USD)) < 100000) {
      appLogger.debug(
        `${wallet.wallet.classicAddress} NEEDS TRUST: ${await balance(
          client,
          wallet.wallet.classicAddress
        )}`
      )
      needsLines.push(wallet.wallet)
    }

    if ((await balance(client, wallet.wallet.classicAddress, USD)) < 10000) {
      appLogger.debug(
        `${wallet.wallet.classicAddress} NEEDS IC: ${await balance(
          client,
          wallet.wallet.classicAddress
        )}`
      )
      needsIC.push(wallet.wallet.classicAddress)
    }
  }

  for (let i = 0; i < hookWallets.length; i++) {
    const wallet = hookWallets[i]

    if ((await balance(client, wallet.wallet.classicAddress)) < 10000000000) {
      appLogger.debug(
        `${wallet.wallet.classicAddress} NEEDS FUNDING: ${await balance(
          client,
          wallet.wallet.classicAddress
        )}`
      )
      needsFunding.push(wallet.wallet.classicAddress)
    }
  }

  appLogger.debug(`FUNDING: ${needsFunding.length}`)
  appLogger.debug(`TRUSTING: ${needsLines.length}`)
  appLogger.debug(`PAYING: ${needsIC.length}`)

  await fund(client, wallet, new ICXRP(20000), ...needsFunding)
  await trust(client, USD.set(100000), ...needsLines)
  await pay(client, USD.set(50000), gw.wallet, ...needsIC)

  const destAddress = 'rTooLkitCksh5mQa67eaa2JaWHDBnHkpy'
  if ((await balance(client, destAddress)) < 1000) {
    await fund(client, wallet, new ICXRP(10000), ...[destAddress])
  }
}
