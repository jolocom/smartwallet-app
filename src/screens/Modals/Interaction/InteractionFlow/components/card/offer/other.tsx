import React from 'react'
import InteractionCardOther from '~/assets/svg/InteractionCardOther'
import { strings } from '~/translations'
import ResponsiveCard from '../../ResponsiveCard'
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
              <HelperTitle>Included info</HelperTitle>
              {displayedProps.length ? (
                <>
                  {displayedProps.map((p) => (
                    <BodyFieldsGroup key={p.key}>
                      <FieldLabel>{p.label}</FieldLabel>
                      <ResponsiveCard.FieldPlaceholder width={116} />
                    </BodyFieldsGroup>
                  ))}
                </>
              ) : (
                <HelperDescription>
                  {strings.NO_INFO_THAT_CAN_BE_PREVIEWED}
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
