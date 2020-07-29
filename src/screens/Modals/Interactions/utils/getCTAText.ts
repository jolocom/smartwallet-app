import { FlowType } from '@jolocom/sdk/js/src/lib/interactionManager/types'
import { strings } from '~/translations/strings'
import { useSelector } from 'react-redux'
import { truncateFirstWord, capitalizeWord } from '~/utils/stringUtils'
import { getInteractionAction } from '~/modules/interaction/selectors'

export default function getCTAText(flowType: FlowType | null) {
  const action = useSelector(getInteractionAction)

  switch (flowType) {
    case FlowType.Authentication:
      return strings.AUTHENTICATE
    case FlowType.CredentialShare:
      return strings.SHARE
    case FlowType.CredentialReceive:
      return strings.RECEIVE
    case FlowType.Authorization:
      const ctaWord = action ? truncateFirstWord(action) : strings.AUTHORIZE
      const ctaCapitalized = capitalizeWord(ctaWord)
      return ctaCapitalized
    default:
      return ''
  }
}
