import React from 'react';
import InteractionCardDoc from '~/assets/svg/InteractionCardDoc';
import BP from '~/utils/breakpoints';
import { CredentialName } from '../reusable';
import {
  BodyFieldsContainer,
  BodyFieldsGroup,
  Container,
  EmptyFieldsDescription,
  EmptyFieldsTitle,
  FieldPlaceholder,
  HeaderContainer
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
          <EmptyFieldsTitle>Included info</EmptyFieldsTitle>
          {displayedProps.length ? (
            <>
              {displayedProps.map(p => (
                <BodyFieldsGroup>
                  <EmptyFieldsDescription>{p.label}</EmptyFieldsDescription>
                  <FieldPlaceholder />
                </BodyFieldsGroup>
              ))}
            </>
          ) : (
            <EmptyFieldsDescription>
              No info that can be previewed
            </EmptyFieldsDescription>
          )}
        </BodyFieldsContainer>
      </InteractionCardDoc>
    </Container>
  )
}

export default IncomingOfferDoc;