import React from 'react'
import { useSelector } from 'react-redux'

import ScreenContainer from '~/components/ScreenContainer'
import { getAllCredentials } from '~/modules/credentials/selectors'
import DocumentCard from '~/components/Card/DocumentCard'
import { ScrollView, View } from 'react-native'

const DOCUMENTS = [
  {
    id: 1,
    details: {
      mandatoryFields: [
        {
          name: 'Document Type',
          value: 'Nederlandse identitekaart',
        },
        { name: 'Document Name', value: 'Nederlandse identitekaart' },
        {
          name: 'Given Name',
          value: 'De Bruijn Willeke Liselotte',
        },
      ],
      preferredFields: [
        { name: 'Date of birth', value: Date.now() },
        {
          name: 'Nationality',
          value: 'Dutch',
        },
        { name: 'Date of expiry', value: Date.now() },
      ],
      highlight: 'SPECI2014',
      photo:
        'https://i.pinimg.com/564x/64/4d/dc/644ddca56c43e4b01af5aec27e010feb.jpg',
    },
  },
  {
    id: 2,
    details: {
      mandatoryFields: [
        {
          name: 'Document Type',
          value: 'Nederlandse identitekaart Nederlandse identitekaart',
        },
        { name: 'Document Name', value: 'Nederlandse identitekaart' },
        {
          name: 'Given Name',
          value:
            'Adolph Blaine Charles David Earl Frederick Gerald Hubert Irvin Gerald Hubert Irvin',
        },
      ],
      preferredFields: [
        {
          name: 'Extra long description of the input',
          value:
            'Information that should be previewed here Information that should be previewed here',
        },
        {
          name:
            'Some more info that can fit in here and if it is not going over two lines agreed previou',
          value:
            'Some more info that can fit in here and if it is not going over two lines agreed previou over two lines agreed previou',
        },
        {
          name: 'Extra long description of the input',
          value:
            'Information that should be previewed here Information that should be previewed here',
        },
      ],
      highlight: 'SPECI2014',
      photo:
        'https://i.pinimg.com/564x/64/4d/dc/644ddca56c43e4b01af5aec27e010feb.jpg',
    },
  },
  {
    id: 3,
    details: {
      mandatoryFields: [
        {
          name: 'Document Type',
          value: 'Nederlandse identitekaart',
        },
        { name: 'Document Name', value: 'Nederlandse identitekaart' },
        {
          name: 'Given Name',
          value: 'De Bruijn Willeke Liselotte',
        },
      ],
      preferredFields: [
        {
          name: 'Extra long description of the input',
          value:
            'Information that should be previewed here Information that should be previewed here',
        },
        {
          name:
            'Some more info that can fit in here and if it is not going over two lines agreed previou',
          value:
            'Some more info that can fit in here and if it is not going over two lines agreed previou over two lines agreed previou',
        },
        {
          name: 'Extra long description of the input',
          value:
            'Information that should be previewed here Information that should be previewed here',
        },
      ],
    },
  },
]

const Documents: React.FC = () => {
  const credentials = useSelector(getAllCredentials)

  return (
    <ScreenContainer>
      <ScrollView showsVerticalScrollIndicator={false}>
        {DOCUMENTS.map((document) => (
          <DocumentCard
            key={document.id}
            mandatoryFields={document.details.mandatoryFields}
            preferredFields={document.details.preferredFields}
            highlight={document.details.highlight}
            image={document.details.photo}
          />
        ))}
        <View style={{ height: 100 }} />
      </ScrollView>
    </ScreenContainer>
  )
}

export default Documents
