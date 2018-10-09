import React from 'react'
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native'
import { JolocomTheme } from 'src/styles/jolocom-theme'
import { DecoratedClaims } from 'src/reducers/account/'
import { MoreIcon, AccessibilityIcon, NameIcon, EmailIcon, PhoneIcon } from 'src/resources'
import { Block } from '../../structure'
import { prepareLabel } from 'src/lib/util'
import { ClaimCard } from 'src/ui/sso/components/claimCard'

interface Props {
  openClaimDetails: (claim: DecoratedClaims) => void
  credentialItem: DecoratedClaims
  collapsible: boolean
  displayTitle: boolean
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
      attributeSelectionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        backgroundColor: JolocomTheme.primaryColorWhite,
        paddingVertical: '5%',
        marginBottom: '1%'
      },
      attributeTitle: {
        ...JolocomTheme.textStyles.light.labelDisplayFieldEdit,
        color: '#05050d',
        opacity: 0.4,
        fontFamily: JolocomTheme.contentFontFamily
      }
    })

  private renderClaim = (claim: { [key: string]: string }) => {
    return Object.keys(claim).map(key => (
      <ClaimCard key={key} primaryText={claim[key]} secondaryText={prepareLabel(key)} />
    ))
  }

  private renderCollapsedClaim = (claimData: any, title: string) => {
    const collapsedMessage = Object.keys(claimData).reduce((acc, current) => `${acc}${claimData[current]} `, '')
    return <ClaimCard key={collapsedMessage} secondaryText={title} primaryText={collapsedMessage} />
  }

  public render() {
    const { attributeSelectionContainer, attributeTitle } = this.getStyles()
    const { credentialItem } = this.props

    return (
      <Block onTouch={this.toggleCollapse} style={attributeSelectionContainer}>
        <Block flex={0.2}>{getIconByName(credentialItem.credentialType)}</Block>
        <View style={{ flex: 0.7, justifyContent: 'space-between' }}>
          {(this.props.displayTitle && !this.state.collapsed) ? <Text style={attributeTitle}> {credentialItem.credentialType} </Text> : null}
          {this.state.collapsed
            ? this.renderCollapsedClaim(credentialItem.claimData, credentialItem.credentialType)
            : this.renderClaim(credentialItem.claimData)}
        </View>
        <View style={{ flex: 0.1 }}>{this.renderMoreMenu()}</View>
      </Block>
    )
  }
}

// TODO Util map func
const getIconByName = (name: string) => {
  const map = {
    Name: <NameIcon />,
    Email: <EmailIcon />,
    'Mobile Phone': <PhoneIcon />
  }
  return map[name] || <AccessibilityIcon />
}
