import React from 'react'
import { StyleSheet, ScrollView, View } from 'react-native'
import { DecoratedClaims } from 'src/reducers/account'
import { DocumentCard } from '../../documents/components/documentCard'
import { IdentitySummary } from '../../../actions/sso/types'
import { Colors, Spacing } from 'src/styles'
import { DocumentDetailsComponent } from 'src/ui/documents/components/documentDetails'

interface Props {
  credentialToRender: DecoratedClaims
  requester: IdentitySummary
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightGreyLighter,
  },
  topSection: {
    paddingVertical: Spacing.MD,
    alignItems: 'center',
  },
})

export const CredentialDialogComponent: React.FC<Props> = (
  props: Props,
): JSX.Element => {
  const { credentialToRender } = props

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <DocumentCard document={credentialToRender} />
      </View>

      <ScrollView>
        <DocumentDetailsComponent document={credentialToRender} />
      </ScrollView>
    </View>
  )
}
