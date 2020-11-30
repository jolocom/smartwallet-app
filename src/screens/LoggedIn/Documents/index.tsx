import React from 'react'
import { useSelector } from 'react-redux'
import { ScrollView, View } from 'react-native'
import { IClaimSection } from 'jolocom-lib/js/credentials/credential/types'

import ScreenContainer from '~/components/ScreenContainer'
import DocumentCard from '~/components/Card/DocumentCard'
import { useTabs } from '~/components/Tabs/Tabs'
import { getCredentialsBySection } from '~/modules/credentials/selectors'
import DocumentTabs from '~/screens/LoggedIn/Documents/DocumentTabs'
import OtherCard from '~/components/Card/OtherCard'
import { DocumentTypes, DocumentFields } from '~/components/Card/types'
import { capitalizeWord } from '~/utils/stringUtils'

const DocumentList = () => {
  const { documents, other } = useSelector(getCredentialsBySection)
  const { activeTab, activeSubtab } = useTabs()

  const getDocumentName = (claim: IClaimSection) => {
    if (!!claim['givenName'] && !!claim['familyName']) {
      return {
        name: 'Subject name',
        value: `${claim['givenName']} ${claim['familyName']}`,
      }
    }

    return null
  }

  const getOptionalFields = (claim: IClaimSection) =>
    Object.keys(claim)
      .filter((k) => k !== 'id' && k !== 'familyName' && k !== 'givenName')
      .map((key) => ({
        name: capitalizeWord(key),
        value: claim[key],
      }))
      .slice(0, 6)

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      {activeTab?.id === DocumentTypes.document &&
        documents.map((document) => (
          <DocumentCard
            key={document.id}
            id={document.id}
            mandatoryFields={[
              {
                name: DocumentFields.DocumentName,
                value: document.metadata.name,
              },
              getDocumentName(document.claim),
            ]}
            optionalFields={getOptionalFields(document.claim)}
            highlight={document.id.slice(0, 14)}
            image={document.renderInfo?.logo?.url}
          />
        ))}
      {activeTab?.id === DocumentTypes.other &&
        other.map((otherDoc) => (
          <OtherCard
            id={otherDoc.id}
            key={otherDoc.id}
            mandatoryFields={[
              {
                name: DocumentFields.DocumentName,
                value: otherDoc.metadata.name,
              },
            ]}
            optionalFields={getOptionalFields(otherDoc.claim)}
            image={otherDoc.renderInfo?.logo?.url}
          />
        ))}
      <View style={{ height: 100 }} />
    </ScrollView>
  )
}

const Documents: React.FC = () => {
  return (
    <ScreenContainer
      customStyles={{
        paddingHorizontal: 28,
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
