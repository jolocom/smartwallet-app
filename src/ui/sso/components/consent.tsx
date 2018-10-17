import React from 'react'
import { Text, StyleSheet, ScrollView, ViewStyle, TextStyle, View } from 'react-native'
import { Container, Block } from 'src/ui/structure'
import { JolocomTheme } from 'src/styles/jolocom-theme'
import { StateTypeSummary, StateVerificationSummary } from 'src/reducers/sso'
import { CredentialCard } from 'src/ui/home/components/credentialCard'
import { Button, IconToggle } from 'react-native-material-ui'
import { getCredentialIconByType } from 'src/resources/util'
import { RenderButtonSection } from 'src/ui/structure/buttonSectionBottom'

interface Props {
  did: string
  requester: string
  callbackURL: string
  availableCredentials: StateTypeSummary[]
  handleSubmitClaims: (credentials: StateVerificationSummary[]) => void
  handleDenySubmit: () => void
}

interface State {
  pending: boolean
  selectedCredentials: {
    [type: string]: StateVerificationSummary
  }
}

const styles = {
  serviceTitle: {
    fontFamily: JolocomTheme.contentFontFamily,
    fontSize: JolocomTheme.headerFontSize,
    color: JolocomTheme.primaryColorBlack,
    fontWeight: '100'
  } as TextStyle,
  serviceMetadata: {
    ...JolocomTheme.textStyles.light.labelDisplayField,
    fontFamily: JolocomTheme.contentFontFamily
  },
  buttonBlock: {
    justifyContent: 'space-around',
    flexDirection: 'row',
    backgroundColor: JolocomTheme.primaryColorWhite
  } as ViewStyle,
  denyShareText: {
    fontFamily: JolocomTheme.contentFontFamily,
    fontSize: JolocomTheme.labelFontSize,
    color: JolocomTheme.primaryColorPurple,
    fontWeight: '100'
  } as TextStyle,
  shareClaimsContainer: {
    backgroundColor: JolocomTheme.primaryColorPurple
  } as ViewStyle,
  shareClaimsText: {
    fontFamily: JolocomTheme.contentFontFamily,
    fontSize: JolocomTheme.labelFontSize,
    color: JolocomTheme.primaryColorSand,
    fontWeight: '100'
  } as TextStyle,
  disabledShareClaimsContainer: {
    backgroundColor: JolocomTheme.disabledButtonBackgroundGrey
  } as ViewStyle,
  disabledShareClaimsText: {
    fontFamily: JolocomTheme.contentFontFamily,
    fontSize: JolocomTheme.labelFontSize,
    color: JolocomTheme.disabledButtonTextGrey,
    fontWeight: '100'
  } as TextStyle,
  fixedText: {
    fontFamily: JolocomTheme.contentFontFamily,
    fontSize: JolocomTheme.labelFontSize,
    color: JolocomTheme.primaryColorBlack,
    padding: '5%'
  },
  claimCardText: {
    primaryText: {
      fontSize: 17,
      opacity: 0.4
    },
    secondaryText: {
      fontSize: JolocomTheme.headerFontSize,
      opacity: 1
    }
  }
}

export class ConsentComponent extends React.Component<Props, State> {
  state: State = {
    pending: false,
    selectedCredentials: this.props.availableCredentials.reduce((acc, curr) => ({ ...acc, [curr.type]: undefined }), {})
  }

  private handleAttributeSelect(type: string, selectedCredential: StateVerificationSummary) {
    this.setState({ selectedCredentials: { ...this.state.selectedCredentials, [type]: selectedCredential } })
  }

  private handleSubmitClaims = () => {
    const { selectedCredentials } = this.state
    const credentials = Object.keys(selectedCredentials).map(key => selectedCredentials[key])
    this.setState({ pending: true })
    this.props.handleSubmitClaims(credentials)
  }

  private renderButtons() {
    const { selectedCredentials } = this.state

    const submitAllowed = Object.keys(selectedCredentials).every(key => selectedCredentials[key] !== undefined)
    const buttonDisabled = !submitAllowed || this.state.pending

    return (
      <RenderButtonSection
        disabled={buttonDisabled}
        confirmText={'Share claims'}
        denyText={'Deny'}
        handleConfirm={() => this.handleSubmitClaims()}
        handleDeny={() => this.props.handleDenySubmit()}
      />
    )
  }

  private renderFirstSection() {
    return (
      <Block flex={0.4}>
        <Block flex={0.1}>{null}</Block>

        <Block flex={0.4} style={{ backgroundColor: 'white' }}>
          <Text style={styles.serviceTitle}> {this.props.requester.substring(0, 25)} </Text>
          <Text style={styles.serviceMetadata}> {this.props.callbackURL.substring(0, 25)} </Text>
        </Block>

        <Block flex={0.5}>
          <Text style={styles.fixedText}>This service is asking you to share the following claims:</Text>
        </Block>
      </Block>
    )
  }

  private renderRightIcon(selected: boolean, entry: StateTypeSummary) {
    const checkboxColor = selected ? JolocomTheme.primaryColorPurple : JolocomTheme.disabledButtonBackgroundGrey
    const { type, verifications } = entry

    return (
      <View style={{ justifyContent: 'center' }}>
        <IconToggle
          name={selected ? 'check-circle' : 'fiber-manual-record'}
          onPress={() => this.handleAttributeSelect(type, verifications[0])}
          color={checkboxColor}
        />
      </View>
    )
  }

  private renderLeftIcon(type: string) {
    return getCredentialIconByType(type)
  }

  private renderSelectionSections(sections: StateTypeSummary[]) {
    const groupedByType = sections.reduce<{ [key: string]: StateTypeSummary[] }>(
      (acc, current) =>
        acc[current.type]
          ? { ...acc, [current.type]: [...acc[current.type], current] }
          : { ...acc, [current.type]: [current] },
      {}
    )

    return Object.keys(groupedByType).map(sectionType =>
      groupedByType[sectionType].map((entry, idx, arr) => this.renderCredentialCards(entry, idx, arr))
    )
  }

  private renderCredentialCards(entry: StateTypeSummary, idx: number, arr: StateTypeSummary[]) {
    const { type, values, verifications } = entry
    const { did } = this.props
    const currentlySelected = this.state.selectedCredentials[type]
    const selected = currentlySelected && currentlySelected.id === verifications[0].id
    const title = idx === 0 ? `${type}:` : ''

    return (
      <CredentialCard
        title={title}
        titleStyle={{ opacity: 1, fontSize: 17 }}
        containerStyle={idx === arr.length - 1 ? {} : { marginBottom: 0, paddingBottom: 0 }}
        leftIcon={idx === 0 ? this.renderLeftIcon(type) : null}
        claimCardStyle={styles.claimCardText}
        claimRightIcon={this.renderRightIcon(selected, entry)}
        credentialItem={{
          credentialType: type,
          claimData: { [values.map(v => v.trim()).join('\n')]: renderSelfSignedOrNot(verifications, did) }
        }}
      />
    )
  }

  // TODO No padding on containers by default
  render() {
    return (
      <Container style={{ padding: 0 }}>
        {this.renderFirstSection()}
        <Block flex={0.5}>
          <ScrollView style={{ width: '100%' }}>
            {this.renderSelectionSections(this.props.availableCredentials)}
          </ScrollView>
        </Block>
        {this.renderButtons()}
      </Container>
    )
  }
}

const renderSelfSignedOrNot = (verifiactions: StateVerificationSummary[], did: string): string =>
  verifiactions.every(verification => verification.issuer === did) ? 'Self-Signed' : 'External Issuer'
