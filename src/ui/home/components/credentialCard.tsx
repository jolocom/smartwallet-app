import React from 'react'
import { StyleSheet, View, TouchableOpacity, Text, TextStyle, GestureResponderEvent, ViewStyle } from 'react-native'
import { JolocomTheme } from 'src/styles/jolocom-theme'
import { prepareLabel } from 'src/lib/util'
import { ClaimCard, PlaceholderClaimCard } from 'src/ui/sso/components/claimCard'
import { ReactNode } from 'react-redux'

interface Props {
  handleInteraction?: (event: GestureResponderEvent) => void
  credentialItem: CredentialData
  collapsible?: boolean
  leftIcon: ReactNode
  rightIcon?: ReactNode
  rightIconStyle?: ViewStyle
  claimRightIcon?: ReactNode
  title?: string
  titleStyle?: TextStyle
  containerStyle?: ViewStyle
  claimCardStyle?: {
    primaryText?: TextStyle
    secondaryText?: TextStyle
  }
}

interface CredentialData {
  credentialType: string
  claimData: { [key: string]: string }
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
        flexBasis: 'auto',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        backgroundColor: JolocomTheme.primaryColorWhite,
        paddingVertical: '5%',
        marginBottom: '1%'
      },
      defaultTitleStyle: {
        ...JolocomTheme.textStyles.light.labelDisplayFieldEdit,
        color: '#05050d',
        marginBottom: 16,
        opacity: 0.4,
        fontFamily: JolocomTheme.contentFontFamily
      },
      defaultClaimSectionStyle: {
        flex: 0.7,
        justifyContent: 'space-between',
        flexGrow: 1
      },
      defaultRightIconStyle: {
        flex: 0.1
      },
      defaultLeftIconStyle: {
        paddingLeft: '5%',
        flex: 0.2
      }
    })

  private toggleCollapse = () => {
    if (this.props.collapsible) {
      this.setState({ collapsed: !this.state.collapsed })
    }
  }

  private renderIcon() {
    const { blank } = this.state
    const { handleInteraction, rightIcon, rightIconStyle } = this.props
    const { defaultRightIconStyle } = this.getStyles()

    if (blank) return null

    return (
      <View style={[defaultRightIconStyle, rightIconStyle]}>
        <TouchableOpacity onPress={handleInteraction}>{rightIcon || null}</TouchableOpacity>
      </View>
    )
  }

  private renderClaim = (credentialItem: CredentialData) => {
    const { blank } = this.state
    const { handleInteraction, claimCardStyle } = this.props
    const { credentialType, claimData } = credentialItem
    const onEdit = handleInteraction || (() => {})

    if (blank) {
      return <PlaceholderClaimCard onEdit={onEdit} credentialType={credentialType} />
    }

    return Object.keys(claimData).map((key, idx, arr) => {
      const lastElement = idx === arr.length - 1

      return (
        <ClaimCard
          key={key}
          rightIcon={this.props.claimRightIcon || null}
          primaryTextStyle={claimCardStyle ? claimCardStyle.primaryText : {}}
          secondaryTextStyle={claimCardStyle ? claimCardStyle.secondaryText : {}}
          primaryText={claimData[key]}
          secondaryText={prepareLabel(key)}
          containerStyle={lastElement ? { marginBottom: 0 } : {}}
        />
      )
    })
  }

  private renderCollapsedClaim = (credentialItem: CredentialData) => {
    const { claimData, credentialType } = credentialItem
    const collapsedMessage = Object.keys(claimData).reduce((acc, current) => `${acc}${claimData[current]}\n`, '')
    return <ClaimCard key={collapsedMessage} secondaryText={credentialType} primaryText={collapsedMessage} />
  }

  public render() {
    const { collapsible, credentialItem, title, titleStyle, containerStyle, leftIcon } = this.props
    const { collapsed } = this.state
    const {
      defaultContainerStyle,
      defaultTitleStyle,
      defaultClaimSectionStyle,
      defaultLeftIconStyle
    } = this.getStyles()

    const notCollapsed = collapsible && !collapsed

    return (
      <View style={[StyleSheet.flatten(defaultContainerStyle), containerStyle || {}]}>
        <View onTouchEnd={this.toggleCollapse} style={defaultLeftIconStyle}>
          {leftIcon}
        </View>
        <View onTouchEnd={this.toggleCollapse} style={defaultClaimSectionStyle}>
          {(notCollapsed || !collapsible) && title ? (
            <Text style={[defaultTitleStyle, titleStyle]}>{title}</Text>
          ) : null}
          {collapsed ? this.renderCollapsedClaim(credentialItem) : this.renderClaim(credentialItem)}
        </View>
        {this.renderIcon()}
      </View>
    )
  }
}
