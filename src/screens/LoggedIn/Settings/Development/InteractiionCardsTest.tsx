import React from 'react';
import { ScrollView, View } from 'react-native';
import ScreenContainer from '~/components/ScreenContainer';
import { BodyContainer, BodyFieldsContainer, BodyImageContainer, CardImage, CredentialHighlight, CredentialHolderName, CredentialImage, HeaderContainer } from '~/screens/Modals/Interaction/InteractionFlow/components/card/credential';
import { FieldLabel, FieldValue, CredentialName } from '~/screens/Modals/Interaction/InteractionFlow/components/card/reusable';
import Section from '../components/Section';

const InteractionCardsTest = () => {
  return (
    <ScreenContainer
      hasHeaderBack
      isFullscreen
      customStyles={{ justifyContent: 'flex-start' }}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 100}}
      >

      <Section.Title>Incoming request</Section.Title>
      <CardImage>
        <HeaderContainer>
          <CredentialName>Digital Passport</CredentialName>
          <CredentialHolderName>Jane Fitzgerald</CredentialHolderName>
        </HeaderContainer>
        <BodyContainer>
          <BodyFieldsContainer>
            <FieldLabel>Date of birth</FieldLabel>
            <FieldValue>04.06.1984</FieldValue>
            <FieldLabel>Expiry date</FieldLabel>
            <FieldValue>11.04.2023</FieldValue>
          </BodyFieldsContainer>
          {/* NOTE: Should be displayed only if there is an image */} 
          <BodyImageContainer />
          <CredentialImage imageUrl="https://i.pinimg.com/564x/63/9d/5b/639d5b86c73addfaeeb103ef0eb61041.jpg" />
        </BodyContainer>
      </CardImage>
      <View style={{height: 20}} />
        <CardImage>
          <HeaderContainer>
            <CredentialName>Digital Passport</CredentialName>
            <CredentialHolderName>Jane Fitzgerald</CredentialHolderName>
          </HeaderContainer>
          <BodyContainer>
            <BodyFieldsContainer>
              <FieldLabel>Date of birth</FieldLabel>
              <FieldValue>04.06.1984</FieldValue>
              <FieldLabel>Expiry date</FieldLabel>
              <FieldValue>11.04.2023</FieldValue>
              <FieldLabel>Expiry date</FieldLabel>
              <FieldValue>11.04.2023</FieldValue>
            </BodyFieldsContainer>
            {/* Should be displayed only if there is an image */}
            <BodyImageContainer /> 
          </BodyContainer>
          <CredentialImage imageUrl="https://i.pinimg.com/564x/63/9d/5b/639d5b86c73addfaeeb103ef0eb61041.jpg" />
          <CredentialHighlight>SPECI2014</CredentialHighlight>
        </CardImage>
        <View style={{ height: 20 }} />
        <CardImage>
        <HeaderContainer>
          <CredentialName>Friendly document name</CredentialName>
          <CredentialHolderName>Jane Fransis Scott Adelina Fitzgerald </CredentialHolderName>
        </HeaderContainer>
        <BodyContainer>
          <BodyFieldsContainer>
            <FieldLabel>Description of the input:</FieldLabel>
            <FieldValue>Some more info that can fit in here and if it is not going on sjdsjd</FieldValue>
            <FieldLabel>Extra long description of the input:</FieldLabel>
            <FieldValue>Some more info that can fit asjdasdjs</FieldValue>
          </BodyFieldsContainer>
          {/* NOTE: Should be displayed only if there is an image */} 
          <BodyImageContainer />
          <CredentialImage imageUrl="https://i.pinimg.com/564x/63/9d/5b/639d5b86c73addfaeeb103ef0eb61041.jpg" />
        </BodyContainer>
        </CardImage>
        <View style={{ height: 20 }} />
        <CardImage>
        <HeaderContainer>
          <CredentialName>Friendly document name</CredentialName>
          <CredentialHolderName>Jane Fransis Scott Adelina Fitzgerald </CredentialHolderName>
        </HeaderContainer>
        <BodyContainer>
          <BodyFieldsContainer isStretched>
            <FieldLabel>Description of the input:</FieldLabel>
            <FieldValue>Some more info that can fit in here and if it is not going on sjdsjd</FieldValue>
            <FieldLabel>Extra long description of the input:</FieldLabel>
            <FieldValue>Some more info that can fit asjdasdjs</FieldValue>
          </BodyFieldsContainer>
          {/* NOTE: Should be displayed only if there is an image */} 
        </BodyContainer>
        </CardImage>
        <View style={{ height: 20 }} />
      </ScrollView>
      
    </ScreenContainer>
  )
}

export default InteractionCardsTest;