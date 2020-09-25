import { useSelector } from 'react-redux'

import {
  getIntermediaryState,
  getAttributeInputKey,
  getInteractionCounterparty,
  getActiveInteraction,
} from '~/modules/interaction/selectors'
import { IntermediaryState } from '~/modules/interaction/types'
import { strings } from '~/translations/strings'
import { ATTR_UI_NAMES } from '~/types/credentials'
import { useCredentialShareFlow } from '~/hooks/interactions/useCredentialShareFlow'
import {
  isAuthDetails,
  isAuthzDetails,
  isCredOfferDetails,
  isCredShareDetails,
} from '~/modules/interaction/guards'

const useInteractionTitle = () => {
  const details = useSelector(getActiveInteraction)
  const intermediaryState = useSelector(getIntermediaryState)
  const inputType = useSelector(getAttributeInputKey)
  const counterparty = useSelector(getInteractionCounterparty)
  const { getSingleMissingAttribute } = useCredentialShareFlow()

  if (intermediaryState === IntermediaryState.showing) {
    return strings.ADD_YOUR_ATTRIBUTE(ATTR_UI_NAMES[inputType])
  }

  //TODO @clauxx move this out
  if (isAuthDetails(details)) {
    return strings.IS_IT_REALLY_YOU
  } else if (isAuthzDetails(details)) {
    const { action } = details
    return strings.WOULD_YOU_LIKE_TO_ACTION(action)
  } else if (isCredOfferDetails(details)) {
    return strings.INCOMING_OFFER
  } else if (isCredShareDetails(details)) {
    const initiatorName = counterparty?.publicProfile?.name
    const missingAttr = getSingleMissingAttribute()
    return missingAttr
      ? strings.SERVICE_REQUESTS_ATTRIBUTE(
          initiatorName ? initiatorName : strings.SERVICE,
          ATTR_UI_NAMES[missingAttr],
        )
      : strings.INCOMING_REQUEST
  } else {
    return strings.INCOMING_INTERACTION
  }
}

export default useInteractionTitle
