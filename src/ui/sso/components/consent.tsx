import React from 'react'
import { Text, ScrollView, TextStyle, View } from 'react-native'
import { Container, Block } from 'src/ui/structure'
import { JolocomTheme } from 'src/styles/jolocom-theme'
import { StateTypeSummary, StateVerificationSummary } from 'src/reducers/sso'
import { IconToggle } from 'react-native-material-ui'
import { getCredentialIconByType } from 'src/resources/util'
import { ButtonSection } from 'src/ui/structure/buttonSectionBottom'
import { ConsentAttributeCard, HeaderSection } from './claimCard'
import I18n from 'src/locales/i18n'
import {IdentitySummary} from '../../../actions/sso/types'
import {IssuerCard} from '../../documents/components/issuerCard'

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

const styles = {
  serviceTitle: {
    fontFamily: JolocomTheme.contentFontFamily,
    fontSize: JolocomTheme.headerFontSize,
    color: JolocomTheme.primaryColorBlack,
    fontWeight: '100',
  } as TextStyle,
  serviceMetadata: {
    ...JolocomTheme.textStyles.light.labelDisplayField,
    fontFamily: JolocomTheme.contentFontFamily,
  },
  fixedText: {
    fontFamily: JolocomTheme.contentFontFamily,
    fontSize: JolocomTheme.labelFontSize,
    color: JolocomTheme.primaryColorBlack,
    padding: '5%',
  },
  claimCardText: {
    primaryText: {
      fontSize: 17,
      opacity: 0.4,
    },
    secondaryText: {
      fontSize: JolocomTheme.headerFontSize,
      opacity: 1,
    },
  },
}

export class ConsentComponent extends React.Component<Props, State> {
  state: State = {
    pending: false,
    selectedCredentials: this.props.availableCredentials.reduce(
      (acc, curr) => ({ ...acc, [curr.type]: undefined }),
      {},
    ),
  }

  private handleAttributeSelect(
    type: string,
    selectedCredential: StateVerificationSummary,
  ) {
    const selected = this.state.selectedCredentials[type]
    if (selected && selected.id === selectedCredential.id) {
      this.setState({
        selectedCredentials: {
          ...this.state.selectedCredentials,
          [type]: undefined,
        },
      })
    } else {
      this.setState({
        selectedCredentials: {
          ...this.state.selectedCredentials,
          [type]: selectedCredential,
        },
      })
    }
  }

  private handleSubmitClaims = () => {
    const { selectedCredentials } = this.state
    const credentials = Object.keys(selectedCredentials).map(
      key => selectedCredentials[key],
    )
    this.setState({ pending: true })
    this.props.handleSubmitClaims(credentials as StateVerificationSummary[])
  }

  private renderButtons() {
    const { selectedCredentials } = this.state

    const submitAllowed = Object.keys(selectedCredentials).every(
      key => selectedCredentials[key] !== undefined,
    )
    const buttonDisabled = !submitAllowed || this.state.pending

    return (
      <ButtonSection
        disabled={buttonDisabled}
        denyDisabled={this.state.pending}
        confirmText={I18n.t('Share claims')}
        denyText={I18n.t('Deny')}
        handleConfirm={() => this.handleSubmitClaims()}
        handleDeny={() => this.props.handleDenySubmit()}
      />
    )
  }

  private renderFirstSection() {
    return (
      <Block flex={0.4}>
        <View flex={0.1} />
        {IssuerCard(this.props.requester)}
        <Block flex={0.5}>
          <Text style={styles.fixedText}>
            {I18n.t('This service is asking you to share the following claims')}
            :
          </Text>
        </Block>
      </Block>
    )
  }

  private renderRightIcon(selected: boolean, entry: StateTypeSummary) {
    const checkboxColor = selected
      ? JolocomTheme.primaryColorPurple
      : JolocomTheme.disabledButtonBackgroundGrey
    const { type, verifications } = entry

    return (
      <IconToggle
        name={selected ? 'check-circle' : 'fiber-manual-record'}
        onPress={() => this.handleAttributeSelect(type, verifications[0])}
        color={checkboxColor}
      />
    )
  }

  private renderLeftIcon(type: string) {
    return getCredentialIconByType(type)
  }

  private renderSelectionSections(sections: StateTypeSummary[]) {
    const groupedByType = sections.reduce<{
      [key: string]: StateTypeSummary[]
    }>(
      (acc, current) =>
        acc[current.type]
          ? { ...acc, [current.type]: [...acc[current.type], current] }
          : { ...acc, [current.type]: [current] },
      {},
    )

    return Object.keys(groupedByType).map(sectionType => (
      <View>
        {groupedByType[sectionType].map((entry, idx, arr) =>
          this.renderCredentialCards(entry, idx, arr),
        )}
      </View>
    ))
  }

  private renderCredentialCards(
    entry: StateTypeSummary,
    idx: number,
    arr: StateTypeSummary[],
  ) {
    const isFirst = idx === 0
    const isLast = idx === arr.length - 1
    const { type, values, verifications } = entry
    const currentlySelected = this.state.selectedCredentials[type]
    const isSelected =
      currentlySelected && currentlySelected.id === verifications[0].id
    const containsData = entry.values.length > 0

    const headerSection = isFirst ? (
      <HeaderSection
        containerStyle={{ paddingTop: '5%' }}
        title={`${type}:`}
        leftIcon={this.renderLeftIcon(type)}
      />
    ) : null

    return (
      <View>
        {headerSection}
        <ConsentAttributeCard
          containerStyle={{ paddingLeft: '20%' }}
          split={isLast}
          rightIcon={
            containsData ? this.renderRightIcon(!!isSelected, entry) : null
          }
          did={this.props.did}
          values={values}
          issuer={(verifications[0] && verifications[0].issuer) || {}}
        />
      </View>
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
