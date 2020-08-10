import { FlowType } from '@jolocom/sdk/js/src/lib/interactionManager/types'
import { useSelector } from 'react-redux'
import {
  getIntermediaryState,
  getAttributeInputKey,
  getInteractionType,
  getInteractionCounterparty,
  getInteractionDetails,
} from '~/modules/interaction/selectors'
import {
  IntermediaryState,
  CredShareI,
  AuthorizationDetailsI,
} from '~/modules/interaction/types'
import { strings } from '~/translations/strings'
import { useRootSelector } from '~/hooks/useRootSelector'
import { ATTR_UI_NAMES } from '~/types/attributes'

const isSingleAttributeRequest = (
  selfIssued: string[],
  serviceIssued: string[],
) => {
  return !serviceIssued.length && selfIssued.length === 1
}

const useInteractionTitle = () => {
  const counterparty = useSelector(getInteractionCounterparty)
  const authorizationDetails = useRootSelector<AuthorizationDetailsI>(
    getInteractionDetails,
  )
  const credentialShareDetails = useRootSelector<CredShareI>(
    getInteractionDetails,
  )
  const intermediaryState = useSelector(getIntermediaryState)
  const inputType = useSelector(getAttributeInputKey)
  const interactionType: FlowType | null = useSelector(getInteractionType)

  if (intermediaryState === IntermediaryState.showing)
    return strings.SAVE_YOUR_ATTRIBUTE(inputType)

  //TODO: @clauss add strings
  switch (interactionType) {
    case FlowType.Authentication:
      return strings.IS_IT_REALLY_YOU

    case FlowType.CredentialShare:
      const initiatorName = counterparty.publicProfile?.name
      const { self_issued, service_issued } = credentialShareDetails.credentials
      const firstRequestedAttr = self_issued[0]
      return isSingleAttributeRequest(self_issued, service_issued)
        ? strings.SERVICE_REQUESTS_ATTRIBUTE(
            initiatorName ? initiatorName : strings.SERVICE,
            ATTR_UI_NAMES[firstRequestedAttr],
          )
        : strings.INCOMING_REQUEST

    case FlowType.CredentialReceive:
      return strings.INCOMING_OFFER

    case FlowType.Authorization:
      const { action } = authorizationDetails
      return strings.WOULD_YOU_LIKE_TO_ACTION(action)

    default:
      return strings.INCOMING_INTERACTION
  }
}

export default useInteractionTitle
