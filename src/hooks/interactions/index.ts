import { useDispatch, useSelector } from 'react-redux'

import {
  FlowType,
  SDKError,
  JolocomLib,
  Interaction,
} from 'react-native-jolocom'
import { CredentialRequestFlowState } from '@jolocom/sdk/js/interactionManager/types'

import { useLoader } from '../loader'
import {
  resetInteraction,
  setInteractionDetails,
} from '~/modules/interaction/actions'
import { getInteractionId } from '~/modules/interaction/selectors'
import {
  getMappedInteraction,
  isTypeAttribute,
  getCredentialType,
} from '~/utils/dataMapping'
import { getAllCredentials } from '~/modules/credentials/selectors'
import { useAgent } from '../sdk'
import { useToasts } from '../toasts'
import { strings } from '~/translations/strings'
import { useNavigation } from '@react-navigation/native'
import { ScreenNames } from '~/types/screens'

export const useInteraction = () => {
  const agent = useAgent()
  const interactionId = useSelector(getInteractionId)
  if (!interactionId) throw new Error('Interaction not found')

  return () => agent.interactionManager.getInteraction(interactionId)
}

type PreInteractionHandler = (i: Interaction) => boolean

export const useInteractionStart = () => {
  const agent = useAgent()
  const dispatch = useDispatch()
  const loader = useLoader()
  const credentials = useSelector(getAllCredentials)
  const { scheduleInfo } = useToasts()

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
          const requestedType = getCredentialType(type)
          if (isTypeAttribute(requestedType)) return acc

          const creds = credentials.filter(
            (cred) => cred.type[1] === requestedType,
          )
          if (!creds.length) acc.push(requestedType)
          return acc
        },
        [],
      )

      if (missingTypes.length) {
        //TODO: add translations interpolation with the issuer, missingTypes
        scheduleInfo({
          title: strings.SHARE_MISSING_DOCS_TITLE,
          message: strings.SHARE_MISSING_DOCS_MSG,
        })
        return false
      }

      return true
    },
  }

  return async (jwt: string) => {
    // NOTE: we're parsing the jwt here, even though it will be parsed in `agent.processJWT`
    // below. This is to assure the error is caught before the loading screen, so that it can
    // be handled by the scanner component.
    parseJWT(jwt)

    return loader(
      async () => {
        const interaction = await agent.processJWT(jwt)
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
}

export const useFinishInteraction = () => {
  const dispatch = useDispatch()
  const navigation = useNavigation()

  return (screen?: ScreenNames) => {
    if (screen) {
      navigation.navigate(screen)
    } else {
      if (navigation.canGoBack()) {
        navigation.goBack()
      } else {
        navigation.navigate(ScreenNames.LoggedIn)
      }
    }
    setTimeout(() => {
      dispatch(resetInteraction())
    }, 500)
  }
}
