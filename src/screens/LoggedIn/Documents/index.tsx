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
import {
  DocumentTypes,
  DocumentFields,
  ClaimKeys,
  UICredential,
} from '~/types/credentials'
import { prepareLabel } from '~/utils/stringUtils'
import { IdentitySummary } from '@jolocom/sdk'

const formatClaims = (claims: IClaimSection) =>
  Object.keys(claims).map((key) => ({
    name: prepareLabel(key),
    value: claims[key],
  }))

const getSubjectName = (claim: IClaimSection) => {
  if (!!claim['givenName'] || !!claim['familyName']) {
    return {
      name: 'Subject name',
      value: `${claim['givenName']} ${claim['familyName']}`,
    }
  }

  return null
}

const filteredOptionalFields = [
  ClaimKeys.familyName,
  ClaimKeys.givenName,
  ClaimKeys.id,
  ClaimKeys.photo,
]

const getOptionalFields = (claim: IClaimSection) =>
  Object.keys(claim)
    .filter((k) => !filteredOptionalFields.includes(k as ClaimKeys))
    .map((key) => ({
      name: prepareLabel(key),
      value: claim[key],
    }))
    .slice(0, 3)

const getIssuerFields = (issuer: IdentitySummary) => {
  const fields = [{ name: 'Issuer Id', value: issuer.did }]
  const issuerProfile = issuer.publicProfile
  if (issuerProfile) {
    fields.push({ name: 'Issuer name', value: issuerProfile.name })
    fields.push({
      name: 'Issuer description',
      value: issuerProfile.description,
    })
    issuerProfile.url &&
      fields.push({ name: 'Issuer URL', value: issuerProfile.url })
  }

  return fields
}

const DocumentCards = memo<{ documents: UICredential[] }>(
  ({ documents }) => {
    return (
      <>
        {documents.map((document) => {
          return (
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
          )
        })}
      </>
    )
  },
  (prevProps, nextProps) =>
    JSON.stringify(prevProps.documents) === JSON.stringify(nextProps.documents),
)

const OtherCards: React.FC<{ other: UICredential[] }> = memo(
  ({ other }) => {
    return (
      <>
        {other.map((otherDoc) => (
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
        ))}
      </>
    )
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
