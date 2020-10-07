import { useContext } from 'react'
import { Alert } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'

import {
  FlowType,
  Interaction,
  SDKError,
  InteractionTransportType,
  JolocomLib,
} from 'react-native-jolocom'
import { CredentialRequestFlowState } from '@jolocom/sdk/js/interactionManager/types'

import { AgentContext } from '~/utils/sdk/context'
import { useLoader } from './useLoader'
import { setInteractionDetails } from '~/modules/interaction/actions'
import { getInteractionId } from '~/modules/interaction/selectors'
import { getMappedInteraction, isTypeAttribute } from '~/utils/dataMapping'
import { getAllCredentials } from '~/modules/credentials/selectors'

type PreInteractionHandler = (i: Interaction) => boolean

export const useAgent = () => {
  const agent = useContext(AgentContext)
  if (!agent?.current) throw new Error('SDK was not found!')
  return agent.current
}

export const useMnemonic = () => {
  const agent = useAgent()

  return (entropy: string) => {
    return agent.fromEntropyToMnemonic(Buffer.from(entropy, 'hex'))
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
    // NOTE For testing Authorization flow until it's available on a demo service

    // const encodedToken = await sdk.authorizationRequestToken({
    //   description:
    //     'The  http://google.com is ready to share a scooter with you, unlock to start your ride',
    //   imageURL: 'http://www.pngmart.com/files/10/Vespa-Scooter-PNG-Pic.png',
    //   action: 'unlock the scooter',
    //   callbackURL: 'http://test.test.test',
    // })
    // const token = parseJWT(encodedToken)
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
