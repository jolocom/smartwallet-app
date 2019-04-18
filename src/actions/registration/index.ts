import { AnyAction, Dispatch } from 'redux'
import { navigationActions, genericActions, accountActions } from 'src/actions/'
import { BackendMiddleware } from 'src/backendMiddleware'
import { routeList } from 'src/routeList'
import { setDid } from 'src/actions/account'
import { JolocomLib } from 'jolocom-lib'
import { IpfsCustomConnector } from 'src/lib/ipfs'
import { jolocomEthereumResolver } from 'jolocom-lib/js/ethereum/ethereum'
import { SoftwareKeyProvider } from 'jolocom-lib/js/vaultedKeyProvider/softwareProvider'
import { KeyTypes } from "jolocom-lib/js/vaultedKeyProvider/types";
import { EncryptionLibInterface } from "../../lib/crypto";
import { Storage } from 'src/lib/storage/storage'
import { IdentityWallet } from "jolocom-lib/js/identityWallet/identityWallet";
import bip39 from 'bip39';
import { JolocomRegistry } from 'jolocom-lib/js/registries/jolocomRegistry';
import { createIdentityStages, recoverIdentityStages } from './loadingStages';

export const setNextLoadingStage = () => {
  return {
    type: 'SET_NEXT_LOADING_STAGE',
  }
}

export const setLoadingStages = (value: string[]) => {
  return {
    type: 'SET_LOADING_STAGES',
    value: value,
  }
}

export const savePassword = (password: string) => {
  return async (dispatch: Dispatch<AnyAction>, getState: Function, backendMiddleware: BackendMiddleware) => {
    try {
      await backendMiddleware.keyChainLib.savePassword(password)
      dispatch(navigationActions.navigatorReset({ routeName: routeList.Entropy }))
    } catch (err) {
      dispatch(genericActions.showErrorScreen(err, routeList.Landing))
    }
  }
}

export const inputSeedPhrase = () => {
  return ( dispatch: Dispatch<AnyAction>) => {
    dispatch(
      navigationActions.navigatorReset({
        routeName: routeList.InputSeedPhrase
      })
    )
  }
}

export const submitEntropy = (encodedEntropy: string) => {
  return (dispatch: Dispatch<AnyAction>) => {
    dispatch(
      navigationActions.navigatorReset({
        routeName: routeList.Loading
      })
    )
    dispatch(setLoadingStages(createIdentityStages))

    setTimeout(() => {
      dispatch(createIdentity(encodedEntropy))
    }, 2000)
  }
}

export const submitSeedPhrase = (seedPhrase: string) => {
  return (dispatch: Dispatch<AnyAction>) => {
    dispatch(
      navigationActions.navigatorReset({
        routeName: routeList.Loading
      })
    )
    dispatch(setLoadingStages(recoverIdentityStages))

    setTimeout(() => {
      dispatch(recoverIdentity(seedPhrase))
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

export const recoverIdentity = (seedPhrase: string) => {
  return async (dispatch: Dispatch<AnyAction>, getState: Function, backendMiddleware: BackendMiddleware) => {
    const { encryptionLib, keyChainLib, storageLib } = backendMiddleware

    try {
      const password = await keyChainLib.getPassword()
      const encodedEntropy = bip39.mnemonicToEntropy(seedPhrase)

      const userVault = new SoftwareKeyProvider(Buffer.from(encodedEntropy, 'hex'), password)

      dispatch(setNextLoadingStage())

      const registry = createJolocomRegistry()

      const identityWallet = await registry.authenticate(userVault,
        {
          derivationPath: KeyTypes.jolocomIdentityKey,
          encryptionPass: password
        }
      )

      await storeEncryptedSeed(storageLib, encryptionLib, encodedEntropy, password)
      await storeIdentityData(storageLib, dispatch, identityWallet)

      return dispatch(
        navigationActions.navigatorReset({
          routeName: routeList.Home,
        })
      )

    } catch (error) {
      return dispatch(genericActions.showErrorScreen(error, routeList.Landing))
    }
  }
}


export const createIdentity = (encodedEntropy: string) => {
  return async (dispatch: Dispatch<AnyAction>, getState: Function, backendMiddleware: BackendMiddleware) => {
    const { ethereumLib, encryptionLib, keyChainLib, storageLib } = backendMiddleware
  
    try {
      const password = await keyChainLib.getPassword()
      
      const userVault = new SoftwareKeyProvider(Buffer.from(encodedEntropy, 'hex'), password)

      dispatch(setNextLoadingStage())

      const ethAddr = ethereumLib.privKeyToEthAddress(userVault.getPrivateKey({
        encryptionPass: password,
        derivationPath: JolocomLib.KeyTypes.ethereumKey
      }))

      await ethereumLib.requestEther(ethAddr)

      dispatch(setNextLoadingStage())

      const registry = createJolocomRegistry()

      const identityWallet = await registry.create(userVault, password)

      await storeEncryptedSeed(storageLib, encryptionLib, encodedEntropy, password)
      await storeIdentityData(storageLib, dispatch, identityWallet)
      
      return dispatch(
        navigationActions.navigatorReset({
          routeName: routeList.SeedPhrase,
          params: { mnemonic: bip39.entropyToMnemonic(encodedEntropy) }
        })
      )
    } catch (error) {
      return dispatch(genericActions.showErrorScreen(error, routeList.Landing))
    }
  }
}

const storeEncryptedSeed = async (storageLib: Storage, encryptionLib: EncryptionLibInterface, encodedEntropy: string, password: string) => {
  const encEntropy = encryptionLib.encryptWithPass({ data: encodedEntropy, pass: password })
  const entropyData = {encryptedEntropy: encEntropy, timestamp: Date.now()}
  await storageLib.store.encryptedSeed(entropyData)
}

const storeIdentityData = async (storageLib: Storage, dispatch: Dispatch<AnyAction>, identityWallet: IdentityWallet ) => {
  const personaData = {
    did: identityWallet.identity.did,
    controllingKeyPath: JolocomLib.KeyTypes.jolocomIdentityKey
  }

  await storageLib.store.persona(personaData)
  dispatch(setDid(identityWallet.identity.did))

  dispatch(setNextLoadingStage())

  await dispatch(accountActions.setIdentityWallet())
}

const createJolocomRegistry = (): JolocomRegistry  =>{
return JolocomLib.registries.jolocom.create({
  ipfsConnector: new IpfsCustomConnector({
    host: 'ipfs.jolocom.com',
    port: 443,
    protocol: 'https'
  }),
  ethereumConnector: jolocomEthereumResolver
})
}