import React from 'react';
import InteractionCardOther from '~/assets/svg/InteractionCardOther';
import { strings } from '~/translations';
import BP from '~/utils/breakpoints';
import { BodyFieldsCalculator } from '../../FieldsCalculator';
import { CredentialName, FieldLabel } from '../reusable';
import {
  BodyContainer,
  BodyFieldsContainer,
  BodyFieldsGroup,
  Container,
  EmptyContainer,
  EmptyFieldsDescription,
  EmptyFieldsTitle,
  HeaderContainer,
  OtherContainer,
  OtherTitle,
  OtherTitleContainer
} from '../styled';

const MAX_FIELD_OTHER = 3;

export const IncomingRequestOther = ({
  title,
  subtitle,
  name,
  properties
}) => {
  const handleChildVisibility = (child: React.ReactNode, idx: number, lines: Record<number, number>) => {
    if (idx + 1 > MAX_FIELD_OTHER) {
      /* 1. Do not display anything that is more than max */
      return null
    } else if (lines[0] && lines[1] && lines[0] + lines[1] > 2 && idx > 1) {
      /* 2. If the sum of first and second field values is greater than 2 do not display anything later*/
      return null
    }
    return child;
  }

  /* NOTE: in other cards we can allow to display 2 lines
    constantly no matter how many lines are in the first value
  */
  const handleNumberOfValueLinesToDisplay = (idx: number) => {
    return BP({
      default: 2,
      xsmall: idx !== 0 ? 1 : 2
    })
  };

  return (
    <Container>
      <InteractionCardOther>
        <OtherContainer>
          <HeaderContainer customStyles={{flex: 0, marginBottom: 10}}>
            <CredentialName numberOfLines={2} customStyles={{textAlign: 'left'}}>{subtitle ?? title ?? name}</CredentialName>
          </HeaderContainer>
          {properties.length ? (
            <BodyContainer customStyles={{flex: 0, alignSelf: 'flex-end'}}>
              <BodyFieldsContainer isStretched>
                <BodyFieldsCalculator cbChildVisibility={handleChildVisibility}>
                  {properties.map((p, idx) => (
                    <BodyFieldsGroup>
                      <FieldLabel>{p.label}</FieldLabel>
                      <BodyFieldsCalculator.FieldValue
                        idx={idx}
                        onNumberOfFieldLinesToDisplay={handleNumberOfValueLinesToDisplay}
                      >
                        {p.value}
                      </BodyFieldsCalculator.FieldValue>
                    </BodyFieldsGroup>
                  ))}
                </BodyFieldsCalculator>
              </BodyFieldsContainer>
            </BodyContainer>
          ) : (
            <EmptyContainer>
              <EmptyFieldsTitle>{strings.INCLUDED_INFO}</EmptyFieldsTitle>
              <EmptyFieldsDescription>{strings.NO_INPUT_THAT_CAN_BE_PREVIEWED}</EmptyFieldsDescription>
            </EmptyContainer>
          )}
        </OtherContainer>
        <OtherTitleContainer>
          <OtherTitle>{title}</OtherTitle>
        </OtherTitleContainer>
      </InteractionCardOther>
    </Container>
      
  )
}