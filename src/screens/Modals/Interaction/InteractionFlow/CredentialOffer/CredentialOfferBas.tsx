import React from 'react'
import { useSelector } from 'react-redux'

import BasWrapper, {
  BasInteractionBody,
} from '~/components/ActionSheet/BasWrapper'
import CredentialCard from '../components/CredentialCard'
import { getCredOfferDetails } from '~/modules/interaction/selectors'
import JoloText, { JoloTextKind } from '~/components/JoloText'
import { Colors } from '~/utils/colors'
import { JoloTextSizes } from '~/utils/fonts'
import InteractionHeader from '../components/InteractionHeader'
import useCredentialOfferFlow from '~/hooks/interactions/useCredentialOfferFlow'
import useCredentialOfferSubmit from '~/hooks/interactions/useCredentialOfferSubmit'
import { strings } from '~/translations/strings'
import InteractionFooter from '../components/InteractionFooter'

const CredentialOfferBas = () => {
  const details = useSelector(getCredOfferDetails)
  const {
    credentials: { service_issued },
  } = details
  const { type } = service_issued[0]
  const { getHeaderText } = useCredentialOfferFlow()
  const handleSubmit = useCredentialOfferSubmit()

  return (
    <BasWrapper>
      <InteractionHeader {...getHeaderText()} />
      <BasInteractionBody>
        <CredentialCard>
          <JoloText
            kind={JoloTextKind.title}
            size={JoloTextSizes.middle}
            color={Colors.black}
          >
            {type}
          </JoloText>
        </CredentialCard>
      </BasInteractionBody>
      <InteractionFooter cta={strings.RECEIVE} onSubmit={handleSubmit} />
    </BasWrapper>
  )
}

export default CredentialOfferBas
