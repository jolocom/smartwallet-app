import React from 'react'
import { useSelector } from 'react-redux'
import { View } from 'react-native'

import FasWrapper from '~/components/ActionSheet/FasWrapper'
import {
  getOfferCredentialsBySection,
  getCounterpartyName,
} from '~/modules/interaction/selectors'
import InteractionSection from '../InteractionSection'
import CredentialCard from '../CredentialCard'
import { Colors } from '~/utils/colors'
import { OfferUICredential } from '~/types/credentials'
import InteractionFooter from '../InteractionFooter'
import { strings } from '~/translations/strings'
import JoloText, { JoloTextKind } from '~/components/JoloText'
import { JoloTextSizes } from '~/utils/fonts'
import InteractionHeader from '../InteractionHeader'
import useCredentialOfferFlow from '~/hooks/interactions/useCredentialOfferFlow'

const CredentialOfferFas = () => {
  const { documents, other } = useSelector(getOfferCredentialsBySection)
  const { getHeaderText } = useCredentialOfferFlow()

  const renderCredentials = (credentials: OfferUICredential[]) =>
    credentials.map(({ type, invalid }) => (
      <View style={{ marginLeft: 27 }}>
        <CredentialCard disabled={invalid}>
          <JoloText
            kind={JoloTextKind.title}
            size={JoloTextSizes.middle}
            color={Colors.black}
          >
            {type}
          </JoloText>
        </CredentialCard>
      </View>
    ))

  return (
    <>
      <FasWrapper>
        <InteractionHeader {...getHeaderText()} />
        <InteractionSection
          visible={!!documents.length}
          title={strings.DOCUMENTS}
        >
          {renderCredentials(documents)}
        </InteractionSection>
        <InteractionSection visible={!!other.length} title={strings.OTHER}>
          {renderCredentials(other)}
        </InteractionSection>
      </FasWrapper>
      <InteractionFooter />
    </>
  )
}

export default CredentialOfferFas
