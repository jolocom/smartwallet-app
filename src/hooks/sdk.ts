import { useContext } from 'react'
import { Alert } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'

import {
  InteractionTransportType,
  FlowType,
  CredentialRequestFlowState,
} from '@jolocom/sdk/js/src/lib/interactionManager/types'
import { Interaction } from '@jolocom/sdk/js/src/lib/interactionManager/interaction'
import { JolocomLib } from 'jolocom-lib'
import { ErrorCode } from '@jolocom/sdk/js/src/lib/errors'

import { SDKContext } from '~/utils/sdk/context'
import { useLoader } from './useLoader'
import { setInteractionDetails } from '~/modules/interaction/actions'
import { getInteractionId } from '~/modules/interaction/selectors'
import { getMappedInteraction, isTypeAttribute } from '~/utils/dataMapping'
import { getAllCredentials } from '~/modules/credentials/selectors'

type PreInteractionHandler = (i: Interaction) => boolean

export const useSDK = () => {
  const sdk = useContext(SDKContext)
  if (!sdk?.current) throw new Error('SDK was not found!')
  return sdk.current
}

export const useMnemonic = () => {
  const sdk = useSDK()

  return (entropy: string) => {
    return sdk.fromEntropyToMnemonic(Buffer.from(entropy, 'hex'))
  }
}

export const useInteractionStart = (channel: InteractionTransportType) => {
  const sdk = useSDK()
  const dispatch = useDispatch()
  const loader = useLoader()
  const credentials = useSelector(getAllCredentials)

  const parseJWT = (jwt: string) => {
    try {
      return JolocomLib.parse.interactionToken.fromJWT(jwt)
    } catch (e) {
      if (e instanceof SyntaxError) {
        throw new Error(ErrorCode.ParseJWTFailed)
      } else if (e.message === 'Token expired') {
        throw new Error(ErrorCode.TokenExpired)
      } else {
        throw new Error(ErrorCode.Unknown)
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
        const interaction = await sdk.interactionManager.start(channel, token)
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
  const sdk = useSDK()
  const interactionId = useSelector(getInteractionId)
  if (!interactionId) throw new Error('Interaction not found')

  return sdk.interactionManager.getInteraction(interactionId)
}
