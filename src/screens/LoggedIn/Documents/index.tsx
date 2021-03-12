import React, { memo, ReactNode } from 'react'
import { useSelector } from 'react-redux'
import { ScrollView, View } from 'react-native'

import ScreenContainer from '~/components/ScreenContainer'
import DocumentCard from '~/components/Card/DocumentCard'
import { useTabs } from '~/components/Tabs/context'
import { getCredentialsBySection } from '~/modules/credentials/selectors'
import DocumentTabs from '~/screens/LoggedIn/Documents/DocumentTabs'
import OtherCard from '~/components/Card/OtherCard'
import {
  DocumentTypes,
  DocumentFields,
  UICredential,
} from '~/types/credentials'
import ScreenPlaceholder from '~/components/ScreenPlaceholder'
import { strings } from '~/translations'
import {
  getSubjectName,
  getOptionalFields,
  formatClaims,
  getIssuerFields,
} from './utils'

const CardList: React.FC<{
  cards: UICredential[]
  renderCard: (card: UICredential) => ReactNode
}> = memo(
  ({ cards, renderCard }) => {
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
        {cards.map(renderCard)}
      </ScrollView>
    )
  },
  (prevProps, nextProps) =>
    JSON.stringify(prevProps.cards) === JSON.stringify(nextProps.cards),
)

const DocumentList = () => {
  const { documents, other } = useSelector(getCredentialsBySection)
  const { activeTab, activeSubtab } = useTabs()

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
          <CardList
            cards={documents}
            renderCard={(document) => (
              <DocumentCard
                key={document.id}
                id={document.id}
                mandatoryFields={[
                  {
                    name: DocumentFields.DocumentName,
                    value: document.metadata.name,
                  },
                  getSubjectName(document.claim),
                ]}
                optionalFields={[...getOptionalFields(document.claim)]}
                highlight={document.id.slice(0, 14)}
                image={document.claim['photo'] as string}
                claims={[
                  ...formatClaims(document.claim),
                  ...getIssuerFields(document.issuer),
                ]}
              />
            )}
          />
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
          <CardList
            cards={other}
            renderCard={(otherDoc) => (
              <OtherCard
                id={otherDoc.id}
                key={otherDoc.id}
                mandatoryFields={[
                  {
                    name: DocumentFields.DocumentName,
                    value: otherDoc.metadata.name,
                  },
                ]}
                optionalFields={[...getOptionalFields(otherDoc.claim)]}
                image={otherDoc.renderInfo?.logo?.url}
                claims={[
                  ...formatClaims(otherDoc.claim),
                  ...getIssuerFields(otherDoc.issuer),
                ]}
              />
            )}
          />
        )}
      </View>
    </>
  )
}

const Documents: React.FC = () => {
  return null
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
