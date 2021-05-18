import React from 'react'
import InteractionCardDoc from '~/assets/svg/InteractionCardDoc'
import { strings } from '~/translations'
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
  const displayedProps = properties.slice(0, 3)
  return (
    <ResponsiveCard>
      <ResponsiveCard.Container>
        <InteractionCardDoc>
          <HeaderContainer customStyles={{ flex: 0 }}>
            <CredentialName numberOfLines={1}>{name}</CredentialName>
            <Space height={BP({ default: 5, xsmall: 2 })} />
          </HeaderContainer>
          <BodyFieldsContainer isStretched>
            <HelperTitle>{strings.INCLUDED_INFO}</HelperTitle>
            <Space height={BP({ default: 5, xsmall: 2 })} />
            {displayedProps.length ? (
              <>
                {displayedProps.map((p) => (
                  <BodyFieldsGroup key={p.key}>
                    <FieldLabel>{p.label}</FieldLabel>
                    <ResponsiveCard.FieldPlaceholder width={156} />
                    <Space height={BP({ default: 3, xsmall: 1 })} />
                  </BodyFieldsGroup>
                ))}
              </>
            ) : (
              <HelperDescription>
                {strings.NO_INFO_THAT_CAN_BE_PREVIEWED}
              </HelperDescription>
            )}
          </BodyFieldsContainer>
        </InteractionCardDoc>
      </ResponsiveCard.Container>
    </ResponsiveCard>
  )
}

export default IncomingOfferDoc
