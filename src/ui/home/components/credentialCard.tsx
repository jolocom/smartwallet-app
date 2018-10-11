import React from 'react'
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native'
import { JolocomTheme } from 'src/styles/jolocom-theme'
import { DecoratedClaims } from 'src/reducers/account/'
import { MoreIcon, AccessibilityIcon, NameIcon, EmailIcon, PhoneIcon } from 'src/resources'
import { Block } from '../../structure'
import { prepareLabel } from 'src/lib/util'
import { ClaimCard, PlaceholderClaimCard } from 'src/ui/sso/components/claimCard'

interface Props {
  openClaimDetails: (claim: DecoratedClaims) => void
  credentialItem: DecoratedClaims
  empty: boolean
  collapsible: boolean
  shouldDisplayTitle: boolean
}

interface State {
  collapsed: boolean
}

export class CredentialCard extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      collapsed: this.props.collapsible
    }
  }

  private toggleCollapse = () => {
    if (this.props.collapsible) {
      this.setState({ collapsed: !this.state.collapsed })
    }
  }

  private renderMoreMenu() {
    const { openClaimDetails, credentialItem } = this.props

    return (
      <TouchableOpacity
        onPress={() => {
          openClaimDetails(credentialItem)
        }}
      >
        <MoreIcon />
      </TouchableOpacity>
    )
  }

  private getStyles = () =>
    StyleSheet.create({
      container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        backgroundColor: JolocomTheme.primaryColorWhite,
        paddingVertical: '5%',
        marginBottom: '1%'
      },
      title: {
        ...JolocomTheme.textStyles.light.labelDisplayFieldEdit,
        color: '#05050d',
        marginBottom: 16, opacity: 0.4,
        fontFamily: JolocomTheme.contentFontFamily
      }
    })

  private renderClaim = (credentialItem: DecoratedClaims) =>
    this.props.empty ? (
      <PlaceholderClaimCard
        onEdit={() => this.props.openClaimDetails(credentialItem)}
        credentialType={credentialItem.credentialType}
      />
    ) : (
      Object.keys(credentialItem.claimData).map((key, idx, arr) => (
        <ClaimCard
          key={key}
          primaryTextStyle={idx !== arr.length -1 ? {marginBottom: 16} : {}}
          primaryText={credentialItem.claimData[key]}
          secondaryText={prepareLabel(key)}
        />
      ))
    )

  private renderCollapsedClaim = (credentialItem: DecoratedClaims) => {
    const { claimData, credentialType } = credentialItem
    const collapsedMessage = Object.keys(claimData).reduce((acc, current) => `${acc}${claimData[current]} `, '')
    return <ClaimCard key={collapsedMessage} secondaryText={credentialType} primaryText={collapsedMessage} />
  }

  public render() {
    const { container, title } = this.getStyles()
    const { credentialItem, empty, shouldDisplayTitle } = this.props
    const { collapsed } = this.state

    return (
      <Block onTouch={this.toggleCollapse} style={container}>
        <Block flex={0.2}>{getIconByName(credentialItem.credentialType)}</Block>
        <View style={{ flex: 0.7, justifyContent: 'space-between', flexGrow: 1 }}>
          {shouldDisplayTitle && !collapsed ? (
            <Text style={title}> {credentialItem.credentialType} </Text>
          ) : null}
          {this.state.collapsed ? this.renderCollapsedClaim(credentialItem) : this.renderClaim(credentialItem)}
        </View>
        {empty ? null : <View style={{ flex: 0.1 }}>{this.renderMoreMenu()}</View>}
      </Block>
    )
  }
}

// TODO Util map func
const getIconByName = (name: string) => {
  const map = {
    Name: <NameIcon />,
    'E-mail': <EmailIcon />,
    'Mobile Phone': <PhoneIcon />
  }
  return map[name] || <AccessibilityIcon />
}
