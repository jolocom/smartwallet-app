import { JolocomSDK } from '@jolocom/sdk'
import { JolocomTypeormStorage } from '@jolocom/sdk-storage-typeorm'
import { KeyChain } from '@jolocom/sdk-password-store-mobile-keychain'
import { createConnection, getConnection } from 'typeorm'
import typeormConfig from './ormconfig'

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
  const passwordStore = new KeyChain()
  return new JolocomSDK({ storage, passwordStore })
}
