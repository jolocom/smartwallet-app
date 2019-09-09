import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { CardWrapper } from 'src/ui/structure'
import { Spacing, Typography } from 'src/styles'
import { DecoratedClaims } from 'src/reducers/account'
import I18n from 'src/locales/i18n'
import MoreIcon from 'src/resources/svg/MoreIcon'
import { CredentialCard } from './credentialCard'
import { credentialStyles } from './sharedConstants'

interface Props {
  onPress?: () => void
  did: string
  credential: DecoratedClaims
  leftIcon: React.ReactNode
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
    const { did, credential, onPress, leftIcon } = this.props

    const CredentialCardToRender = collapsed
      ? CollapsedCredentialCard
      : CredentialCard

    return (
      <View onTouchEnd={this.handleTouch}>
        <CredentialCardToRender
          did={did}
          credential={credential}
          onPress={onPress}
          leftIcon={leftIcon}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  card: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  claimText: {
    ...Typography.cardMainText,
    marginBottom: Spacing.XXS,
  },
})

const CollapsedCredentialCard: React.FC<Props> = props => {
  const {
    credential,
    credential: { claimData, issuer },
    did,
    onPress,
    leftIcon,
  } = props
  const selfSigned = issuer.did === did

  return (
    <CardWrapper style={styles.card}>
      {leftIcon && leftIcon}
      <View style={credentialStyles.claimsArea}>
        <Text style={Typography.cardSecondaryText}>
          {I18n.t(credential.credentialType)}
        </Text>
        {Object.keys(claimData).map(key => (
          <Text style={styles.claimText} key={key}>
            {I18n.t(claimData[key])}
          </Text>
        ))}
      </View>
      {selfSigned && (
        <View style={credentialStyles.rightIconArea} onTouchEnd={onPress}>
          <MoreIcon />
        </View>
      )}
    </CardWrapper>
  )
}
