import React from 'react';
import InteractionCardDoc from '~/assets/svg/InteractionCardDoc';
import { strings } from '~/translations';
import BP from '~/utils/breakpoints';
import { BodyFieldsCalculator } from '../../FieldsCalculator';
import ResponsiveCard from '../../ResponsiveCard';
import { CredentialName, FieldLabel } from '../reusable';
import {
  BodyContainer,
  BodyFieldsContainer,
  BodyFieldsGroup,
  BodyImageContainer,
  CredentialHolderName,
  EmptyContainer,
  HelperDescription,
  HelperTitle,
  HeaderContainer
} from '../styled';

const MAX_FIELD_DOC = 2;


export const IncomingRequestDoc = ({
  name,
  holderName,
  properties,
  highlight,
  image
}) => {
  const handleChildVisibility = (child: React.ReactNode, idx: number, lines: Record<number, number>) => {
    if (idx + 1 > MAX_FIELD_DOC) {
     /* 1. Do not display anything that is more than max */
     return null
    } else if (BP({
      default: !!highlight && idx > 0 && lines[0] > 1,
      xsmall: !!highlight && idx > 0
    })) {
      /* 2. Do not display all the fields besides first if number of lines of the first field is more than 1 and there is a highlight */
      return null
    }
    return child;
  }

  const handleNumberOfValueLinesToDisplay = (idx: number, lines: Record<number, number>) => {
    return idx !== 0
      ? lines[0] > 1 ? 1 : BP({ default: 2, xsmall: 1 })
      : BP({ default: 2, xsmall: highlight ? 2 : 1 });
    };

  return (
    <ResponsiveCard>
      <ResponsiveCard.Container>
        <InteractionCardDoc>
            {/* <HeaderContainer customStyles={{ flex: properties.length ? 0.5 : 0}}> */}
            <HeaderContainer customStyles={{ flex: highlight ? 0 : 0.5}}>
              <CredentialName numberOfLines={1}>{name}</CredentialName>
              {/* NOTE: when there is a highlight there
                is no enough space for the whole holder name
                without breaking further configurations  
              */}
              {holderName && (
                // <CredentialHolderName isTruncated={Boolean(highlight)}>{holderName}</CredentialHolderName>
                <ResponsiveCard.HolderName isTruncated={false}>{holderName}</ResponsiveCard.HolderName>
              )}
            </HeaderContainer>
            {properties.length ? (
              <BodyContainer>
                <BodyFieldsContainer isStretched={!image}>
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