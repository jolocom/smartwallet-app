import React from 'react'
import { Text, ScrollView, View, StyleSheet } from 'react-native'
import { Container } from 'src/ui/structure'
import { StateTypeSummary, StateVerificationSummary } from 'src/reducers/sso'
import { ButtonSection } from 'src/ui/structure/buttonSectionBottom'
import I18n from 'src/locales/i18n'
import { IdentitySummary } from '../../../actions/sso/types'
import { IssuerCard } from '../../documents/components/issuerCard'
import strings from '../../../locales/strings'
import { Typography, Colors, Spacing } from 'src/styles'
import { CredentialSection } from './credentialsSection'

interface Props {
  did: string
  requester: IdentitySummary
  callbackURL: string
  availableCredentials: StateTypeSummary[]
  handleSubmitClaims: (credentials: StateVerificationSummary[]) => void
  handleDenySubmit: () => void
}

interface State {
  pending: boolean
  selectedCredentials: {
    [type: string]: StateVerificationSummary | undefined
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.backgroundLightMain,
    alignItems: 'stretch',
  },
  topSection: {
    flex: 0.3,
    marginTop: Spacing.XL,
  },
  messageContainer: {
    marginTop: Spacing.LG,
    paddingHorizontal: '5%',
  },
  message: {
    ...Typography.subMainText,
    color: Colors.blackMain,
  },
  claimsSection: {
    marginTop: Spacing.MD,
    flex: 0.6,
  },
  buttonSection: {
    flex: 0.1,
  },
})

export class ConsentComponent extends React.Component<Props, State> {
  public state = {
    pending: false,
    selectedCredentials: this.props.availableCredentials.reduce(
      (acc, curr) => ({ ...acc, [curr.type]: undefined }),
      {},
    ),
  }

  private handleClaimSelect(
    type: string,
    selectedCredential: StateVerificationSummary,
  ): void {
    const selected = this.state.selectedCredentials[type]
    if (selected && selected.id === selectedCredential.id) {
      // deselect if selected claim is pressed
      this.setState({
        selectedCredentials: {
          ...this.state.selectedCredentials,
          [type]: undefined,
        },
      })
    } else {
      // set the pressed claim to be selected
      this.setState({
        selectedCredentials: {
          ...this.state.selectedCredentials,
          [type]: selectedCredential,
        },
      })
    }
  }

  private handleSubmitClaims = (): void => {
    const { selectedCredentials } = this.state
    // get the selectedCredentials
    const credentials: StateVerificationSummary[] = Object.keys(
      selectedCredentials,
    ).map(key => selectedCredentials[key])

    this.setState({ pending: true })
    this.props.handleSubmitClaims(credentials)
  }

  private renderFirstSection(): JSX.Element {
    return (
      <View style={styles.topSection}>
        {IssuerCard(this.props.requester)}
        <View style={styles.messageContainer}>
          <Text style={styles.message}>
            {I18n.t(
              strings.THIS_SERVICE_IS_ASKING_YOU_TO_SHARE_THE_FOLLOWING_CLAIMS,
            )}
            :
          </Text>
        </View>
      </View>
    )
  }

  private renderCredentialSections(
    credentials: StateTypeSummary[],
  ): JSX.Element[] {
    const groupedByType: {
      [key: string]: StateTypeSummary[]
    } = credentials.reduce(
      (acc, current) =>
        acc[current.type]
          ? { ...acc, [current.type]: [...acc[current.type], current] }
          : { ...acc, [current.type]: [current] },
      {},
    )

    // creates a section for each type with the availableCredentials
    return Object.keys(groupedByType).map(sectionType => (
      <CredentialSection
        did={this.props.did}
        sectionType={sectionType}
        credentials={groupedByType[sectionType]}
        selectedCredential={this.state.selectedCredentials[sectionType]}
        onPress={this.handleClaimSelect}
      />
    ))
  }

  public render(): JSX.Element {
    const { selectedCredentials } = this.state

    const submitAllowed = Object.keys(selectedCredentials).every(
      key => selectedCredentials[key] !== undefined,
    )
    const buttonDisabled = !submitAllowed || this.state.pending

    return (
      <Container style={styles.container}>
        {this.renderFirstSection()}
        <View style={styles.claimsSection}>
          <ScrollView style={{ width: '100%' }}>
            {this.renderCredentialSections(this.props.availableCredentials)}
          </ScrollView>
        </View>
        <View style={styles.buttonSection}>
          <ButtonSection
            disabled={buttonDisabled}
            denyDisabled={this.state.pending}
            confirmText={I18n.t(strings.SHARE_CLAIMS)}
            denyText={I18n.t(strings.DENY)}
            handleConfirm={() => this.handleSubmitClaims()}
            handleDeny={() => this.props.handleDenySubmit()}
          />
        </View>
      </Container>
    )
  }
}
