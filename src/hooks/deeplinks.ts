import { useEffect } from 'react'
import branch, { BranchParams } from 'react-native-branch'
import { useDispatch, useSelector } from 'react-redux'

import { SWErrorCodes } from '~/errors/codes'
import { setIsBranchSubscribed } from '~/modules/account/actions'
import { getIsBranchSubscribed } from '~/modules/account/selectors'
import { setDeeplinkConfig } from '~/modules/interaction/actions'
import { setMdoc } from '~/modules/interaction/mdl/actions'
import eIDHooks from '~/screens/Modals/Interaction/eID/hooks'

import { useInteractionStart } from './interactions/handlers'
import { useLoader } from './loader'
import { useToasts } from './toasts'

export enum DeeplinkParams {
  redirectUrl = 'redirectUrl',
  postRedirect = 'postRedirect',
  token = 'token',
  tcTokenUrl = 'tcTokenUrl',
  mdoc = 'mdoc',
}

interface DeeplinkParamsValues {
  [DeeplinkParams.redirectUrl]?: string
  [DeeplinkParams.token]?: string
  [DeeplinkParams.tcTokenUrl]?: string
  [DeeplinkParams.postRedirect]: boolean
  [DeeplinkParams.mdoc]?: string
}

// NOTE: This should be called only in one place!
export const useDeeplinkInteractions = () => {
  const { processAusweisToken } = eIDHooks.useAusweisInteraction()
  const { startInteraction } = useInteractionStart()
  const { scheduleErrorWarning } = useToasts()
  const loader = useLoader()
  const dispatch = useDispatch()
  const isBranchSubscribed = useSelector(getIsBranchSubscribed)

  // NOTE: for now we assume all the params come in as strings
  const getParamValue = (name: DeeplinkParams, params: BranchParams) => {
    if (params[name] && typeof params[name] === 'string') {
      return params[name] as string
    }

    return
  }

  const parseParameters = (params: BranchParams): DeeplinkParamsValues => {
    // NOTE: Shows the user the `ServiceRedirect` screen, which allows the user to
    // get redirected to another application or browser
    const redirectUrl = getParamValue(DeeplinkParams.redirectUrl, params)
    // NOTE: SSI token
    const token = getParamValue(DeeplinkParams.token, params)
    // NOTE: eID token
    const tcTokenUrl = getParamValue(DeeplinkParams.tcTokenUrl, params)
    // NOTE: Updates the service's UI that the interaction has finished successfully
    const postRedirectString = getParamValue(
      DeeplinkParams.postRedirect,
      params,
    )
    // NOTE: mdl mdoc
    const mdoc = getParamValue(DeeplinkParams.mdoc, params)

    let postRedirect = false

    if (postRedirectString) {
      try {
        postRedirect = JSON.parse(postRedirectString) as boolean
      } catch (e) {
        console.warn(
          'The postRedirect query parameter is not a boolean: ',
          postRedirectString,
        )
      }
    }

    return {
      postRedirect,
      redirectUrl,
      tcTokenUrl,
      token,
      mdoc,
    }
  }

  useEffect(() => {
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
          const { tcTokenUrl, token, redirectUrl, postRedirect, mdoc } =
            parseParameters(params)

          dispatch(
            setDeeplinkConfig({
              redirectUrl,
              postRedirect,
            }),
          )

          if (token) {
            startInteraction(token).catch(scheduleErrorWarning)
            return
          } else if (tcTokenUrl) {
            loader(() => processAusweisToken(tcTokenUrl), {
              showSuccess: false,
              showFailed: false,
            }).catch(scheduleErrorWarning)
            return
          } else if (mdoc) {
            dispatch(setMdoc(mdoc))
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
