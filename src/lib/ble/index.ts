import { Device, BleManager } from 'react-native-ble-plx';
import { JSONWebToken, JWTEncodable } from 'jolocom-lib/js/interactionTokens/JSONWebToken';

export type BleSerialConnectionConfig = {
    serviceUUID: string,
    rxUUID: string,
    txUUID: string,
}

export interface SerialConnection {
  write: (toWrite: string) => Promise<any>
  listen: (callback: (line: string) => void) => Subscription
  close: () => Promise<void>,
  respond: (token: JSONWebToken<JWTEncodable>) => Promise<any>
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
): Promise<SerialConnection> => d.isConnected().then(connected => connected
    ? {
        write: (toWrite: string) => d.writeCharacteristicWithResponseForService(
            serialUUIDs.serviceUUID,
            serialUUIDs.rxUUID,
            toWrite).catch(console.log),
        listen: (callback: (line: string) => void) => d.monitorCharacteristicForService(
            serialUUIDs.serviceUUID,
            serialUUIDs.txUUID,
            (error, characteristic) => {
                if (characteristic && characteristic.value) {
                    callback(characteristic.value)
                }
            }
        ),
        close: () => d.cancelConnection().then(_ => manager.destroy()),
        respond: (token: JSONWebToken<JWTEncodable>) => d.writeCharacteristicWithResponseForService(
            serialUUIDs.serviceUUID,
            serialUUIDs.rxUUID,
            token.encode()
        ).then(value => d.cancelConnection().then(_ => manager.destroy()))
    }
    : reject("Device Not Connected"))

