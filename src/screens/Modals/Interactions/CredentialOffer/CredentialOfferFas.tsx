import React from 'react'
import { useSelector } from 'react-redux'
import { View } from 'react-native'

import FasWrapper from '~/components/ActionSheet/FasWrapper'
import { getOfferCredentialsBySection } from '~/modules/interaction/selectors'
import InteractionSection from '../InteractionSection'
import CredentialCard from '../CredentialCard'
import { Colors } from '~/utils/colors'
import { OfferUICredential } from '~/types/credentials'
import InteractionFooter from '../InteractionFooter'
import { strings } from '~/translations/strings'
import JoloText, { JoloTextKind } from '~/components/JoloText'
import { JoloTextSizes } from '~/utils/fonts'

const CredentialOfferFas = () => {
  const { documents, other } = useSelector(getOfferCredentialsBySection)

  const renderCredentials = (credentials: OfferUICredential[]) =>
    credentials.map(({ type, invalid }) => (
      <View style={{ marginLeft: 27, borderColor: 'blue', borderWidth: 2 }}>
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
