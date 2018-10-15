import { AnyAction, Dispatch } from 'redux'
import { navigationActions, genericActions, accountActions } from 'src/actions/'
import { BackendMiddleware } from 'src/backendMiddleware'
import { routeList } from 'src/routeList'
import * as loading from 'src/actions/registration/loadingStages'
import { setDid } from 'src/actions/account'
import { JolocomLib } from 'jolocom-lib'
import { generateMnemonic } from 'jolocom-lib/js/utils/keyDerivation'
import { IpfsCustomConnector } from 'src/lib/ipfs'
import { jolocomEthereumResolver } from 'jolocom-lib/js/ethereum'

export const setLoadingMsg = (loadingMsg: string) => {
  return {
    type: 'SET_LOADING_MSG',
    value: loadingMsg
  }
}

export const savePassword = (password: string) => {
  return async (dispatch: Dispatch<AnyAction>, getState: Function, backendMiddleware: BackendMiddleware) => {
    try {
      await backendMiddleware.keyChainLib.savePassword(password)
      dispatch(navigationActions.navigatorReset({ routeName: routeList.Entropy }))
    } catch (err) {
      dispatch(genericActions.showErrorScreen(err))
    }
  }
}

export const submitEntropy = (encodedEntropy: string) => {
  return (dispatch: Dispatch<AnyAction>) => {
    dispatch(
      navigationActions.navigatorReset({
        routeName: routeList.Loading
      })
    )

    dispatch(setLoadingMsg(loading.loadingStages[0]))

    setTimeout(() => {
      dispatch(createIdentity(encodedEntropy))
    }, 2000)
  }
}

export const startRegistration = () => {
  return (dispatch: Dispatch<AnyAction>) => {
    dispatch(
      navigationActions.navigatorReset({
        routeName: routeList.PasswordEntry
      })
    )
  }
}

export const finishRegistration = () => {
  return (dispatch: Dispatch<AnyAction>) => {
    dispatch(navigationActions.navigatorReset({ routeName: routeList.Home }))
  }
}

export const createIdentity = (encodedEntropy: string) => {
  return async (dispatch: Dispatch<AnyAction>, getState: Function, backendMiddleware: BackendMiddleware) => {
    const { ethereumLib, encryptionLib, keyChainLib, storageLib } = backendMiddleware
    const seed = Buffer.from(encodedEntropy, 'hex')

    try {
      const identityManager = JolocomLib.identityManager.create(seed)

      const schema = identityManager.getSchema()
      const identityKey = identityManager.deriveChildKey(schema.jolocomIdentityKey)
      const ethereumKey = identityManager.deriveChildKey(schema.ethereumKey)

      const password = await keyChainLib.getPassword()
      const encEntropy = encryptionLib.encryptWithPass({ data: encodedEntropy, pass: password })
      const encEthWif = encryptionLib.encryptWithPass({ data: ethereumKey.wif, pass: password })
      const encGenWif = encryptionLib.encryptWithPass({ data: identityKey.wif, pass: password })

      const masterKeyData = {
        encryptedEntropy: encEntropy,
        timestamp: Date.now()
      }

      const genericSigningKeyData = {
        encryptedWif: encGenWif,
        path: identityKey.path,
        keyType: identityKey.keyType,
        entropySource: masterKeyData
      }

      const ethereumKeyData = {
        encryptedWif: encEthWif,
        path: ethereumKey.path,
        keyType: ethereumKey.keyType,
        entropySource: masterKeyData
      }

      await storageLib.store.derivedKey(ethereumKeyData)

      dispatch(setLoadingMsg(loading.loadingStages[1]))

      const ethAddr = ethereumLib.privKeyToEthAddress(ethereumKey.privateKey)
      await ethereumLib.requestEther(ethAddr)

      dispatch(setLoadingMsg(loading.loadingStages[2]))

      const registry = JolocomLib.registry.jolocom.create({
        ipfsConnector: new IpfsCustomConnector({
          host: 'ipfs.jolocom.com',
          port: 443,
          protocol: 'https'
        }),
        ethereumConnector: jolocomEthereumResolver
      })

      const identityWallet = await registry.create({
        privateIdentityKey: identityKey.privateKey,
        privateEthereumKey: ethereumKey.privateKey
      })

      const personaData = {
        did: identityWallet.getIdentity().getDID(),
        controllingKey: genericSigningKeyData
      }

      await storageLib.store.persona(personaData)

      dispatch(setDid(identityWallet.getIdentity().getDID()))
      dispatch(setLoadingMsg(loading.loadingStages[3]))
      dispatch(accountActions.setIdentityWallet())
      dispatch(
        navigationActions.navigatorReset({
          routeName: routeList.SeedPhrase,
          params: { mnemonic: generateMnemonic(seed) }
        })
      )
    } catch (error) {
      return dispatch(genericActions.showErrorScreen(error))
    }
  }
}
