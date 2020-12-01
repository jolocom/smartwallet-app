import React, { memo } from 'react'
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
import { UICredential } from '~/types/credentials'

const formatClaims = (claims: IClaimSection) =>
  Object.keys(claims).map((key) => ({
    name: capitalizeWord(key),
    value: claims[key],
  }))

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

const DocumentCards: React.FC<{ documents: UICredential[] }> = memo(
  ({ documents }) => {
    return documents.map((document) => (
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
        claims={formatClaims(document.claim)}
      />
    ))
  },
  (prevProps, nextProps) =>
    JSON.stringify(prevProps.documents) === JSON.stringify(nextProps.documents),
)

const OtherCards: React.FC<{ other: UICredential[] }> = memo(
  ({ other }) => {
    return other.map((otherDoc) => (
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
        claims={formatClaims(otherDoc.claim)}
      />
    ))
  },
  (prevProps, nextProps) =>
    JSON.stringify(prevProps.other) === JSON.stringify(nextProps.other),
)

const DocumentList = () => {
  const { documents, other } = useSelector(getCredentialsBySection)
  const { activeTab, activeSubtab } = useTabs()

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View
        style={{
          display: activeTab?.id === DocumentTypes.document ? 'flex' : 'none',
        }}
        testID="document-cards-container"
      >
        <DocumentCards documents={documents} />
      </View>
      <View
        style={{
          display: activeTab?.id === DocumentTypes.document ? 'none' : 'flex',
        }}
        testID="other-cards-container"
      >
        <OtherCards other={other} />
      </View>
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
