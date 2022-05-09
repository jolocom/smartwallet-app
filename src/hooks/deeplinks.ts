import { useEffect } from 'react'
import branch, { BranchParams } from 'react-native-branch'
import { useDispatch, useSelector } from 'react-redux'

import { SWErrorCodes } from '~/errors/codes'
import { getCurrentLanguage } from '~/modules/account/selectors'
import { setRedirectUrl, setPostRedirect } from '~/modules/interaction/actions'
import eIDHooks from '~/screens/Modals/Interaction/eID/hooks'
import { useInteractionStart } from './interactions/handlers'
import { useLoader } from './loader'
import { useToasts } from './toasts'

export enum DeeplinkParams {
  redirectUrl = 'redirectUrl',
  postRedirect = 'postRedirect',
  token = 'token',
  tcTokenUrl = 'tcTokenUrl',
}

// NOTE: This should be called only in one place!
export const useDeeplinkInteractions = () => {
  const { processAusweisToken } = eIDHooks.useAusweisInteraction()
  const { processInteraction } = useInteractionStart()
  const { scheduleErrorWarning } = useToasts()
  const loader = useLoader()
  const currentLanguage = useSelector(getCurrentLanguage)
  const dispatch = useDispatch()

  // NOTE: for now we assume all the params come in as strings
  const getParamValue = (name: DeeplinkParams, params: BranchParams) => {
    if (params[name] && typeof params[name] === 'string') {
      return params[name] as string
    }

    return
  }

  useEffect(() => {
    // TODO move somewhere
    branch.disableTracking(true)
    branch.subscribe(({ error, params }) => {
      if (error) {
        console.warn('Error processing DeepLink: ', error)
        return
      }

      if (params) {
        // NOTE: Shows the user the `ServiceRedirect` screen, which allows the user to
        // get redirected to another application or browser
        const redirectUrl = getParamValue(DeeplinkParams.redirectUrl, params)
        // NOTE: Updates the service's UI that the interaction has finished successfully
        const postRedirect = getParamValue(DeeplinkParams.postRedirect, params)
        // NOTE: SSI token
        const tokenValue = getParamValue(DeeplinkParams.token, params)
        // NOTE: eID token
        const eidValue = getParamValue(DeeplinkParams.tcTokenUrl, params)

        if (redirectUrl) {
          dispatch(setRedirectUrl(redirectUrl))
        }

        if (tokenValue) {
          processInteraction(tokenValue).catch(scheduleErrorWarning)
          return
        } else if (eidValue) {
          if (postRedirect) {
            try {
              dispatch(setPostRedirect(JSON.parse(postRedirect) as boolean))
            } catch (e) {
              if (e instanceof Error) {
                e.name = SWErrorCodes.SWPostRedirectQueryInvalid
                return scheduleErrorWarning(e)
              }
            }
          }

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
  }, [currentLanguage])
}
