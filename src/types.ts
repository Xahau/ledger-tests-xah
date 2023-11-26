export interface LedgerTestContext {
  transport: any
  app: any
  deviceData: DeviceData
}
export interface DeviceData {
  publicKey: string
  address: string
  chainCode?: string
}
