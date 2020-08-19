import { FlowType } from '@jolocom/sdk/js/src/lib/interactionManager/types'
import { useSelector } from 'react-redux'

import { strings } from '~/translations/strings'
import { truncateFirstWord, capitalizeWord } from '~/utils/stringUtils'
import { getInteractionDetails } from '~/modules/interaction/selectors'
import { AuthorizationDetailsI } from '~/modules/interaction/types'
import { useRootSelector } from '~/hooks/useRootSelector'
import { getInteractionType } from '~/modules/interaction/selectors'

export default function useInteractionCta() {
  const interactionType = useSelector(getInteractionType)
  const { action } = useRootSelector<AuthorizationDetailsI | { action: null }>(
    getInteractionDetails,
  )

  switch (interactionType) {
    case FlowType.Authentication:
      return strings.AUTHENTICATE
    case FlowType.CredentialShare:
      return strings.SHARE
    case FlowType.CredentialOffer:
      return strings.RECEIVE
    case FlowType.Authorization:
      const ctaWord = action ? truncateFirstWord(action) : strings.AUTHORIZE
      const ctaCapitalized = capitalizeWord(ctaWord)
      return ctaCapitalized
    default:
      return ''
  }
}
