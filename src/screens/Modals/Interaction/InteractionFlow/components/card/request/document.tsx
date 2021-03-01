import React from 'react';
import InteractionCardDoc from '~/assets/svg/InteractionCardDoc';
import { strings } from '~/translations';
import ResponsiveCard from '../../ResponsiveCard';
import { CredentialName, FieldLabel } from '../reusable';
import {
  BodyContainer,
  BodyFieldsContainer,
  BodyFieldsGroup,
  BodyImageContainer,
  EmptyContainer,
  HelperDescription,
  HelperTitle,
  HeaderContainer
} from '../styled';
import { IIncomingRequestDocCardProps } from '../types';

const MAX_FIELD_DOC = 2;


export const IncomingRequestDoc: React.FC<IIncomingRequestDocCardProps> = ({
  name,
  holderName,
  properties,
  highlight,
  image
}) => {
  const handleFieldValuesVisibility = (child: React.ReactNode, idx: number, fieldLines: Record<number, number>, holderNameLines: number) => {
    if (idx + 1 > MAX_FIELD_DOC) {
     /* 1. Do not display anything that is more than max */
     return null
    } else if (
      (!!highlight && idx > 0 && fieldLines[0] > 1) ||
      (!!highlight && idx > 0 && holderNameLines > 1)) {
      /* 2. Do not display all the fields besides first if number of lines of the first field is more than 1 and there is a highlight */
      return null
    }
    return child;
  }

  const handleNumberOfValueLinesToDisplay = (idx: number, fieldLines: Record<number, number>) => {
    return idx !== 0
      ? fieldLines[0] > 1 ? 1 : 2
      : 2
    };

  return (
    <ResponsiveCard>
      <ResponsiveCard.Container>
        <InteractionCardDoc>
            <HeaderContainer customStyles={{ flex: highlight || !properties.length ? 0 : 0.5}}>
              <CredentialName numberOfLines={1}>{name}</CredentialName>
              {holderName && (
              <ResponsiveCard.HolderName>{holderName}</ResponsiveCard.HolderName>
            )}
            </HeaderContainer>
            {properties.length ? (
              <BodyContainer>
                <BodyFieldsContainer isStretched={!image}>
                  <ResponsiveCard.FieldsCalculator cbFieldsVisibility={handleFieldValuesVisibility}>
                    {properties.map((p, idx) => (
                      <BodyFieldsGroup>
                        <FieldLabel>{p.label}</FieldLabel>
                        <ResponsiveCard.FieldValue
                          idx={idx}
                          onNumberOfFieldLinesToDisplay={handleNumberOfValueLinesToDisplay}
                        >
                          {p.value}
                        </ResponsiveCard.FieldValue>
                      </BodyFieldsGroup>
                    ))}
                  </ResponsiveCard.FieldsCalculator>
                </BodyFieldsContainer>
                {/* NOTE: this is to enable sort of a wrapper effect around an image */}
                {image && (
                  <BodyImageContainer />
                )}
              </BodyContainer>
            ) : (
                <EmptyContainer>
                  <HelperTitle>{strings.INCLUDED_INFO}</HelperTitle>
                  <HelperDescription>{strings.NO_INPUT_THAT_CAN_BE_PREVIEWED}</HelperDescription>
                </EmptyContainer>
            )}

            {/* NOTE: absolute values go outside of containers */}
            {image && (
              <ResponsiveCard.Image imageUrl="https://i.pinimg.com/564x/63/9d/5b/639d5b86c73addfaeeb103ef0eb61041.jpg" />
            )}
            {highlight && (
              <ResponsiveCard.Highlight>{highlight}</ResponsiveCard.Highlight>
          )}
          
        </InteractionCardDoc>
      </ResponsiveCard.Container>
    </ResponsiveCard>

  )
}