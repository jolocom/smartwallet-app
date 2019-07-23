import React from 'react'
import { StyleSheet, Text, ScrollView } from 'react-native'
import { Container } from 'src/ui/structure'
import { CredentialCard } from './credentialCard'
import { JolocomTheme } from 'src/styles/jolocom-theme'
import { ReactNode } from 'react'
import { CategorizedClaims } from 'src/reducers/account'
import { DecoratedClaims } from 'src/reducers/account/'
import { CredentialTypes } from 'src/lib/categories'
import { MoreIcon } from 'src/resources'
import { getCredentialIconByType } from 'src/resources/util'
import { prepareLabel } from 'src/lib/util'
import I18n from 'src/locales/i18n'
import { getNonDocumentClaims } from 'src/utils/filterDocuments'
import { SCROLL_PADDING_BOTTOM } from 'src/ui/generic'

interface Props {
  claimsToRender: CategorizedClaims
  onEdit: (claim: DecoratedClaims) => void
  did: string
}

interface State {}

const styles = StyleSheet.create({
  sectionHeader: {
    marginTop: 30,
    marginBottom: 10,
    paddingLeft: 16,
    fontSize: 17,
    fontFamily: JolocomTheme.contentFontFamily,
    color: 'rgba(0, 0, 0, 0.38)',
  },
  scrollComponent: {
    width: '100%',
    paddingBottom: SCROLL_PADDING_BOTTOM,
  },
})

export class CredentialOverview extends React.Component<Props, State> {
  private renderCredentialCard = (category: string): ReactNode => {
    const { onEdit, did, claimsToRender } = this.props

    let categorizedCredentials = (claimsToRender[category] || []).sort((a, b) =>
      a.credentialType > b.credentialType ? 1 : -1,
    )

    if (category === 'Other') {
      categorizedCredentials = getNonDocumentClaims(categorizedCredentials)
    }

    return categorizedCredentials.map((claim: DecoratedClaims, index) => {
      const { claimData, issuer, credentialType } = claim

      const capitalized = Object.keys(claimData).reduce((acc, curr) => {
        acc[prepareLabel(curr)] = claimData[curr]
        return acc
      }, {})

      const selfSigned = issuer.did === did
      return (
        <CredentialCard
          key={credentialType}
          handleInteraction={() => onEdit(claim)}
          credentialItem={{ ...claim, claimData: capitalized }}
          collapsible={collapsible(claim)}
          rightIcon={selfSigned ? <MoreIcon /> : null}
          leftIcon={getCredentialIconByType(credentialType)}
          containerStyle={index === 0 ? { borderTopWidth: 1 } : undefined}
        />
      )
    })
  }

  private renderCredentialCategory = (category: string) => {
    if (!getNonDocumentClaims(this.props.claimsToRender[category]).length) {
      return null
    }

    return [
      <Text style={styles.sectionHeader}>{I18n.t(category.toString())}</Text>,
      this.renderCredentialCard(category),
    ]
  }

  public render(): JSX.Element {
    const { claimsToRender } = this.props
    const { scrollComponent } = styles

    const claimCategories = Object.keys(claimsToRender)

    return (
      <Container style={{ padding: 0 }}>
        <ScrollView
          style={scrollComponent}
          contentContainerStyle={scrollComponent}
        >
          {claimCategories.map(this.renderCredentialCategory)}
        </ScrollView>
      </Container>
    )
  }
}

const collapsible = (claim: DecoratedClaims): boolean => {
  const { credentialType, claimData } = claim

  const isDefaultCredentialType = CredentialTypes[credentialType]

  if (isDefaultCredentialType) {
    return false
  }

  return Object.keys(claimData).filter(key => !!claimData[key]).length > 1
}
