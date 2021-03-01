import React from 'react';
import InteractionCardOther from '~/assets/svg/InteractionCardOther';
import ResponsiveCard from '../../ResponsiveCard';
import { CredentialName, FieldLabel } from '../reusable';
import {
  BodyFieldsContainer,
  BodyFieldsGroup,
  HelperDescription,
  HelperTitle,
  HeaderContainer,
  OtherContainer
} from '../styled';
import { IIncomingOfferOtherProps } from '../types';

const IncomingOfferOther: React.FC<IIncomingOfferOtherProps> = ({
  name,
  properties
}) => {
  const displayedProps = properties.slice(0, 3);
  return (
    <ResponsiveCard>

    <ResponsiveCard.Container>
      <InteractionCardOther>
        <OtherContainer>
          <HeaderContainer customStyles={{flex: 0}}>
            <CredentialName numberOfLines={1}>{name}</CredentialName>
          </HeaderContainer>
          <BodyFieldsContainer isStretched>
            <HelperTitle>
              Included info
            </HelperTitle>
            {displayedProps.length ? (
              <>
                {displayedProps.map(p => (
                  <BodyFieldsGroup>
                    <FieldLabel>{p.label}</FieldLabel>
                    <ResponsiveCard.FieldPlaceholder width={116} />
                  </BodyFieldsGroup>
                ))}
              </>
            ) : (
              <HelperDescription>
                No info that can be previewed
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