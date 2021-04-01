import React, { useLayoutEffect } from 'react'
import { useSelector } from 'react-redux'
import { ScrollView, View } from 'react-native'
import { useRoute, RouteProp } from '@react-navigation/native'

import ScreenContainer from '~/components/ScreenContainer'
import DocumentCard from '~/components/Card/DocumentCard'
import { useTabs } from '~/components/Tabs/context'
import { getCustomCredentialsByCategories } from '~/modules/credentials/selectors'
import DocumentTabs, {
  documentTabs,
} from '~/screens/LoggedIn/Documents/DocumentTabs'
import OtherCard from '~/components/Card/OtherCard'
import {
  DocumentTypes,
  DocumentFields,
  DisplayCredentialDocument,
  DisplayCredentialOther,
} from '~/types/credentials'
import ScreenPlaceholder from '~/components/ScreenPlaceholder'
import { strings } from '~/translations'
import { getOptionalFields } from './utils'
import { CredentialRenderTypes } from 'jolocom-lib/js/interactionTokens/types'
import { MainTabsParamList } from '../MainTabs'
import { ScreenNames } from '~/types/screens'

const CardList: React.FC = ({ children }) => {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      overScrollMode={'never'}
      contentContainerStyle={{
        paddingBottom: '40%',
        paddingHorizontal: 8,
        paddingTop: 32,
      }}
    >
      {children}
    </ScrollView>
  )
}

const DocumentList: React.FC = () => {
  const route = useRoute<RouteProp<MainTabsParamList, ScreenNames.Documents>>()
  const initialTabId = route.params.initialTab ?? DocumentTypes.document

  const categories = useSelector(getCustomCredentialsByCategories)
  const { activeTab, setActiveTab } = useTabs()

  useLayoutEffect(() => {
    setActiveTab(documentTabs.find((t) => t.id === initialTabId)!)
  }, [initialTabId])

  const documents = categories[
    CredentialRenderTypes.document
  ] as DisplayCredentialDocument[]
  const other = categories[DocumentTypes.other] as DisplayCredentialOther[]

  return (
    <>
      <View
        style={{
          display: activeTab?.id === DocumentTypes.document ? 'flex' : 'none',
          flex: 1,
        }}
        testID="document-cards-container"
      >
        {!documents.length ? (
          <ScreenPlaceholder
            title={strings.ITS_STILL_EMPTY}
            description={strings.YOU_HAVENT_SAVED_ANY_DOCUMENTS_YET}
          />
        ) : (
          <CardList>
            {documents.map((d) => (
              <DocumentCard
                key={d.id}
                id={d.id}
                mandatoryFields={[
                  {
                    label: DocumentFields.DocumentName,
                    value: d.name ?? d.type[1],
                  },
                  {
                    label: strings.SUBJECT_NAME,
                    value: d.holderName,
                  },
                ]}
                optionalFields={getOptionalFields(d)}
                highlight={d.id.slice(0, 14)}
                photo={d.photo}
              />
            ))}
          </CardList>
        )}
      </View>
      <View
        style={{
          display: activeTab?.id === DocumentTypes.document ? 'none' : 'flex',
          flex: 1,
        }}
        testID="other-cards-container"
      >
        {!other.length ? (
          <ScreenPlaceholder
            title={strings.NOTHING_HERE_YET}
            description={strings.YOU_HAVENT_SAVED_ANYTHING_YET}
          />
        ) : (
          <CardList>
            {other.map((o) => (
              <OtherCard
                id={o.id}
                key={o.id}
                mandatoryFields={[
                  {
                    label: DocumentFields.DocumentName,
                    value: o.name ?? o.type,
                  },
                ]}
                optionalFields={getOptionalFields(o)}
                photo={o.photo}
              />
            ))}
          </CardList>
        )}
      </View>
    </>
  )
}

const Documents: React.FC = () => {
  return (
    <ScreenContainer
      customStyles={{
        justifyContent: 'flex-start',
      }}
    >
      <DocumentTabs>
        <DocumentList />
      </DocumentTabs>
    </ScreenContainer>
  )
}

export default Documents
