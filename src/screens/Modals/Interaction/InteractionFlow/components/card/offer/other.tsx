import React from 'react'
import InteractionCardOther from '~/assets/svg/InteractionCardOther'
import useTranslation from '~/hooks/useTranslation'
import BP from '~/utils/breakpoints'
import ResponsiveCard from '../../ResponsiveCard'
import { Space } from '../../styled'
import {
  BodyFieldsContainer,
  BodyFieldsGroup,
  HelperDescription,
  HelperTitle,
  HeaderContainer,
  OtherContainer,
  CredentialName,
  FieldLabel,
} from '../styled'
import { IIncomingOfferOtherProps } from '../types'

const IncomingOfferOther: React.FC<IIncomingOfferOtherProps> = ({
  name,
  properties,
}) => {
  const { t } = useTranslation()

  const displayedProps = properties.slice(0, 3)
  return (
    <ResponsiveCard>
      <ResponsiveCard.Container>
        <InteractionCardOther>
          <OtherContainer>
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
                      {/* NOTE: Compared to Credential Request Document, these need additional spacing */}
                      <Space height={4} />
                      <FieldLabel>{p.label}</FieldLabel>
                      <ResponsiveCard.FieldPlaceholder width={116} />
                    </BodyFieldsGroup>
                  ))}
                </>
              ) : (
                <HelperDescription>
                  {t('CredentialOffer.cardNoPreview')}
                </HelperDescription>
              )}
            </BodyFieldsContainer>
          </OtherContainer>
        </InteractionCardOther>
      </ResponsiveCard.Container>
    </ResponsiveCard>
  )
}

export default IncomingOfferOther
