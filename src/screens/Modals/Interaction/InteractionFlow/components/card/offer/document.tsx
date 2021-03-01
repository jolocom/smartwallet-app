import React from 'react';
import InteractionCardDoc from '~/assets/svg/InteractionCardDoc';
import BP from '~/utils/breakpoints';
import { CredentialName, FieldLabel } from '../reusable';
import {
  BodyFieldsContainer,
  BodyFieldsGroup,
  Container,
  HelperDescription,
  FieldPlaceholder,
  HeaderContainer,
  HelperTitle
} from '../styled';

const IncomingOfferDoc = ({
  title,
  name,
  properties,
}) => {
  const displayedProps = properties.slice(0, BP({ default: 3, xsmall: 2 }));
  return (
    <Container>
      <InteractionCardDoc>
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
      </InteractionCardDoc>
    </Container>
  )
}

export default IncomingOfferDoc;