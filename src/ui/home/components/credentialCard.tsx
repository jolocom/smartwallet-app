import React from 'react'
import { StyleSheet, View, TouchableOpacity, TextStyle, GestureResponderEvent, ViewStyle } from 'react-native'
import { JolocomTheme } from 'src/styles/jolocom-theme'
import { prepareLabel } from 'src/lib/util'
import { ClaimCard, PlaceholderClaimCard, CollapsedCredentialCard } from 'src/ui/sso/components/claimCard'
import { ReactNode } from 'react-redux'
import { ClaimEntry } from 'jolocom-lib/js/credentials/credential/types'

interface Props {
  handleInteraction?: (event: GestureResponderEvent) => void
  credentialItem: CredentialData
  collapsible?: boolean
  leftIcon: ReactNode
  rightIcon?: ReactNode
  containerStyle?: ViewStyle
  claimCardStyle?: {
    primaryText?: TextStyle
    secondaryText?: TextStyle
  }
}

interface CredentialData {
  credentialType: string
  claimData: ClaimEntry
}

interface State {
  collapsed: boolean
  blank: boolean
}

export class CredentialCard extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      collapsed: props.collapsible || false,
      blank: Object.keys(props.credentialItem.claimData).every(key => !props.credentialItem.claimData[key])
    }
  }

  private getStyles = () =>
    StyleSheet.create({
      defaultContainerStyle: {
        flexDirection: 'row',
        backgroundColor: JolocomTheme.primaryColorWhite,
        paddingVertical: '5%',
        marginBottom: '1%'
      }
    })

  private toggleCollapse = () => {
    if (this.props.collapsible) {
      this.setState({ collapsed: !this.state.collapsed })
    }
  }

  private renderIcon() {
    const { handleInteraction, rightIcon } = this.props
    return (
      <TouchableOpacity style={{ flex: 0.1 }} onPress={handleInteraction}>
        {rightIcon || null}
      </TouchableOpacity>
    )
  }

  private renderClaim = (credentialItem: CredentialData) => {
    const { handleInteraction } = this.props
    const { credentialType, claimData } = credentialItem
    const onEdit = handleInteraction || (() => {})

    if (this.state.blank) {
      return <PlaceholderClaimCard onEdit={onEdit} credentialType={credentialType} />
    }

    return Object.keys(claimData).map(key => (
      <ClaimCard key={key} primaryText={claimData[key]} secondaryText={prepareLabel(key)} />
    ))
  }

  private renderCollapsedClaim = (credentialItem: CredentialData) => (
    <CollapsedCredentialCard
      title={credentialItem.credentialType}
      values={Object.keys(credentialItem.claimData).map(k => credentialItem.claimData[k])}
    />
  )

  public render() {
    const { credentialItem, containerStyle, leftIcon } = this.props
    const { collapsed } = this.state
    const { defaultContainerStyle } = this.getStyles()

    return (
      <View style={[StyleSheet.flatten(defaultContainerStyle), containerStyle || {}]}>
        <View flex={0.2} alignItems={'center'}>
          {leftIcon}
        </View>
        <View onTouchEnd={this.toggleCollapse} flex={0.7}>
          {collapsed ? this.renderCollapsedClaim(credentialItem) : this.renderClaim(credentialItem)}
        </View>
        {this.renderIcon()}
      </View>
    )
  }
}
