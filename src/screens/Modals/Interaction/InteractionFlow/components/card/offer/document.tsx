import React from 'react'
import InteractionCardDoc from '~/assets/svg/InteractionCardDoc'
import useTranslation from '~/hooks/useTranslation'
import BP from '~/utils/breakpoints'
import ResponsiveCard from '../../ResponsiveCard'
import { Space } from '../../styled'
import {
  BodyFieldsContainer,
  BodyFieldsGroup,
  HelperDescription,
  HeaderContainer,
  HelperTitle,
  CredentialName,
  FieldLabel,
} from '../styled'
import { IIncomingOfferDocProps } from '../types'

const IncomingOfferDoc: React.FC<IIncomingOfferDocProps> = ({
  name,
  properties,
}) => {
  const { t } = useTranslation()

  const displayedProps = properties.slice(0, 3)
  return (
    <ResponsiveCard>
      <ResponsiveCard.Container>
        <InteractionCardDoc>
          <HeaderContainer customStyles={{ flex: 0 }}>
            <CredentialName numberOfLines={1}>{name}</CredentialName>
          </HeaderContainer>
          <BodyFieldsContainer isStretched>
            <HelperTitle>{t('CredentialOffer.cardInfoHeader')}</HelperTitle>
            {displayedProps.length ? (
              <>
                <Space height={BP({ default: 8, small: 4, xsmall: 4 })} />
                {displayedProps.map((p) => (
                  <BodyFieldsGroup key={p.key}>
                    {/* NOTE: Compared to Credential Request cards, these need additional spacing */}
                    <Space height={4} />
                    <FieldLabel>{p.label}</FieldLabel>
                    <ResponsiveCard.FieldPlaceholder width={156} />
                  </BodyFieldsGroup>
                ))}
              </>
            ) : (
              <HelperDescription>
                {t('CredentialOffer.cardNoPreview')}
              </HelperDescription>
            )}
          </BodyFieldsContainer>
        </InteractionCardDoc>
      </ResponsiveCard.Container>
    </ResponsiveCard>
  )
}

export default IncomingOfferDoc
