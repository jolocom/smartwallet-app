import React from 'react'
import { useSelector } from 'react-redux'
import { View } from 'react-native'

import FasWrapper from '~/components/ActionSheet/FasWrapper'
import { getOfferCredentialsBySection } from '~/modules/interaction/selectors'
import InteractionSection from '../components/InteractionSection'
import CredentialCard from '../components/CredentialCard'
import { Colors } from '~/utils/colors'
import { OfferUICredential } from '~/types/credentials'
import InteractionFooter, { FooterContainer } from '../components/InteractionFooter'
import { strings } from '~/translations/strings'
import JoloText, { JoloTextKind } from '~/components/JoloText'
import { JoloTextSizes } from '~/utils/fonts'
import InteractionHeader from '../components/InteractionHeader'
import useCredentialOfferFlow from '~/hooks/interactions/useCredentialOfferFlow'
import useCredentialOfferSubmit from '~/hooks/interactions/useCredentialOfferSubmit'

const CredentialOfferFas = () => {
  const { documents, other } = useSelector(getOfferCredentialsBySection)
  const { getHeaderText } = useCredentialOfferFlow()
  const handleSubmit = useCredentialOfferSubmit()

  const renderCredentials = (credentials: OfferUICredential[]) =>
    credentials.map(({ type, invalid }, idx) => (
      <View
        style={{
          marginBottom: idx === credentials.length - 1 ? 0 : 30,
        }}
      >
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
      <FasWrapper collapsedTitle={getHeaderText().title}>
        <InteractionHeader {...getHeaderText()} />
        <View style={{ alignItems: 'center' }}>
          <InteractionSection
            visible={!!documents.length}
            title={strings.DOCUMENTS}
          >
            {renderCredentials(documents)}
          </InteractionSection>
          <InteractionSection visible={!!other.length} title={strings.OTHER}>
            {renderCredentials(other)}
          </InteractionSection>
        </View>
      </FasWrapper>
      <FooterContainer>
        <InteractionFooter onSubmit={handleSubmit} cta={strings.RECEIVE} />
      </FooterContainer>
    </>
  )
}

export default CredentialOfferFas
