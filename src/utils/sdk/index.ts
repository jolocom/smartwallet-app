import { createConnection, getConnection } from 'typeorm'
import {
  JolocomKeychainPasswordStore,
  Agent,
  JolocomLinking,
  JolocomWebSockets,
  JolocomTypeormStorage,
  JolocomSDK,
} from 'react-native-jolocom'

import typeormConfig from './ormconfig'
import { JolocomDeepLinking } from './deeplinks'

const initConnection = async () => {
  let connection
  try {
    // *** this will clear the database
    // *** used for resetting the did
    // await getConnection().synchronize(true)
    // console.log('DB was cleaned')

    connection = getConnection()
  } catch (e) {
    connection = await createConnection(typeormConfig)
  }
  return connection
}

export const initSDK = async () => {
  const connection = await initConnection()
  await connection.synchronize()
  const storage = new JolocomTypeormStorage(connection)
  return new JolocomSDK({ storage })
}

export const initAgent = async (): Promise<Agent> => {
  const sdk = await initSDK()

  await sdk.usePlugins(new JolocomDeepLinking(), new JolocomWebSockets())
  sdk.setDefaultDidMethod('jun')

  const passwordStore = new JolocomKeychainPasswordStore()

  return new Agent({ passwordStore, sdk })
}
