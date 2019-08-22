import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { CardWrapper } from 'src/ui/structure'
import { Spacing, Typography } from 'src/styles'
import { getCredentialIconByType } from 'src/resources/util'
import { DecoratedClaims } from 'src/reducers/account'
import I18n from 'src/locales/i18n'
import MoreIcon from 'src/resources/svg/MoreIcon'
import { CredentialCard } from './credentialCard'

interface Props {
  onPress?: () => void
  did: string
  credential: DecoratedClaims
}

interface State {
  collapsed: boolean
}

export class CollapsibleCredentialCard extends React.Component<Props, State> {
  public constructor(props: Props) {
    super(props)

    this.state = {
      collapsed: true,
    }
  }

  private handleTouch = () => {
    this.setState(prevState => ({ collapsed: !prevState.collapsed }))
  }

  public render() {
    const { collapsed } = this.state
    const { did, credential, onPress } = this.props

    return (
      <View onTouchEnd={this.handleTouch}>
        {collapsed ? (
          <CollapsedCredentialCard
            did={did}
            credential={credential}
            onPress={onPress}
          />
        ) : (
          <CredentialCard did={did} credential={credential} onPress={onPress} />
        )}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  card: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  leftIconSection: {
    paddingHorizontal: Spacing.XS,
  },
  claimsArea: {
    flex: 1,
    marginLeft: Spacing.LG,
  },
  rightIconArea: {},
})

const CollapsedCredentialCard: React.FC<Props> = props => {
  const {
    credential,
    credential: { credentialType, claimData, issuer },
    did,
    onPress,
  } = props
  const selfSigned = issuer.did === did

  return (
    <CardWrapper style={styles.card}>
      <View style={styles.leftIconSection}>
        {getCredentialIconByType(credentialType)}
      </View>

      <View style={styles.claimsArea}>
        <Text style={Typography.cardSecondaryText}>
          {I18n.t(credential.credentialType)}
        </Text>
        {Object.keys(claimData).map(key => (
          <Text
            style={{
              ...Typography.cardMainText,
              marginBottom: Spacing.XXS,
            }}
            key={key}
          >
            {I18n.t(claimData[key])}
          </Text>
        ))}
      </View>
      {selfSigned && (
        <View style={styles.rightIconArea} onTouchEnd={onPress}>
          <MoreIcon />
        </View>
      )}
    </CardWrapper>
  )
}
