import {
  AuthenticationFlowState,
  AuthorizationFlowState,
  CredentialOfferFlowState,
} from '@jolocom/sdk/js/interactionManager/types'

import { FlowType, Interaction } from 'react-native-jolocom'
import {
  getCredentialCategory,
} from '../signedCredentials/utils'
import { useAgent } from '../sdk'
import useTranslation from '~/hooks/useTranslation'
import { useToasts } from '../toasts'
import { strings } from '~/translations'
import truncateDid from '~/utils/truncateDid'
import { CredentialRequestHandler } from '~/middleware/interaction/credentialRequestConstrains'

const authenticationHandler = (state: AuthenticationFlowState) => ({
  description: state.description,
})

const authorizationHandler = (state: AuthorizationFlowState) => state

const credentialOfferHandler = (state: CredentialOfferFlowState) => {
  return {
    credentials: {
      service_issued: state.offerSummary.map(
        ({ renderInfo, type, credential }) => ({
          type: type,
          category: getCredentialCategory(renderInfo),
          invalid: false,
          name: credential?.name ?? '',
          properties: credential?.display?.properties || [],
        }),
      ),
    },
  }
}

/**
 * 1. Use it to check whatever logic should happen before
 * mapping interaction to the wallet UI structure
 * (process data, etc. for a given type of interaction)
 * before we dispatch interaction details into redux store
 * 2. Map interaction details to the wallet UI structure
 */
export const useInteractionHandler = () => {
  const agent = useAgent()
  const { did } = agent.idw
  const { t } = useTranslation()
  const { scheduleWarning } = useToasts()

  return async (interaction: Interaction) => {
    const { state, initiator } = interaction.getSummary()
    const serviceName =
      initiator.publicProfile?.name ?? truncateDid(initiator.did)

    let flowSpecificData

    switch (interaction.flow.type) {
      case FlowType.Authorization: {
        flowSpecificData = authorizationHandler(
          state as AuthenticationFlowState,
        )
        break
      }
      case FlowType.Authentication: {
        flowSpecificData = authenticationHandler(
          state as AuthorizationFlowState,
        )
        break
      }
      case FlowType.CredentialOffer: {
        flowSpecificData = credentialOfferHandler(
          state as CredentialOfferFlowState,
        )
        break
      }
      case FlowType.CredentialShare: {
        const handler = new CredentialRequestHandler(
          interaction,
          agent.credentials,
        )

        flowSpecificData = await (await handler.getStoredRequestedCredentials())
          .validateAgainstConstrains()
          .checkForMissingServiceIssuedCredentials()
          .prepareCredentialsForUI(did)

        if (!!handler.missingCredentialTypes.length) {
          flowSpecificData = undefined
          // FIXME: there is an issue with the strings here, will be fixed when the
          // i18n and PoEditor are properly set up.
          scheduleWarning({
            title: t(strings.SHARE_MISSING_DOCS_TITLE),
            message: t(strings.SHARE_MISSING_DOCS_MSG, {
              serviceName,
              documentType: handler.missingCredentialTypes.join(', '),
            }),
          })
        }

        break
      }

      default:
        // TODO: Define error and use translations
        throw new Error('Interaction not supported')
    }

    return flowSpecificData
  }
}
