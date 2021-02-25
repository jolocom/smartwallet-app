import React from 'react';
import InteractionCardOther from '~/assets/svg/InteractionCardOther';
import BP from '~/utils/breakpoints';
import { CredentialName } from '../reusable';
import { BodyFieldsContainer, BodyFieldsGroup, Container, EmptyFieldsDescription, EmptyFieldsTitle, FieldPlaceholder, HeaderContainer, OtherContainer } from '../styled';

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
        </OtherContainer>
      </InteractionCardOther>
    </Container>
  )
}

export default IncomingOfferOther