import React from 'react';
import { ScrollView, View } from 'react-native';
import ScreenContainer from '~/components/ScreenContainer';
import { IncomingRequestDoc, IncomingRequestOther } from '~/screens/Modals/Interaction/InteractionFlow/components/card/incomingRequest';
import Section from '../components/Section';

const REQUEST_DOCS = [
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
  },
  {
    id: 5,
    holderName: 'Jane Fransis Scott Adelina Fitzgerald', // TODO: we won't receive it in the same format from sdk, this field should be added
    name: 'Digital Passport',
    title: 'Digital Passport',
    properties: [],
  },
  {
    id: 6,
    name: 'Digital Passport',
    title: 'Digital Passport',
    properties: [],
  }

]

const REQUEST_OTHER = [
  {
    id: 0,
    name: 'Tame Impala 2023',
    title: 'Tame Impala 2023',
    properties: [
      {
        key: 'a',
        label: 'Place',
        value: 'Berlin Arena'
      },
      {
        key: 'b',
        label: 'Date',
        value: '04.07.2023'
      },
      {
        key: 'c',
        label: 'Seat',
        value: '15a, sector D'
      },
      {
        key: 'c',
        label: 'Seat',
        value: '15a, sector D'
      },

    ],
  },
  {
    id: 1,
    name: 'Tame Impala 2023 Wolrd tour',
    title: 'Tame Impala 2023 Wolrd tour',
    properties: [
      {
        key: 'a',
        label: 'Description of the input',
        value: 'Information that should be previewed here'
      },
      {
        key: 'b',
        label: 'Description of the input',
        value: 'Information'
      },
      {
        key: 'b',
        label: 'Description of the input',
        value: 'Information'
      },

    ],
  },
  {
    id: 2,
    name: 'Tame Impala 2023 Wolrd tour',
    title: 'Tame Impala 2023 Wolrd tour',
    properties: [
      {
        key: 'a',
        label: 'Description of the input',
        value: 'Information that should be previewed here'
      },
      {
        key: 'b',
        label: 'Description of the input',
        value: 'Information that should be previewed here'
      },
      {
        key: 'b',
        label: 'Description of the input',
        value: 'Information that should be previewed here'
      },

    ],
  },
  {
    id: 3,
    name: 'Tame Impala 2023 Wolrd tour',
    title: 'Tame Impala 2023 Wolrd tour',
    properties: [],
  },
]



const InteractionREQUEST_DOCSTest = () => {
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

        <Section.Title customStyle={{alignSelf: 'center'}}>Incoming request - documents</Section.Title>
        {REQUEST_DOCS.map(c => (
          <View key={c.id}>
            <IncomingRequestDoc
              {...c}
            />
            
            <View style={{height: 20}} />
          </View>
        ))}
        <Section.Title customStyle={{alignSelf: 'center'}}>Incoming request - documents</Section.Title>
        {REQUEST_OTHER.map(c => (
          <View key={c.id}>
            <IncomingRequestOther
              {...c}
            />
            <View style={{height: 20}} />
          </View>
        ))}
      </ScrollView>
      
    </ScreenContainer>
  )
}

export default InteractionREQUEST_DOCSTest;