import { FlowType } from '@jolocom/sdk/js/src/lib/interactionManager/types'
import { useSelector } from 'react-redux'

import { strings } from '~/translations/strings'
import { truncateFirstWord, capitalizeWord } from '~/utils/stringUtils'
import { getInteractionDetails } from '~/modules/interaction/selectors'
import { RootReducerI } from '~/types/reducer'
import { AuthorizationDetailsI } from '~/modules/interaction/types'

export default function getCTAText(flowType: FlowType | null) {
  const { action } = useSelector((state: RootReducerI) =>
    getInteractionDetails<AuthorizationDetailsI>(state),
  )

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
