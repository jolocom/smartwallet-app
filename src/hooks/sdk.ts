import { useState, useEffect, useContext } from 'react'
import { useDispatch } from 'react-redux'
import { entropyToMnemonic, mnemonicToEntropy } from 'bip39'

import { Agent } from 'react-native-jolocom'

import { AgentContext } from '~/utils/sdk/context'
import { useLoader } from './loader'
import {
  setDid,
  setLogged,
  setLocalAuth,
  setMnemonicWarningVisibility,
  setMakingScreenshotDisability,
} from '~/modules/account/actions'
import { generateSecureRandomBytes } from '~/utils/generateBytes'
import useTermsConsent from './consent'
import { makeInitializeCredentials, useCredentials } from './signedCredentials'
import useTranslation from './useTranslation'
import { SecureStorageKeys, useSecureStorage } from './secureStorage'
import { useToasts } from './toasts'
import { ScreenshotManager } from '~/utils/screenshots'

// TODO: add a hook which manages setting/getting properties from storage
// and handles their types
export enum StorageKeys {
  isOnboardingDone = 'isOnboardingDone',
  encryptedSeed = 'encryptedSeed',
  termsConsent = 'termsConsent',
  biometry = 'biometry',
  language = 'language',
  screenshotsDisabled = 'screenshotsDisabled',
  mnemonicPhrase = 'mnemonicPhrase',
}

/**
 * Custom hook that returns the current @Agent.
 *
 * @returns Agent
 */
export const useAgent = () => {
  const agent = useContext(AgentContext)
  if (!agent?.current) throw new Error('Agent was not found!')

  return agent.current
}

/**
 * Returns a function that takes an @Agent and tries to load a stored identity.
 * If there is an identity found (agent.loadIdentity doesn't throw), the user is
 * logged in. Otherwise, the user stays logged out.
 * Can throw ErrorCode.NoWallet || ErrorCode.NoPassword || ...
 *
 * @returns () => Promise<void | never>
 */
export const useWalletInit = () => {
  const dispatch = useDispatch()
  const { checkConsent } = useTermsConsent()
  const secureStorage = useSecureStorage()

  return async (agent: Agent) => {
    // NOTE: Checking whether the user accepted the newest Terms of Service conditions
    await checkConsent(agent)

    try {
      const idw = await agent.loadIdentity()

      await makeInitializeCredentials(agent, idw.did, dispatch)()
      dispatch(setDid(idw.did))
      dispatch(setLogged(true))

      const pin = await secureStorage.getItem(SecureStorageKeys.passcode)
      if (pin) {
        dispatch(setLocalAuth(true))
      }

      const isMakingScreenshotDisabled =
        await ScreenshotManager.getDisabledStatus(agent)

      isMakingScreenshotDisabled
        ? ScreenshotManager.enable()
        : ScreenshotManager.disable()
      dispatch(setMakingScreenshotDisability(isMakingScreenshotDisabled))
    } catch (err) {
      console.warn(err)
    }
  }
}

/**
 * Returns a function that resets and re-initializes the redux values
 *
 * @returns () => Promise<void>
 */
export const useWalletReset = () => {
  const { checkConsent } = useTermsConsent()
  const dispatch = useDispatch()
  const agent = useAgent()
  const { initializeCredentials } = useCredentials()

  return async () => {
    await checkConsent(agent)
    dispatch(setDid(agent.idw.did))
    await initializeCredentials()
  }
}

/**
 * Returns a function that generates a random seed and stores it after encryption.
 *
 * @returns () => Promise<Buffer>
 */
export const useCreateIdentity = () => {
  const agent = useAgent()
  const dispatch = useDispatch()

  return async () => {
    // 1. Generate entropy
    const entropy = await generateSecureRandomBytes(16)
    // 2. Create identity: IdentityWallet
    const identity = await agent.loadFromMnemonic(entropyToMnemonic(entropy))
    // 3. Encrypt generated entropy
    const encryptedEntropy = await identity.asymEncryptToDid(
      entropy,
      identity.did,
      {
        prefix: '',
        resolve: async (_) => identity.identity,
      },
    )
    // 4. Store encrypted entropy: this is needed to be able to get mnemonic phrase
    await agent.storage.store.setting(StorageKeys.encryptedSeed, {
      b64Encoded: encryptedEntropy.toString('base64'),
    })

    dispatch(setDid(identity.did))
    return
  }
}

export const useRecoverIdentity = () => {
  const agent = useAgent()
  const dispatch = useDispatch()
  return async (phrase: string[]) => {
    const idw = await agent.loadFromMnemonic(phrase.join(' '))
    await agent.storage.store.setting(StorageKeys.mnemonicPhrase, {
      isWritten: true,
    })
    dispatch(setDid(idw.did))
  }
}
/**
 * Record when the seed phrase was "remembered" by a user.
 * Used to remind and block a user from completing
 * certain actions if the seed phrase was not "remembered"
 * by a user
 */
export const useRecordUserHasWrittenSeedPhrase = () => {
  const agent = useAgent()
  const loader = useLoader()
  const { scheduleErrorWarning } = useToasts()
  const { t } = useTranslation()
  const dispatch = useDispatch()

  return async (onSuccess: () => void) => {
    await loader(
      async () => {
        /**
         * Note we shouldn't reset encrypted entropy;
         * it is used to generate a mnemonic phrase with bip39;
         * in the future if we would like to make available
         * an option for a user to preview the mnemonic phrase
         * we won't be able to do so
         */
        //await agent.storage.store.setting(StorageKeys.encryptedSeed, {})
        await agent.storage.store.setting(StorageKeys.mnemonicPhrase, {
          isWritten: true,
        })
      },
      {
        loading: t('Recovery.confirmLoader'),
        showFailed: false,
      },
      (error) => {
        if (error) {
          scheduleErrorWarning(error)
        } else {
          dispatch(setMnemonicWarningVisibility(false))
          onSuccess()
        }
      },
    )
  }
}

/**
 * Returns a function that checks whether the user input seedphrase corresponds to
 * the stored identity.
 *
 * @returns () => Promise<boolean>
 */
export const useShouldRecoverFromSeed = () => {
  const agent = useAgent()

  return async (phrase: string[]) => {
    let recovered = false

    try {
      const recoveredEntropy = Buffer.from(
        mnemonicToEntropy(phrase.join(' ')),
        'hex',
      )

      if (agent.didMethod.recoverFromSeed) {
        const { identityWallet } = await agent.didMethod.recoverFromSeed(
          recoveredEntropy,
          await agent.passwordStore.getPassword(),
        )
        recovered = identityWallet.did === agent.idw.did
      }
    } catch (e) {
      console.warn(e)
      recovered = false
    }

    return recovered
  }
}

export const useGetSeedPhrase = () => {
  const [seedphrase, setSeedphrase] = useState('')
  const agent = useAgent()

  const getMnemonic = async () => {
    const encryptedSeed = await agent.storage.get.setting(
      StorageKeys.encryptedSeed,
    )

    if (!encryptedSeed) {
      throw new Error('Can not retrieve Seed from database')
    }

    const decrypted = await agent.idw.asymDecrypt(
      Buffer.from(encryptedSeed.b64Encoded, 'base64'),
      await agent.passwordStore.getPassword(),
    )

    return entropyToMnemonic(decrypted)
  }

  useEffect(() => {
    // TODO: we need to handle errors in a way that will
    // allow devs to track it back
    getMnemonic().then(setSeedphrase).catch(console.warn)
  }, [])

  return seedphrase
}
