/**
 * NOTE @clauxx
 *
 * This file was renamed from `index.ts` to `handlers.ts` due to (probably) an issue
 * with module caching, that appeared after upgrading to RN63.
 */

import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { useLoader } from '../loader'
import {
  resetInteraction,
  setInteractionDetails,
  setRedirectUrl,
} from '~/modules/interaction/actions'
import { getInteractionId } from '~/modules/interaction/selectors'
import { useAgent } from '../sdk'
import { useNavigation } from '@react-navigation/native'
import { ScreenNames } from '~/types/screens'
import { useInteractionHandler } from './interactionHandlers'
import { useToasts } from '../toasts'
import { parseJWT } from '~/utils/parseJWT'
import { Interaction, TransportAPI } from 'react-native-jolocom'
import branch, { BranchParams } from 'react-native-branch'
import { SWErrorCodes } from '~/errors/codes'
import eIDHooks from '~/screens/Modals/Interaction/eID/hooks'
import useConnection from '../connection'
import {
  getCurrentLanguage,
  getIsBranchSubscribed,
} from '~/modules/account/selectors'
import { setIsBranchSubscribed } from '~/modules/account/actions'

export const useInteraction = () => {
  const agent = useAgent()
  const interactionId = useSelector(getInteractionId)
  if (!interactionId) throw new Error('Interaction not found')

  return () => agent.interactionManager.getInteraction(interactionId)
}

// NOTE: This should be called only in one place!
export const useDeeplinkInteractions = () => {
  const { processAusweisToken } = eIDHooks.useAusweisInteraction()
  const { processInteraction } = useInteractionStart()
  const { scheduleErrorWarning } = useToasts()
  const loader = useLoader()
  const currentLanguage = useSelector(getCurrentLanguage)
  const dispatch = useDispatch()
  const isBranchSubscribed = useSelector(getIsBranchSubscribed)

  // NOTE: for now we assume all the params come in as strings
  const getParamValue = (name: string, params: BranchParams) => {
    if (params[name] && typeof params[name] === 'string') {
      return params[name] as string
    }

    return
  }

  useEffect(() => {
    console.log('deeplink useEffect')
    // TODO move somewhere
    branch.disableTracking(true)
    if (!isBranchSubscribed) {
      branch.subscribe(({ error, params }) => {
        dispatch(setIsBranchSubscribed(true))
        if (error) {
          console.warn('Error processing DeepLink: ', error)
          return
        }

        if (params) {
          let redirectUrl = getParamValue('redirectUrl', params)
          const tokenValue = getParamValue('token', params)
          const eidValue = getParamValue('tcTokenUrl', params)

          if (tokenValue) {
            processInteraction(tokenValue, redirectUrl).catch(
              scheduleErrorWarning,
            )
            return
          } else if (eidValue) {
            if (redirectUrl) {
              dispatch(setRedirectUrl(redirectUrl))
            }
            console.log('deeplink hook')
            loader(() => processAusweisToken(eidValue), {
              showSuccess: false,
              showFailed: false,
            })
            return
          } else if (
            !params['+clicked_branch_link'] ||
            JSON.stringify(params) === '{}'
          ) {
            return
          }

          scheduleErrorWarning(new Error(SWErrorCodes.SWUnknownDeepLink))
        }
      })
    }
  }, [])
}

export const useInteractionStart = () => {
  const agent = useAgent()
  const dispatch = useDispatch()
  const loader = useLoader()
  const interactionHandler = useInteractionHandler()
  const { scheduleErrorWarning } = useToasts()
  const { connected, showDisconnectedToast } = useConnection()

  const processInteraction = async (
    jwt: string,
    redirectUrl?: string,
    transportAPI?: TransportAPI,
  ) => {
    try {
      parseJWT(jwt)
      const interaction = await agent.processJWT(jwt, transportAPI)

      if (redirectUrl) {
        dispatch(setRedirectUrl(redirectUrl))
      }

      return interaction
    } catch (e) {
      scheduleErrorWarning(e)
    }
  }

  const showInteraction = async (interaction: Interaction) => {
    // NOTE: not continuing the interaction if there is no network connection
    if (connected === false) return showDisconnectedToast()
    try {
      const counterparty = interaction.getSummary().initiator
      const interactionData = await interactionHandler(interaction)

      if (interactionData) {
        dispatch(
          setInteractionDetails({
            id: interaction.id,
            flowType: interaction.flow.type,
            counterparty,
            ...interactionData,
          }),
        )
      }
    } catch (e) {
      scheduleErrorWarning(e)
    }
  }

  const startInteraction = async (jwt: string) =>
    loader(
      async () => {
        const interaction = await processInteraction(jwt)
        if (interaction) {
          await showInteraction(interaction)
        }
      },
      { showSuccess: false, showFailed: false },
      (error) => {
        if (error) scheduleErrorWarning(error)
      },
    )

  return { processInteraction, showInteraction, startInteraction }
}

export const useFinishInteraction = () => {
  const dispatch = useDispatch()
  const navigation = useNavigation()

  const closeInteraction = (screen?: ScreenNames) => {
    if (screen) {
      navigation.navigate(screen)
    } else {
      if (navigation.canGoBack()) {
        navigation.goBack()
      } else {
        navigation.navigate(ScreenNames.Main)
      }
    }
  }

  const clearInteraction = () => {
    dispatch(resetInteraction(undefined))
  }

  return { closeInteraction, clearInteraction }
}
