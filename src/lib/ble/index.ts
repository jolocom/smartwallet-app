import { Device, Subscription, BleManager } from 'react-native-ble-plx';
import { reject } from 'q';

export type BleSerialConnectionConfig = {
    serviceUUID: string,
    rxUUID: string,
    txUUID: string,
}

export type SerialConnection = {
    write: (toWrite: string) => Promise<any>,
    listen: (callback: (line: string) => void) => Subscription,
    close: () => Promise<void>
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
        close: () => d.cancelConnection().then(_ => manager.destroy())
    }
    : reject("Device Not Connected"))

// two steps:
// 1. present a list of connections (narrowing by uuids)

// function for showing list of connections
// connection menu as a function which takes a selection and returns a serial port
//
// serial port as:
// 1. a function which takes a callback and calls it with every new recieve
// 2. a function to send

// type ConnectionManager = {
    // scanForDevices: (uuids: string[]) => Promise<(Device: ) => string>[],
    // establishConnection: (device: Device) => Promise<SerialConnection>
// }
