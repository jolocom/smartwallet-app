import React from 'react'
import { useSelector } from 'react-redux'
import { ScrollView, View } from 'react-native'

import ScreenContainer from '~/components/ScreenContainer'
import DocumentCard from '~/components/Card/DocumentCard'
import { useTabs } from '~/components/Tabs/Tabs'
import { getAllCredentials } from '~/modules/credentials/selectors'
import DocumentTabs from '~/screens/LoggedIn/Documents/DocumentTabs'
import { DocumentFields, DocumentTypes } from '~/components/Card/Card'
import OtherCard from '~/components/Card/OtherCard'

const DOCUMENTS = [
  {
    id: 1,
    type: DocumentTypes.document,
    details: {
      mandatoryFields: [
        {
          name: DocumentFields.DocumentName,
          value: 'Nederlandse identitekaart',
        },
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
    type: DocumentTypes.document,
    details: {
      mandatoryFields: [
        {
          name: DocumentFields.DocumentName,
          value:
            'Nederlandse identitekaart Nederlandse identitekaart Nederlandse identitekaart',
        },
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
    type: DocumentTypes.document,
    details: {
      mandatoryFields: [
        {
          name: DocumentFields.DocumentName,
          value: 'Nederlandse identitekaart',
        },
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

const OTHER = [
  {
    id: 4,
    type: DocumentTypes.other,
    details: {
      mandatoryFields: [
        { name: DocumentFields.DocumentName, value: 'Name of the event' },
      ],
      preferredFields: [
        {
          name: 'Extra long description of the input',
          value: 'Information that should be previewed here',
        },
        {
          name:
            'Some more info that can fit in here and if it is not going over two lines agreed previou',
          value: 'Information that should be',
        },
        {
          name: 'Extra long description of the input',
          value: 'Information',
        },
      ],
      logo:
        'https://i.pinimg.com/564x/db/3f/9b/db3f9bce5262323d79cc020950db08bc.jpg',
    },
  },
  {
    id: 5,
    type: DocumentTypes.other,
    details: {
      mandatoryFields: [{ name: DocumentFields.DocumentName, value: 'Name' }],
      preferredFields: [
        {
          name: 'Title',
          value: 'Info',
        },
        {
          name: 'Title',
          value: 'Information that should bу probably previewed here or not',
        },
      ],
    },
  },
  {
    id: 6,
    type: DocumentTypes.other,
    details: {
      mandatoryFields: [
        {
          name: DocumentFields.DocumentName,
          value:
            'Systemischer Agile Coach - Infos zu unserer Weiterbildung Systemischer Agile Coach - Infos zu unserer Weiterbildung',
        },
      ],
      preferredFields: [
        {
          name: 'Extra long description of the input',
          value: 'Information that should be previewed here',
        },
        {
          name: 'Extra long description of the input',
          value: 'Information that should be previewed here',
        },
        {
          name: 'Extra long description of the input',
          value: 'Information that should be previewed here',
        },
      ],
      logo:
        'https://i.pinimg.com/564x/db/3f/9b/db3f9bce5262323d79cc020950db08bc.jpg',
    },
  },
]

const DocumentList = () => {
  const credentials = useSelector(getAllCredentials)
  const { activeTab, activeSubtab } = useTabs()

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      {activeTab?.id === DocumentTypes.document &&
        DOCUMENTS.map((document) => (
          <DocumentCard
            key={document.id}
            mandatoryFields={document.details.mandatoryFields}
            preferredFields={document.details.preferredFields}
            highlight={document.details.highlight}
            image={document.details.photo}
          />
        ))}
      {activeTab?.id === DocumentTypes.other &&
        OTHER.map((otherDoc) => (
          <OtherCard
            key={otherDoc.id}
            mandatoryFields={otherDoc.details.mandatoryFields}
            preferredFields={otherDoc.details.preferredFields}
            image={otherDoc.details.logo}
          />
        ))}
      <View style={{ height: 100 }} />
    </ScrollView>
  )
}

const Documents: React.FC = () => {
  return (
    <ScreenContainer customStyles={{ justifyContent: 'flex-start' }}>
      <DocumentTabs>
        <DocumentList />
      </DocumentTabs>
    </ScreenContainer>
  )
}

export default Documents
