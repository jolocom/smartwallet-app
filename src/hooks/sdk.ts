import { useState, useEffect, useContext } from 'react'
import { useDispatch } from 'react-redux'
import { entropyToMnemonic, mnemonicToEntropy } from 'bip39'
import Keychain from 'react-native-keychain'

import { SDKError, Agent } from 'react-native-jolocom'

import { AgentContext } from '~/utils/sdk/context'
import { useLoader } from './loader'
import { setDid, setLogged, setLocalAuth } from '~/modules/account/actions'
import { generateSecureRandomBytes } from '~/utils/generateBytes'
import { PIN_SERVICE } from '~/utils/keychainConsts'
import useTermsConsent from './consent'
import { makeInitializeCredentials, useCredentials } from './signedCredentials'
import useTranslation from './useTranslation'

// TODO: add a hook which manages setting/getting properties from storage
// and handles their types
export enum StorageKeys {
  isOnboardingDone = 'isOnboardingDone',
  encryptedSeed = 'encryptedSeed',
  termsConsent = 'termsConsent',
  biometry = 'biometry',
  language = 'language',
  screenshotsEnabled = 'screenshotsEnabled',
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
 *
 * @returns () => Promise<void>
 */
export const useWalletInit = () => {
  const dispatch = useDispatch()
  const { checkConsent } = useTermsConsent()

  return async (agent: Agent) => {
    // NOTE: Checking whether the user accepted the newest Terms of Service conditions
    await checkConsent(agent)

    const pin = await Keychain.getGenericPassword({
      service: PIN_SERVICE,
    })
    const onboardingSetting = await agent.storage.get.setting(
      StorageKeys.isOnboardingDone,
    )
    if (!onboardingSetting?.finished) return

    try {
      const idw = await agent.loadIdentity()

      await makeInitializeCredentials(agent, idw.did, dispatch)()
      dispatch(setDid(idw.did))
      dispatch(setLogged(true))

      if (pin) {
        dispatch(setLocalAuth(true))
      }
    } catch (err) {
      if (err.code !== SDKError.codes.NoWallet) {
        console.warn(err)
        throw new Error('Failed loading identity')
      }
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
export const useGenerateSeed = () => {
  const agent = useAgent()

  return async () => {
    // FIXME use the seed generated on the entropy screen. Currently the entropy
    // seed generates 24 word seedphrases
    const seed = await generateSecureRandomBytes(16)

    const identity = await agent.loadFromMnemonic(entropyToMnemonic(seed))
    const encryptedSeed = await identity.asymEncryptToDid(
      Buffer.from(seed),
      identity.did,
      {
        prefix: '',
        resolve: async (_) => identity.identity,
      },
    )

    await agent.storage.store.setting(StorageKeys.encryptedSeed, {
      b64Encoded: encryptedSeed.toString('base64'),
    })

    return seed
  }
}

/**
 * Returns a function that creates an identity using the stored encrypted seed and logs
 * the user in. If identity creation failed, will return @false.
 *
 * @returns () => Promise<boolean>
 */
export const useIdentityCreate = () => {
  const agent = useAgent()
  const dispatch = useDispatch()
  const seedphrase = useGetSeedPhrase()

  return async () => {
    const identity = await agent.loadFromMnemonic(seedphrase)
    await agent.storage.store.setting(StorageKeys.isOnboardingDone, {
      finished: true,
    })
    dispatch(setDid(identity.did))
  }
}

/**
 * Returns a function that handles the last step of the onboarding flow, which is
 * creating an identity and clearing up @encryptedSeed from the storage.
 *
 * @returns () => Promise<void>
 */
export const useSubmitIdentity = () => {
  const agent = useAgent()
  const dispatch = useDispatch()
  const createIdentity = useIdentityCreate()
  const loader = useLoader()
  const { t } = useTranslation()

  return async () => {
    await loader(
      async () => {
        await createIdentity()
        await agent.storage.store.setting(StorageKeys.encryptedSeed, {})
      },
      {
        loading: t('SeedphraseRepeat.confirmLoader'),
      },
      (error) => dispatch(setLogged(!Boolean(error))),
    )
  }
}

/**
 * Returns a function that checks whether the user input seedphrase corresponds to
 * the stored identity.
 *
 * @returns () => Promise<boolean>
 */
export const useShouldRecoverFromSeed = (phrase: string[]) => {
  const agent = useAgent()

  return async () => {
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
    getMnemonic().then(setSeedphrase)
  }, [])

  return seedphrase
}
