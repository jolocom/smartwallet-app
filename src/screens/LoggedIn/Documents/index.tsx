import React from 'react'
import { useSelector } from 'react-redux'
import { ScrollView, View } from 'react-native'

import ScreenContainer from '~/components/ScreenContainer'
import DocumentCard from '~/components/Card/DocumentCard'
import { useTabs } from '~/components/Tabs/context'
import { getCredentialsByCategories } from '~/modules/credentials/selectors'
import DocumentTabs from '~/screens/LoggedIn/Documents/DocumentTabs'
import OtherCard from '~/components/Card/OtherCard'
import {
  DocumentTypes,
  DocumentFields,
  OtherCategory,
  DisplayCredentialDocument,
  DisplayCredentialOther,
} from '~/types/credentials'
import ScreenPlaceholder from '~/components/ScreenPlaceholder'
import { strings } from '~/translations'
import { getOptionalFields, formatClaims } from './utils'
import { CredentialRenderTypes } from 'jolocom-lib/js/interactionTokens/types'
import { mapDisplayToCustomDisplay } from '~/hooks/signedCredentials/utils'

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

const DocumentList = () => {
  const categories = useSelector(getCredentialsByCategories)
  const { activeTab } = useTabs()

  const documents = categories[CredentialRenderTypes.document]
  const other = categories[OtherCategory.other]

  const displayDocuments = documents.map(
    mapDisplayToCustomDisplay,
  ) as DisplayCredentialDocument[]
  const displayOther = other.map(
    mapDisplayToCustomDisplay,
  ) as DisplayCredentialOther[]

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
            {displayDocuments.map((document) => (
              <DocumentCard
                key={document.id}
                id={document.id}
                mandatoryFields={[
                  {
                    label: DocumentFields.DocumentName,
                    value: document.name ?? document.type,
                  },
                  {
                    label: 'Subject name',
                    value: document.holderName,
                  },
                ]}
                // @ts-expect-error
                optionalFields={getOptionalFields(document.properties)}
                highlight={document.id.slice(0, 14)}
                // @ts-expect-error
                claims={[
                  ...formatClaims(document.properties),
                  // TODO: fetch issuer information earlier
                  // ...getIssuerFields(document.issuer),
                ]}
                photo={document.photo}
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
            {displayOther.map((other) => (
              <OtherCard
                id={other.id}
                key={other.id}
                mandatoryFields={[
                  {
                    label: DocumentFields.DocumentName,
                    value: other.name ?? other.type,
                  },
                ]}
                // @ts-expect-error
                optionalFields={[...getOptionalFields(other.properties)]}
                photo={other.photo}
                // @ts-expect-error
                claims={[
                  ...formatClaims(other.properties),
                  // TODO: fetch issuer information earlier
                  // ...getIssuerFields(other.issuer),
                ]}
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
