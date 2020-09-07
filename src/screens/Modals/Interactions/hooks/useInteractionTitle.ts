import { useSelector } from 'react-redux'
import {
  getIntermediaryState,
  getAttributeInputKey,
  getInteractionDetails,
} from '~/modules/interaction/selectors'
import { IntermediaryState } from '~/modules/interaction/types'
import { strings } from '~/translations/strings'
import { useRootSelector } from '~/hooks/useRootSelector'
import { ATTR_UI_NAMES } from '~/types/credentials'
import {
  isAuthDetails,
  isAuthzDetails,
  isCredOfferDetails,
  isCredShareDetails,
} from '~/modules/interaction/guards'

const isSingleAttributeRequest = (
  selfIssued: string[],
  serviceIssued: string[],
) => {
  return !serviceIssued.length && selfIssued.length === 1
}

const useInteractionTitle = () => {
  const details = useRootSelector(getInteractionDetails)
  const intermediaryState = useSelector(getIntermediaryState)
  const inputType = useSelector(getAttributeInputKey)

  if (intermediaryState === IntermediaryState.showing) {
    if (!inputType) throw new Error('inputType not found')

    return strings.SAVE_YOUR_ATTRIBUTE(inputType)
  }

  if (isAuthDetails(details)) {
    return strings.IS_IT_REALLY_YOU
  } else if (isAuthzDetails(details)) {
    const { action } = details
    return strings.WOULD_YOU_LIKE_TO_ACTION(action)
  } else if (isCredOfferDetails(details)) {
    return strings.INCOMING_OFFER
  } else if (isCredShareDetails(details)) {
    const { counterparty } = details
    const initiatorName = counterparty.publicProfile?.name
    const { self_issued, service_issued } = details.credentials
    const firstRequestedAttr = self_issued[0]
    return isSingleAttributeRequest(self_issued, service_issued)
      ? strings.SERVICE_REQUESTS_ATTRIBUTE(
          initiatorName ? initiatorName : strings.SERVICE,
          ATTR_UI_NAMES[firstRequestedAttr],
        )
      : strings.INCOMING_REQUEST
  } else {
    return strings.INCOMING_INTERACTION
  }
}

export default useInteractionTitle
