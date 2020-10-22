import { useContext } from 'react'
import { useDispatch } from 'react-redux'
import { entropyToMnemonic, mnemonicToEntropy } from 'bip39'
import Keychain from 'react-native-keychain'

import { SDKError, Agent } from 'react-native-jolocom'

import { AgentContext } from '~/utils/sdk/context'
import { useLoader } from './useLoader'
import { setDid, setLogged, setLocalAuth } from '~/modules/account/actions'
import { strings } from '~/translations/strings'
import { generateSecureRandomBytes } from '~/utils/generateBytes'
import { PIN_SERVICE } from '~/utils/keychainConsts'

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

  return async (agent: Agent) => {
    const pin = await Keychain.getGenericPassword({
      service: PIN_SERVICE,
    })

    agent
      .loadIdentity()
      .then((idw) => {
        dispatch(setDid(idw.did))
        dispatch(setLogged(true))

        if (pin) {
          dispatch(setLocalAuth(true))
        }
      })
      .catch((err) => {
        if (err.code !== SDKError.codes.NoWallet) {
          console.warn(err)
          throw new Error('Failed loading identity')
        }
      })
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

    await agent.storage.store.setting('encryptedSeed', {
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
  const loader = useLoader()
  const dispatch = useDispatch()
  const getStoredMnemonic = useStoredMnemonic()

  return async () => {
    return loader(
      async () => {
        const mnemonic = await getStoredMnemonic()
        const identity = await agent.loadFromMnemonic(mnemonic)
        dispatch(setDid(identity.did))
      },
      {
        loading: strings.CREATING,
      },
    )
  }
}

/**
 * Returns a function that handles the last step of the onboarding flow, which is
 * creating an identity and clearing up @encryptedSeed from the storage.
 *
 * @returns () => Promise<void>
 */
export const useSubmitSeedphraseBackup = () => {
  const agent = useAgent()
  const createIdentity = useIdentityCreate()

  return async () => {
    await createIdentity()
    await agent.storage.store.setting('encryptedSeed', {})
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

/**
 * Returns a function which gets the seedphrase from the stored @encryptedEntropy.
 *
 * @returns () => Promise<string>
 */
export const useStoredMnemonic = () => {
  const agent = useAgent()

  return async () => {
    const encryptedSeed = await agent.storage.get.setting('encryptedSeed')

    if (!encryptedSeed) {
      throw new Error('Can not retrieve Seed from database')
    }

    const decrypted = await agent.idw.asymDecrypt(
      Buffer.from(encryptedSeed.b64Encoded, 'base64'),
      await agent.passwordStore.getPassword(),
    )

    return entropyToMnemonic(decrypted)
  }
}
