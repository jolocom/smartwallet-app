import { useContext } from 'react'
import { Alert } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { entropyToMnemonic, mnemonicToEntropy } from 'bip39'
import Keychain from 'react-native-keychain'

import {
  FlowType,
  Interaction,
  SDKError,
  InteractionTransportType,
  JolocomLib,
  Agent,
} from 'react-native-jolocom'
import { CredentialRequestFlowState } from '@jolocom/sdk/js/interactionManager/types'

import { AgentContext } from '~/utils/sdk/context'
import { useLoader } from './useLoader'
import { setInteractionDetails } from '~/modules/interaction/actions'
import { getInteractionId } from '~/modules/interaction/selectors'
import { getMappedInteraction, isTypeAttribute } from '~/utils/dataMapping'
import { getAllCredentials } from '~/modules/credentials/selectors'
import { setDid, setLogged, setLocalAuth } from '~/modules/account/actions'
import { strings } from '~/translations/strings'
import { generateSecureRandomBytes } from '~/utils/generateBytes'
import { initAgent } from '~/utils/sdk'
import { PIN_SERVICE } from '~/utils/keychainConsts'

type PreInteractionHandler = (i: Interaction) => boolean

export const useWalletInit = () => {
  const dispatch = useDispatch()

  return async (agent: Agent) => {
    const pin = await Keychain.getGenericPassword({
      service: PIN_SERVICE,
    })

    // NOTE: If loading the identity fails, we don't set the did and the logged state, thus navigating
    // to the @LoggedOut section
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

export const useAgent = () => {
  const agent = useContext(AgentContext)
  if (!agent?.current) throw new Error('Agent was not found!')
  return agent.current
}

export const useMnemonic = () => {
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

//TODO: should split utils from this file depending on functionality e.g. identity creation, interactions, etc.
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

export const useIdentityCreate = () => {
  const agent = useAgent()
  const loader = useLoader()
  const dispatch = useDispatch()
  const getMnemonic = useMnemonic()

  return async () => {
    return loader(
      async () => {
        const mnemonic = await getMnemonic()
        const identity = await agent.loadFromMnemonic(mnemonic)
        dispatch(setDid(identity.did))
      },
      {
        loading: strings.CREATING,
      },
    )
  }
}

export const useSubmitSeedphraseBackup = () => {
  const agent = useAgent()
  const createIdentity = useIdentityCreate()

  return async () => {
    await createIdentity()
    await agent.storage.store.setting('encryptedSeed', {})
  }
}

export const useInteractionStart = (channel: InteractionTransportType) => {
  const agent = useAgent()
  const dispatch = useDispatch()
  const loader = useLoader()
  const credentials = useSelector(getAllCredentials)

  const parseJWT = (jwt: string) => {
    try {
      return JolocomLib.parse.interactionToken.fromJWT(jwt)
    } catch (e) {
      if (e instanceof SyntaxError) {
        throw new Error(SDKError.codes.ParseJWTFailed)
      } else if (e.message === 'Token expired') {
        throw new Error(SDKError.codes.TokenExpired)
      } else {
        throw new Error(SDKError.codes.Unknown)
      }
    }
  }

  /*
   * Used for any actions that have to be run before the interaction starts. If
   * returns false, the Interaction will not be started (still accessible
   * from the SDK).
   */
  const preInteractionHandler: Record<string, PreInteractionHandler> = {
    [FlowType.CredentialShare]: (interaction) => {
      const { constraints } = interaction.getSummary()
        .state as CredentialRequestFlowState
      const { requestedCredentialTypes } = constraints[0]

      const missingTypes = requestedCredentialTypes.reduce<string[]>(
        (acc, type) => {
          const requestedType = type[type.length - 1]
          if (isTypeAttribute(requestedType)) return acc

          const creds = credentials.filter(
            (cred) => cred.type === requestedType,
          )
          if (!creds.length) acc.push(requestedType)
          return acc
        },
        [],
      )

      if (missingTypes.length) {
        //TODO: dispatch notification "Credential not available"
        Alert.alert(
          'Oops',
          `You're missing the following credentials: ${missingTypes.join(
            ', ',
          )}`,
        )
        return false
      }

      return true
    },
  }

  const startInteraction = async (jwt: string) => {
    const token = parseJWT(jwt)

    await loader(
      async () => {
        const interaction = await agent.interactionManager.start(channel, token)
        const mappedInteraction = getMappedInteraction(interaction)
        const shouldStart = preInteractionHandler[interaction.flow.type]
          ? preInteractionHandler[interaction.flow.type](interaction)
          : true

        shouldStart &&
          dispatch(
            setInteractionDetails({
              id: interaction.id,
              flowType: interaction.flow.type,
              ...mappedInteraction,
            }),
          )
      },
      { showSuccess: false },
    )
  }

  return { startInteraction }
}

export const useInteraction = () => {
  const agent = useAgent()
  const interactionId = useSelector(getInteractionId)
  if (!interactionId) throw new Error('Interaction not found')

  return agent.interactionManager.getInteraction(interactionId)
}
