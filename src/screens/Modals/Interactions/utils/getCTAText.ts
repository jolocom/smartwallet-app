import {
  FlowType,
  AuthorizationFlowState,
} from '@jolocom/sdk/js/src/lib/interactionManager/types'
import { strings } from '~/translations/strings'
import { useSelector } from 'react-redux'
import { getInteractionSummary } from '~/modules/interaction/selectors'
import { truncateFirstWord, capitalizeWord } from '~/utils/stringUtils'

export default function getCTAText(flowType: FlowType | null) {
  const interactionSummary = useSelector(getInteractionSummary)

  switch (flowType) {
    case FlowType.Authentication:
      return strings.AUTHENTICATE
    case FlowType.CredentialShare:
      return strings.SHARE
    case FlowType.CredentialReceive:
      return strings.RECEIVE
    case FlowType.Authorization:
      const { action } = interactionSummary.state as AuthorizationFlowState
      const ctaWord = action ? truncateFirstWord(action) : strings.AUTHORIZE
      const ctaCapitalized = capitalizeWord(ctaWord)
      return ctaCapitalized
    default:
      return ''
  }
}
