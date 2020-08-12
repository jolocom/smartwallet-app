import { useSelector } from 'react-redux'
import { FlowType } from '@jolocom/sdk/js/src/lib/interactionManager/types'

import {
  getIntermediaryState,
  getAttributeInputKey,
  getInteractionType,
  getInteractionCounterparty,
} from '~/modules/interaction/selectors'
import truncateDid from '~/utils/truncateDid'
import { IntermediaryState } from '~/modules/interaction/types'
import { strings } from '~/translations/strings'

const useInteractionDescription = () => {
  const counterparty = useSelector(getInteractionCounterparty)
  const intermediaryState = useSelector(getIntermediaryState)
  const interactionType = useSelector(getInteractionType)
  const inputType = useSelector(getAttributeInputKey)
  const serviceName = counterparty.publicProfile?.name || strings.SERVICE
  const isAnonymous = !counterparty.publicProfile

  if (intermediaryState === IntermediaryState.showing)
    return strings.YOU_WILL_IMMIDIATELY_FIND_YOUR_DOC_IN_THE_PERSONAL_INFO_SECTION(
      inputType,
    )

  if (isAnonymous)
    return strings.THIS_PUBLIC_PROFILE_CHOSE_TO_REMAIN_ANONYMOUS(
      truncateDid(counterparty.did),
    )

  //TODO: @clauxx add strings
  switch (interactionType) {
    case FlowType.Authentication:
      //TODO: ask what is the right fallback for anonymous
      return strings.SERVICE_WOULD_LIKE_TO_CONFIRM_YOUR_DIGITAL_IDENTITY(
        serviceName,
      )
    case FlowType.Authorization:
      return strings.SERVICE_IS_NOW_READY_TO_GRANT_YOU_ACCESS(serviceName)
    case FlowType.CredentialShare:
      return strings.CHOOSE_ONE_OR_MORE_DOCUMETS_REQUESTED_BY_SERVICE_TO_PROCEED(
        serviceName,
      )
    case FlowType.CredentialOffer:
      return strings.SERVICE_SENT_YOUR_WALLET_THE_FOLLOWING_DOCUMENTS(
        serviceName,
      )
    default:
      return strings.INCOMING_INTERACTION
  }
}

export default useInteractionDescription
