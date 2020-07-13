import { createStore, applyMiddleware, AnyAction } from 'redux'

import thunk, {
  ThunkDispatch as OriginalThunkDispatch,
  ThunkAction as OriginalThunkAction,
} from 'redux-thunk'
import { RootState, rootReducer } from 'src/reducers'

import { JolocomSDK } from '@jolocom/sdk'
import { JolocomTypeormStorage } from '@jolocom/sdk-storage-typeorm'
import { createConnection, getConnection } from 'typeorm'
import typeormConfig from '../ormconfig'
import { IStorage } from '@jolocom/sdk/js/src/lib/storage'

// TODO stop using this and use @jolocom/sdk-password-store-mobile-keychain
// after upgrading to RN60+

import { KeyChain } from './lib/keychain'

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

export async function initTypeorm() {
  const connection = await initConnection()
  await connection.synchronize()
  return new JolocomTypeormStorage(connection)
}

let sdk: JolocomSDK
export function initStore(storage: IStorage) {
  const passwordStore = new KeyChain()
  sdk = new JolocomSDK({ storage, passwordStore })

  /*
   * The {} as RootState type assertion:
   * The second argument, "preloadedState" is mandatory, and typed as RootState.
   * We provide an empty object. The store will have the correct default state
   * after all reducers initialise.
   */
  const backendMiddleware = sdk
  return createStore(
    rootReducer,
    {} as RootState,
    applyMiddleware(thunk.withExtraArgument(backendMiddleware)),
  )
}

export type ThunkDispatch = OriginalThunkDispatch<
  RootState,
  JolocomSDK,
  AnyAction
>
export type ThunkAction<
  R = AnyAction | Promise<AnyAction | void>
> = OriginalThunkAction<R, RootState, JolocomSDK, AnyAction>
