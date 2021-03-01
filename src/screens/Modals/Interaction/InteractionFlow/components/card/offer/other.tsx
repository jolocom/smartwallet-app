import React from 'react';
import InteractionCardOther from '~/assets/svg/InteractionCardOther';
import BP from '~/utils/breakpoints';
import { CredentialName, FieldLabel } from '../reusable';
import {
  BodyFieldsContainer,
  BodyFieldsGroup,
  Container,
  HelperDescription,
  HelperTitle,
  FieldPlaceholder,
  HeaderContainer,
  OtherContainer
} from '../styled';

const IncomingOfferOther = ({
  title,
  name,
  properties
}) => {
  const displayedProps = properties.slice(0, BP({ default: 3, xsmall: 2 }));
  return (
    <Container>
      <InteractionCardOther>
        <OtherContainer>
          <HeaderContainer customStyles={{flex: 0}}>
            <CredentialName numberOfLines={1}>{title ?? name}</CredentialName>
          </HeaderContainer>
          <BodyFieldsContainer isStretched>
            <HelperTitle
              customStyles={{
                marginVertical: BP({ default: 6, small: 3, xsmall: 3 })
              }}
            >
              Included info
            </HelperTitle>
            {displayedProps.length ? (
              <>
                {displayedProps.map(p => (
                  <BodyFieldsGroup>
                    <FieldLabel>{p.label}</FieldLabel>
                    <FieldPlaceholder />
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
    </Container>
  )
}

export default IncomingOfferOther