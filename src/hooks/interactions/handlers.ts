/**
 * NOTE @clauxx
 *
 * This file was renamed from `index.ts` to `handlers.ts` due to (probably) an issue
 * with module caching, that appeared after upgrading to RN63.
 */

import { useDispatch, useSelector } from 'react-redux'
import {
  SDKError,
  JolocomLib,
  Interaction,
} from 'react-native-jolocom'

import { useLoader } from '../loader'
import {
  resetInteraction,
  setInteractionDetails,
} from '~/modules/interaction/actions'
import { getInteractionId } from '~/modules/interaction/selectors'
import { useAgent } from '../sdk'
import { useNavigation } from '@react-navigation/native'
import { ScreenNames } from '~/types/screens'
import { interactionHandler } from './interactionHandlers'

export const useInteraction = () => {
  const agent = useAgent()
  const interactionId = useSelector(getInteractionId)
  if (!interactionId) throw new Error('Interaction not found')

  return () => agent.interactionManager.getInteraction(interactionId)
}

export const useInteractionStart = () => {
  const agent = useAgent()
  const dispatch = useDispatch()
  const loader = useLoader()

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

  return async (jwt: string) => {
    // NOTE: we're parsing the jwt here, even though it will be parsed in `agent.processJWT`
    // below. This is to assure the error is caught before the loading screen, so that it can
    // be handled by the scanner component.
    parseJWT(jwt)

    return loader(
      async () => {
        const interaction = await agent.processJWT(jwt)
        const interactionData = interactionHandler(interaction);
        dispatch(
          setInteractionDetails({
            id: interaction.id,
            flowType: interaction.flow.type,
            ...interactionData,
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
        navigation.navigate(ScreenNames.Main)
      }
    }
    setTimeout(() => {
      dispatch(resetInteraction())
    }, 500)
  }
}
