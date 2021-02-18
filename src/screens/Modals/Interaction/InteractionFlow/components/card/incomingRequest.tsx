import React from 'react';
import { BodyFieldsCalculator } from './context';
import { BodyContainer, BodyFieldsContainer, BodyFieldsGroup, BodyImageContainer, CardImage, CredentialHighlight, CredentialHolderName, CredentialImage, HeaderContainer, OtherContainer } from './credential';
import { CredentialName, FieldLabel, FieldValue } from './reusable';

export const IncomingRequestDoc = ({ title, name, holderName, properties, hightlight, image }) => {
  return (
    <CardImage>
      <HeaderContainer>
        <CredentialName>{title ?? name}</CredentialName>
        <CredentialHolderName hasHighlight={Boolean(hightlight)}>{holderName}</CredentialHolderName>
      </HeaderContainer>
      <BodyContainer>
        <BodyFieldsContainer isStretched={!image}>
          <BodyFieldsCalculator maxFields={2} hasHighlight={Boolean(hightlight)}>
            {properties.map((p, idx) => (
              <BodyFieldsGroup>
                <FieldLabel>{p.label}</FieldLabel>
                <FieldValue idx={idx}>{p.value}</FieldValue>
              </BodyFieldsGroup>
            ))}
          </BodyFieldsCalculator>
        </BodyFieldsContainer>
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
  return (
    <CardImage>
      <OtherContainer>
        <HeaderContainer customStyles={{flex: 0, marginBottom: 10}}>
          <CredentialName numberOfLines={2} customStyles={{textAlign: 'left'}}>{title ?? name}</CredentialName>
        </HeaderContainer>
        <BodyContainer customStyles={{flex: 0}}>
          <BodyFieldsContainer isStretched>
            <BodyFieldsCalculator maxFields={3}>
              {properties.map((p, idx) => (
                <BodyFieldsGroup>
                  <FieldLabel>{p.label}</FieldLabel>
                  <FieldValue idx={idx}>{p.value}</FieldValue>
                </BodyFieldsGroup>
              ))}
            </BodyFieldsCalculator>
          </BodyFieldsContainer>
        </BodyContainer>
      </OtherContainer>
    </CardImage>
  )
}