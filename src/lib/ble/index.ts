import { Device, BleManager } from 'react-native-ble-plx';
import { JSONWebToken, JWTEncodable } from 'jolocom-lib/js/interactionTokens/JSONWebToken';

export type BleSerialConnectionConfig = {
  serviceUUID: string,
  rxUUID: string,
  txUUID: string,
}

export interface SerialConnection {
  write: (toWrite: string) => Promise<any>
}

// a generator function to be passed in to the listen function as the callback
// This function will reduce together a token until delimiter and then call a callback function
// with the result
const waitForToken = (delimiter: string) =>
  (callback: (jwt: string) => void) =>
    function*(received: string) {
      while (!received.includes(delimiter, -1)) {
        console.log(`received: ${received}`)
        received += yield
      }
      callback(received.slice(0, received.indexOf(delimiter)))
    }

export const openSerialConnection = (manager: BleManager) => (
  d: Device,
  serialUUIDs: BleSerialConnectionConfig
) => (onRxDispatch: (send: (token: JSONWebToken<JWTEncodable>) => Promise<any>) =>
  (e: string) => Promise<any>) =>
    d.isConnected().then(async connected => {
      if (!connected) throw new Error("Device not connected")

      const b = waitForToken('\n')(
        onRxDispatch(
          (token: JSONWebToken<JWTEncodable>) => d.writeCharacteristicWithResponseForService(
            serialUUIDs.serviceUUID,
            serialUUIDs.rxUUID,
            'henlo\n')//token.encode() + '\n')
            .then(value => d.cancelConnection())
            .then(_ => manager.destroy())
        )
      )(await d.readCharacteristicForService(
        serialUUIDs.serviceUUID,
        serialUUIDs.txUUID
      ).then(ch => ch.value && Buffer.from(ch.value, 'base64').toString('ascii')) || '')

      d.monitorCharacteristicForService(
        serialUUIDs.serviceUUID,
        serialUUIDs.txUUID,
        (err, characteristic) => {
          if (err) console.log(err)
          if (characteristic && characteristic.value)
            b.next(Buffer.from(characteristic.value, 'base64').toString('ascii'))
        }
      )

      return {
        write: (toWrite: string) => d.writeCharacteristicWithResponseForService(
          serialUUIDs.serviceUUID,
          serialUUIDs.rxUUID,
          toWrite).catch(console.error)
      }
    })
