import React from 'react'
import { StyleSheet, ScrollView } from 'react-native'
import { Wrapper } from 'src/ui/structure'
import { CategorizedClaims } from 'src/reducers/account'
import { DecoratedClaims } from 'src/reducers/account/'
import { getNonDocumentClaims } from 'src/utils/filterDocuments'
import { Typography, Colors, Spacing } from 'src/styles'
import { CredentialCategory } from './credentialCategory'

interface Props {
  claimsToRender: CategorizedClaims
  onEdit: (claim: DecoratedClaims) => void
  did: string
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.lightGreyLighter,
  },
  sectionHeader: {
    ...Typography.sectionHeader,
    marginTop: Spacing.XL,
    marginBottom: Spacing.SM,
    paddingLeft: Spacing.MD,
  },
  scrollComponent: {
    width: '100%',
  },
  scrollComponentContainer: {
    paddingBottom: Spacing['3XL'],
  },
})

export const CredentialOverview: React.FC<Props> = props => {
  const { claimsToRender, did, onEdit } = props

  const claimCategories = Object.keys(claimsToRender)

  return (
    <Wrapper style={styles.container}>
      <ScrollView
        style={styles.scrollComponent}
        contentContainerStyle={styles.scrollComponentContainer}
      >
        {claimCategories.map(category => {
          // we render documents on their own screen
          const nonDocumentClaims = getNonDocumentClaims(
            claimsToRender[category],
          )
          return nonDocumentClaims.length > 0 ? (
            <CredentialCategory
              category={category}
              credentials={nonDocumentClaims}
              did={did}
              onEdit={onEdit}
            />
          ) : null
        })}
      </ScrollView>
    </Wrapper>
  )
}
