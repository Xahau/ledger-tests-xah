import {
  AccountSetAsfFlags,
  AccountSetTfFlags,
  OfferCreateFlags,
  PaymentChannelClaimFlags,
  PaymentFlags,
  PaymentFlagsInterface,
  SetHookFlags,
  TrustSetFlags,
  URITokenMintFlags,
} from '@transia/xrpl'

export enum ClaimRewardFlags {
  tfOptOut = 1,
}

export enum AccountAsfStringFlags {
  asfPasswordSpent = 'Password Spent',
  asfRequireDest = 'Require Dest',
  asfRequireAuth = 'Require Auth',
  asfDisallowXRP = 'Disallow XAH',
  asfDisableMaster = 'Disable Master',
  asfNoFreeze = 'No Freeze',
  asfGlobalFreeze = 'Global Freeze',
  asfDefaultRipple = 'Default Ripple',
  asfDepositAuth = 'Deposit Auth',
  asfDisallowIncomingNFTokenOffer = 'Disallow NFT Offers',
  asfDisallowIncomingCheck = 'Disallow Checks',
  asfDisallowIncomingPayChan = 'Disallow Pay. Channels',
  asfDisallowIncomingTrustline = 'Disallow Trustlines',
  asfAuthorizedNFTokenMinter = 'Authorized NFToken Minter',
  asfURITokenIssuer = 'URI Token Issuer',
  asfDisallowIncomingRemit = 'Disallow Remits',
  asfTshCollect = 'TSH Collect',
  asfAccountTxnID = 'Track Txn ID',
}

export enum AccountSetStringFlags {
  tfRequireDestTag = 'Require Dest Tag',
  tfOptionalDestTag = 'Optional Dest Tag',
  tfRequireAuth = 'Require Auth',
  tfOptionalAuth = 'Optional Auth',
  tfDisallowXRP = 'Disallow XAH',
  tfAllowXRP = 'Allow XAH',
}

export enum PaymentStringFlags {
  tfNoDirectRipple = 'No Direct Ripple',
  tfPartialPayment = 'Partial Payment',
  tfLimitQuality = 'Limit Quality',
}

export enum OfferCreateStringFlags {
  tfPassive = 'Passive',
  tfImmediateOrCancel = 'Immediate or Cancel',
  tfFillOrKill = 'Fill or Kill',
  tfSell = 'Sell',
}

export enum PaymentChannelClaimStringFlags {
  tfRenew = 'Renew',
  tfClose = 'Close',
}

export enum SetHookStringFlags {
  hsfOverride = 'Override',
  hsfNSDelete = 'Namespace Delete',
  hsfCollect = 'Collect',
}

export enum TrustSetStringFlags {
  tfSetfAuth = 'Set Auth',
  tfSetNoRipple = 'Set No Ripple',
  tfClearNoRipple = 'Clear No Ripple',
  tfSetFreeze = 'Set Freeze',
  tfClearFreeze = 'Clear Freeze',
}

export enum URITokenMintStringFlags {
  tfBurnable = 'Burnable',
}

export enum ClaimRewardStringFlags {
  tfOptOut = 'Opt Out',
}

function isFlagEnabled(Flags: number, checkFlag: number): boolean {
  // eslint-disable-next-line no-bitwise -- flags needs bitwise
  return (checkFlag & Flags) === checkFlag
}

export function parsePaymentFlags(flags: number): PaymentFlagsInterface {
  const flagsInterface: PaymentFlagsInterface = {}
  // If we use keys all will be strings and enums are reversed during transpilation
  Object.keys(PaymentFlags).forEach((flag: string) => {
    if (
      typeof flag === 'string' &&
      isFlagEnabled(flags, PaymentFlags[flag as keyof typeof PaymentFlags])
    ) {
      flagsInterface[flag as keyof typeof PaymentFlags] = true
    }
  })

  return flagsInterface
}

export function paymentFlagsToString(flags: number): string {
  let flagsString = ''
  let count = 0
  Object.keys(PaymentFlags).forEach((flag: string) => {
    if (
      typeof flag === 'string' &&
      isFlagEnabled(flags, PaymentFlags[flag as keyof typeof PaymentFlags])
    ) {
      if (count > 0) {
        flagsString +=
          ', ' + PaymentStringFlags[flag as keyof typeof PaymentFlags]
      } else {
        flagsString += PaymentStringFlags[flag as keyof typeof PaymentFlags]
      }
      count += 1
    }
  })

  return flagsString
}

export function accountRootFlagsToString(flags: number): string {
  let flagsString = ''
  let count = 0
  Object.keys(AccountSetTfFlags).forEach((flag: string) => {
    if (
      typeof flag === 'string' &&
      isFlagEnabled(
        flags,
        AccountSetTfFlags[flag as keyof typeof AccountSetTfFlags]
      )
    ) {
      if (count > 0) {
        flagsString +=
          ', ' + AccountSetStringFlags[flag as keyof typeof AccountSetTfFlags]
      } else {
        flagsString +=
          AccountSetStringFlags[flag as keyof typeof AccountSetTfFlags]
      }
      count += 1
    }
  })

  return flagsString
}

export function accountSetFlagsToString(flags: number): string {
  const flag = AccountSetAsfFlags[flags]
  return AccountAsfStringFlags[flag as keyof typeof AccountSetAsfFlags]
}

export function offerCreateFlagsToString(flags: number): string {
  let flagsString = ''
  let count = 0
  Object.keys(OfferCreateFlags).forEach((flag: string) => {
    if (
      typeof flag === 'string' &&
      isFlagEnabled(
        flags,
        OfferCreateFlags[flag as keyof typeof OfferCreateFlags]
      )
    ) {
      if (count > 0) {
        flagsString +=
          ', ' + OfferCreateStringFlags[flag as keyof typeof OfferCreateFlags]
      } else {
        flagsString +=
          OfferCreateStringFlags[flag as keyof typeof OfferCreateFlags]
      }
      count += 1
    }
  })

  return flagsString
}

export function paymentChannelClaimFlagsToString(flags: number): string {
  let flagsString = ''
  let count = 0
  Object.keys(PaymentChannelClaimFlags).forEach((flag: string) => {
    if (
      typeof flag === 'string' &&
      isFlagEnabled(
        flags,
        PaymentChannelClaimFlags[flag as keyof typeof PaymentChannelClaimFlags]
      )
    ) {
      if (count > 0) {
        flagsString +=
          ', ' +
          PaymentChannelClaimStringFlags[
            flag as keyof typeof PaymentChannelClaimFlags
          ]
      } else {
        flagsString +=
          PaymentChannelClaimStringFlags[
            flag as keyof typeof PaymentChannelClaimFlags
          ]
      }
      count += 1
    }
  })

  return flagsString
}

export function setHookFlagsToString(flags: number): string {
  let flagsString = ''
  let count = 0
  Object.keys(SetHookFlags).forEach((flag: string) => {
    if (
      typeof flag === 'string' &&
      isFlagEnabled(flags, SetHookFlags[flag as keyof typeof SetHookFlags])
    ) {
      if (count > 0) {
        flagsString +=
          ', ' + SetHookStringFlags[flag as keyof typeof SetHookFlags]
      } else {
        flagsString += SetHookStringFlags[flag as keyof typeof SetHookFlags]
      }
      count += 1
    }
  })

  return flagsString
}

export function trustSetFlagsToString(flags: number): string {
  let flagsString = ''
  let count = 0
  Object.keys(TrustSetFlags).forEach((flag: string) => {
    if (
      typeof flag === 'string' &&
      isFlagEnabled(flags, TrustSetFlags[flag as keyof typeof TrustSetFlags])
    ) {
      if (count > 0) {
        flagsString +=
          ', ' + TrustSetStringFlags[flag as keyof typeof TrustSetFlags]
      } else {
        flagsString += TrustSetStringFlags[flag as keyof typeof TrustSetFlags]
      }
      count += 1
    }
  })

  return flagsString
}

export function uriTokenMintFlagsToString(flags: number): string {
  let flagsString = ''
  let count = 0
  Object.keys(URITokenMintFlags).forEach((flag: string) => {
    if (
      typeof flag === 'string' &&
      isFlagEnabled(
        flags,
        URITokenMintFlags[flag as keyof typeof URITokenMintFlags]
      )
    ) {
      if (count > 0) {
        flagsString +=
          ', ' + URITokenMintStringFlags[flag as keyof typeof URITokenMintFlags]
      } else {
        flagsString +=
          URITokenMintStringFlags[flag as keyof typeof URITokenMintFlags]
      }
      count += 1
    }
  })

  return flagsString
}

export function claimRewardFlagsToString(flags: number): string {
  let flagsString = ''
  let count = 0
  Object.keys(ClaimRewardFlags).forEach((flag: string) => {
    if (
      typeof flag === 'string' &&
      isFlagEnabled(
        flags,
        ClaimRewardFlags[flag as keyof typeof ClaimRewardFlags]
      )
    ) {
      if (count > 0) {
        flagsString +=
          ', ' + ClaimRewardStringFlags[flag as keyof typeof ClaimRewardFlags]
      } else {
        flagsString +=
          ClaimRewardStringFlags[flag as keyof typeof ClaimRewardFlags]
      }
      count += 1
    }
  })

  return flagsString
}
