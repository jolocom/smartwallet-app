import React from 'react';
import InteractionCardDoc from '~/assets/svg/InteractionCardDoc';
import { strings } from '~/translations';
import ResponsiveCard from '../../ResponsiveCard';
import {
  BodyFieldsContainer,
  BodyFieldsGroup,
  HelperDescription,
  HeaderContainer,
  HelperTitle,
  CredentialName,
  FieldLabel
} from '../styled';
import { IIncomingOfferDocProps } from '../types';

const IncomingOfferDoc: React.FC<IIncomingOfferDocProps> = ({
  name,
  properties,
}) => {
  const displayedProps = properties.slice(0, 3);
  return (
    <ResponsiveCard>
      <ResponsiveCard.Container>
        <InteractionCardDoc>
            <HeaderContainer customStyles={{flex: 0}}>
              <CredentialName numberOfLines={1}>{name}</CredentialName>
            </HeaderContainer>
            <BodyFieldsContainer isStretched>
              <HelperTitle>
                {strings.INCLUDED_INFO}
              </HelperTitle>
              {displayedProps.length ? (
                <>
                  {displayedProps.map(p => (
                    <BodyFieldsGroup>
                      <FieldLabel>{p.label}</FieldLabel>
                      <ResponsiveCard.FieldPlaceholder width={156} />
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

export default IncomingOfferDoc;