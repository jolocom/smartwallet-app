import { JolocomSDK } from '@jolocom/sdk'
import { JolocomTypeormStorage } from '@jolocom/sdk-storage-typeorm'
import { createConnection } from 'typeorm'
import typeormConfig from './ormconfig'
import { KeyChain } from './keychain'

export const initSDK = async () => {
  const connection = await createConnection(typeormConfig)
  await connection.synchronize()
  const storage = new JolocomTypeormStorage(connection)
  const passwordStore = new KeyChain()
  return new JolocomSDK({ storage, passwordStore })
}
