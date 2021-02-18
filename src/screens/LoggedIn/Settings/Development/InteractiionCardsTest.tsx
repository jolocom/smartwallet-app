import React from 'react';
import { ScrollView, View } from 'react-native';
import ScreenContainer from '~/components/ScreenContainer';
import { BodyFieldsCalculator } from '~/screens/Modals/Interaction/InteractionFlow/components/card/context';
import { BodyContainer, BodyFieldsContainer, BodyFieldsGroup, BodyImageContainer, CardImage, CredentialHighlight, CredentialHolderName, CredentialImage, HeaderContainer } from '~/screens/Modals/Interaction/InteractionFlow/components/card/credential';
import { FieldLabel, FieldValue, CredentialName } from '~/screens/Modals/Interaction/InteractionFlow/components/card/reusable';
import Section from '../components/Section';

const CARDS = [
  {
    id: 0,
    holderName: 'Jane Fitzgerald', // TODO: we won't receive it in the same format from sdk, this field should be added
    name: 'Digital Passport',
    title: 'Digital Passport',
    properties: [
      {
        key: 'a',
        label: 'Date of birth',
        value: '04.06.1984'
      },
      {
        key: 'b',
        label: 'Expiry date',
        value: '04.06.1984'
      },
    ],
    image: 'https://i.pinimg.com/564x/63/9d/5b/639d5b86c73addfaeeb103ef0eb61041.jpg',
  },
  {
    id: 1,
    holderName: 'Jane Fransis Scott Adelina Fitzgerald', // TODO: we won't receive it in the same format from sdk, this field should be added
    name: 'Digital Passport',
    title: 'Digital Passport',
    properties: [
      {
        key: 'a',
        label: 'Date of birth',
        value: '04.06.1984'
      },
      {
        key: 'b',
        label: 'Expiry date',
        value: '04.06.1984'
      },
            {
        key: 'b',
        label: 'Issue date',
        value: '04.06.1984'
      }

    ],
    image: 'https://i.pinimg.com/564x/63/9d/5b/639d5b86c73addfaeeb103ef0eb61041.jpg', 
    hightlight: 'SPECI2014' // TODO: we won't receive it in the same format from sdk, this field should be added
  },
  {
    id: 2,
    holderName: 'Jane Fransis Scott Adelina Fitzgerald', // TODO: we won't receive it in the same format from sdk, this field should be added
    name: 'Friendly document name',
    title: 'Friendly document name',
    properties: [
      {
        key: 'a',
        label: 'Description of the input',
        value: 'Some more info that can fit'
      },
      {
        key: 'b',
        label: 'Extra long description of the input',
        value: 'Some more info that can fit asjdasdjs in here and if it is not going on sjdsjd'
      },
    ],
    image: 'https://i.pinimg.com/564x/63/9d/5b/639d5b86c73addfaeeb103ef0eb61041.jpg',
  },
  {
    id: 3,
    holderName: 'Jane Fransis Scott Adelina Fitzgerald', // TODO: we won't receive it in the same format from sdk, this field should be added
    name: 'Friendly document name',
    title: 'Friendly document name',
    properties: [
      {
        key: 'a',
        label: 'Description of the input',
        value: 'Some more info that can fit asjdasdjs fit in here and if it is not going on sjdsjd'
      },
      {
        key: 'b',
        label: 'Extra long description of the input',
        value: 'Some more info that can fit asjdasdjs fit in here and if it is not going on sjdsjd'
      },
    ],
  },
  {
    id: 4,
    holderName: 'Jane Fransis Scott Adelina Fitzgerald', // TODO: we won't receive it in the same format from sdk, this field should be added
    name: 'Digital Passport',
    title: 'Digital Passport',
    properties: [
      {
        key: 'a',
        label: 'Description of the input',
        value: 'Some more info that can fit in here and if it is not going on sjdsjd'
      },
      {
        key: 'b',
        label: 'Extra long description of the input',
        value: 'Some more info that can fit asjdasdjs'
      },
    ],
    image: 'https://i.pinimg.com/564x/63/9d/5b/639d5b86c73addfaeeb103ef0eb61041.jpg',
    hightlight: 'SPECI2014',

  }

]

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
        {CARDS.map(c => (
          <>
            <CardImage>
              <HeaderContainer>
                <CredentialName>{c.title ?? c.name}</CredentialName>
                <CredentialHolderName>{c.holderName}</CredentialHolderName>
              </HeaderContainer>
              <BodyContainer>
                <BodyFieldsContainer isStretched={!c.image}>
                  <BodyFieldsCalculator maxFields={2} hasHighlight={Boolean(c.hightlight)}>
                    {c.properties.map((p, idx) => (
                      <BodyFieldsGroup>
                        <FieldLabel>{p.label}</FieldLabel>
                        <FieldValue idx={idx}>{p.value}</FieldValue>
                      </BodyFieldsGroup>
                    ))}
                  </BodyFieldsCalculator>
                </BodyFieldsContainer>
                {c.image && (
                  <BodyImageContainer />
                )}
              </BodyContainer>
              {/* NOTE: absolute values go outside of containers */}
              {c.image && (
                <CredentialImage imageUrl="https://i.pinimg.com/564x/63/9d/5b/639d5b86c73addfaeeb103ef0eb61041.jpg" />
              )}
              {c.hightlight && (
                <CredentialHighlight>{c.hightlight}</CredentialHighlight>
              )}
            </CardImage>
            <View style={{height: 20}} />
          </>
        ))}
      </ScrollView>
      
    </ScreenContainer>
  )
}

export default InteractionCardsTest;