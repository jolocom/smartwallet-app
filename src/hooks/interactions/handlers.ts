/**
 * NOTE @clauxx
 *
 * This file was renamed from `index.ts` to `handlers.ts` due to (probably) an issue
 * with module caching, that appeared after upgrading to RN63.
 */

import { useDispatch, useSelector } from 'react-redux'

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
import { getDid } from '~/modules/account/selectors'
import { useToasts } from '../toasts'
import { isError, isUIError, SWErrorCodes, UIErrors } from '~/errors/codes'
import { parseJWT } from '~/utils/parseJWT'
import useConnection from '../connection'

export const useInteraction = () => {
  const agent = useAgent()
  const interactionId = useSelector(getInteractionId)
  if (!interactionId) throw new Error('Interaction not found')

  return () => agent.interactionManager.getInteraction(interactionId)
}

export const useInteractionStart = () => {
  const agent = useAgent()
  const did = useSelector(getDid)
  const dispatch = useDispatch()
  const loader = useLoader()
  const { connected, showDisconnectedToast } = useConnection()
  const { scheduleWarning, scheduleErrorWarning } = useToasts()

  return async (jwt: string) => {
    // NOTE: not continuing the interaction if there is no network connection
    if (connected === false) return showDisconnectedToast()

    // NOTE: we're parsing the jwt here, even though it will be parsed in `agent.processJWT`
    // below. This is to assure the error is caught before the loading screen, so that it can
    // be handled by the scanner component.
    parseJWT(jwt)

    return loader(
      async () => {
        const interaction = await agent.processJWT(jwt)
        const interactionData = await interactionHandler(
          agent,
          interaction,
          did,
        )
        dispatch(
          setInteractionDetails({
            id: interaction.id,
            flowType: interaction.flow.type,
            ...interactionData,
          }),
        )
      },
      { showSuccess: false },
      (error) => {
        if(isError(error)) {
          // @ts-ignore
          if(isUIError(error)) scheduleWarning(UIErrors[error.message])
          else scheduleErrorWarning(error, {
            title: UIErrors[SWErrorCodes.SWInteractionUnknownError]?.title,
            message: UIErrors[SWErrorCodes.SWInteractionUnknownError]?.message
          })
        }
      }
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
