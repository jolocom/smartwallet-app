import { FlowType } from '@jolocom/sdk/js/src/lib/interactionManager/types'
import { useSelector } from 'react-redux'
import {
  getIntermediaryState,
  getAttributeInputKey,
  getInteractionCounterparty,
  getInteractionDetails,
} from '~/modules/interaction/selectors'
import {
  IntermediaryState,
  InteractionDetails,
} from '~/modules/interaction/types'
import { strings } from '~/translations/strings'
import { useRootSelector } from '~/hooks/useRootSelector'
import { ATTR_UI_NAMES } from '~/types/credentials'
import { useCredentialShareFlow } from '~/hooks/interactions/useCredentialShareFlow'

const useInteractionTitle = () => {
  const counterparty = useSelector(getInteractionCounterparty)
  const interactionDetails = useRootSelector<InteractionDetails>(
    getInteractionDetails,
  )
  const intermediaryState = useSelector(getIntermediaryState)
  const inputType = useSelector(getAttributeInputKey)
  const { getSingleMissingAttribute } = useCredentialShareFlow()

  if (intermediaryState === IntermediaryState.showing) {
    console.log({ inputType })
    if (!inputType) throw new Error('No InputType found')
    return strings.SAVE_YOUR_ATTRIBUTE(ATTR_UI_NAMES[inputType])
  }

  switch (interactionDetails.flowType) {
    case FlowType.Authentication:
      return strings.IS_IT_REALLY_YOU

    case FlowType.CredentialShare:
      const initiatorName = counterparty.publicProfile?.name
      const missingAttr = getSingleMissingAttribute()
      return missingAttr
        ? strings.SERVICE_REQUESTS_ATTRIBUTE(
            initiatorName ? initiatorName : strings.SERVICE,
            ATTR_UI_NAMES[missingAttr],
          )
        : strings.INCOMING_REQUEST

    case FlowType.CredentialOffer:
      return strings.INCOMING_OFFER

    case FlowType.Authorization:
      const { action } = interactionDetails
      return strings.WOULD_YOU_LIKE_TO_ACTION(action)

    default:
      return strings.INCOMING_INTERACTION
  }
}

export default useInteractionTitle
