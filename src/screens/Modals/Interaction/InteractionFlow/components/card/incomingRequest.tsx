import React from 'react';
import { BodyFieldsCalculator } from './context';
import { BodyContainer, BodyFieldsContainer, BodyFieldsGroup, BodyImageContainer, CardImage, CredentialHighlight, CredentialHolderName, CredentialImage, HeaderContainer, OtherContainer } from './credential';
import { CredentialName, FieldLabel, FieldValue } from './reusable';

const MAX_FIELD_DOC = 2;
const MAX_FIELD_OTHER = 3;

export const IncomingRequestDoc = ({ title, name, holderName, properties, hightlight, image }) => {
  const handleChildVisibility = (child: React.ReactNode, idx: number, lines: Record<number, number>) => {
    if (idx + 1 > MAX_FIELD_DOC) {
     /* 1. Do not display anything that is more than max */
     return null
    } else if (lines[0] > 1 && !!hightlight && idx > 0) {
      /* 2. Do not display all the fields besides first if number of lines of the first field is more than 1 and there is a highlight */
      return null
    }
    return child;
  }

  const handleNumberOfValueLinesToDisplay = (idx: number, lines: Record<number, number>) => {
    return idx !== 0 ? lines[0] > 1 ? 1 : 2 : 2;
    };

  return (
    <CardImage>
      <HeaderContainer>
        <CredentialName numberOfLines={1}>{title ?? name}</CredentialName>
        {/* NOTE: when there is a highlight there
          is no enough space for the whole holder name
          without breaking further configurations  
        */}
        <CredentialHolderName isTruncated={Boolean(hightlight)}>{holderName}</CredentialHolderName>
      </HeaderContainer>
      <BodyContainer>
        <BodyFieldsContainer isStretched={!image}>
          <BodyFieldsCalculator cbChildVisibility={handleChildVisibility}>
            {properties.map((p, idx) => (
              <BodyFieldsGroup>
                <FieldLabel>{p.label}</FieldLabel>
                <FieldValue idx={idx} onNumberOfFieldLinesToDisplay={handleNumberOfValueLinesToDisplay}>{p.value}</FieldValue>
              </BodyFieldsGroup>
            ))}
          </BodyFieldsCalculator>
        </BodyFieldsContainer>
        {/* NOTE: this is to enable sort of a wrapper effect around an image */}
        {image && (
          <BodyImageContainer />
        )}
      </BodyContainer>
      {/* NOTE: absolute values go outside of containers */}
      {image && (
        <CredentialImage imageUrl="https://i.pinimg.com/564x/63/9d/5b/639d5b86c73addfaeeb103ef0eb61041.jpg" />
      )}
      {hightlight && (
        <CredentialHighlight>{hightlight}</CredentialHighlight>
      )}
    </CardImage>
  )
}

export const IncomingRequestOther = ({ title, name, properties }) => {
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
  const handleNumberOfValueLinesToDisplay = () => 2;
  return (
    <CardImage>
      <OtherContainer>
        <HeaderContainer customStyles={{flex: 0, marginBottom: 10}}>
          <CredentialName numberOfLines={2} customStyles={{textAlign: 'left'}}>{title ?? name}</CredentialName>
        </HeaderContainer>
        <BodyContainer customStyles={{flex: 0}}>
          <BodyFieldsContainer isStretched>
            <BodyFieldsCalculator cbChildVisibility={handleChildVisibility}>
              {properties.map((p, idx) => (
                <BodyFieldsGroup>
                  <FieldLabel>{p.label}</FieldLabel>
                  <FieldValue idx={idx} onNumberOfFieldLinesToDisplay={handleNumberOfValueLinesToDisplay}>{p.value}</FieldValue>
                </BodyFieldsGroup>
              ))}
            </BodyFieldsCalculator>
          </BodyFieldsContainer>
        </BodyContainer>
      </OtherContainer>
    </CardImage>
  )
}