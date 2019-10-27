import { Device, Subscription, BleManager } from 'react-native-ble-plx';
import { reject } from 'q';
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
  respond: (token: JSONWebToken<JWTEncodable>) => Promise<boolean>
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
        ).then(value => true || d.cancelConnection().then(_ => manager.destroy()))
    }
    : reject("Device Not Connected"))

