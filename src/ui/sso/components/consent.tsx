import React from 'react'
import { Text, StyleSheet, ScrollView } from 'react-native'
import { Button, } from 'react-native-material-ui'
import { Container, Block } from 'src/ui/structure'
import { JolocomTheme } from 'src/styles/jolocom-theme'
import { StateTypeSummary, StateVerificationSummary } from 'src/reducers/sso'
import { AttributeSummary } from 'src/ui/sso/components/attributeSelectionSection'
import { areCredTypesEqual } from 'src/lib/util'

interface Props {
  requester: string
  requestedCredentials: StateTypeSummary[]
  callbackURL: string
  handleSubmitClaims: (credentials: StateVerificationSummary[]) => void
  handleDenySubmit: () => void
}

interface State {
  pending: boolean
  requestedCredentials: Array<{
    type: string[]
    selectedCredential: StateVerificationSummary | undefined
  }>
}

const styles = StyleSheet.create({
  serviceTitle: {
    fontFamily: JolocomTheme.contentFontFamily,
    fontSize: JolocomTheme.headerFontSize,
    color: JolocomTheme.primaryColorBlack,
    fontWeight: '100'
  },
  serviceMetadata: {
    ...JolocomTheme.textStyles.light.labelDisplayField,
    fontFamily: JolocomTheme.contentFontFamily
  },
  buttonBlock: {
    justifyContent: 'space-around',
    flexDirection: 'row',
    backgroundColor: JolocomTheme.primaryColorWhite
  },
  denyShareText:{
    fontFamily: JolocomTheme.contentFontFamily,
    fontSize: JolocomTheme.labelFontSize,
    color: JolocomTheme.primaryColorPurple,
    fontWeight: '100'
  },
  shareClaimsContainer: {
    backgroundColor: JolocomTheme.primaryColorPurple
  },
  shareClaimsText:{
    fontFamily: JolocomTheme.contentFontFamily,
    fontSize: JolocomTheme.labelFontSize,
    color: JolocomTheme.primaryColorSand,
    fontWeight: '100'
  },
  disabledShareClaimsContainer: {
    backgroundColor: JolocomTheme.disabledButtonBackgroundGrey
  },
  disabledShareClaimsText:{
    fontFamily: JolocomTheme.contentFontFamily,
    fontSize: JolocomTheme.labelFontSize,
    color: JolocomTheme.disabledButtonTextGrey,
    fontWeight: '100'
  },
  fixedText: {
    fontFamily: JolocomTheme.contentFontFamily,
    fontSize: JolocomTheme.labelFontSize,
    color: JolocomTheme.primaryColorBlack,
    padding: '5%'
  },
})

export class ConsentComponent extends React.Component<Props, State> {
  state: State = {
    pending: false,
    requestedCredentials: this.props.requestedCredentials.map(cred => ({
      type: cred.type, 
      selectedCredential: undefined
    })),
  }

  private handleCredentialSelection(type: string[], selectedCredential: StateVerificationSummary) {
    const newSelectionsState = this.state.requestedCredentials.map(credential => {
      if (areCredTypesEqual(credential.type, type)) {
        return {
          type,
          selectedCredential
        }
      }
      return credential
    })

    this.setState({requestedCredentials: newSelectionsState})
  }

  private handleSubmitClaims = () => {
    const credentials: StateVerificationSummary[] = []
    this.state.requestedCredentials.forEach(request => {
      if (request.selectedCredential) {
        credentials.push(request.selectedCredential)
      }
    })
    this.setState({ pending: true })
    this.props.handleSubmitClaims(credentials)
  }

  private renderButtons () {
    const { handleDenySubmit } = this.props
    const { requestedCredentials } = this.state
    const submitAllowed = requestedCredentials.every(requestedCred => !!requestedCred.selectedCredential)

    return (
      <Block style={ styles.buttonBlock } flex={0.1}>
        <Button
          onPress={ handleDenySubmit }
          style={{ text: styles.denyShareText }}
          upperCase={ false }
          text='Deny'
        />
        <Button
          disabled= { !submitAllowed || this.state.pending}
          onPress={ this.handleSubmitClaims }
          style={ submitAllowed && !this.state.pending ? 
            { 
              container: styles.shareClaimsContainer, 
              text: styles.shareClaimsText 
            } : {
              container: styles.disabledShareClaimsContainer,
              text:styles.disabledShareClaimsText
            }}
          upperCase= { false }
          text='Share claims'
        />
      </Block>
    ) 
  }

  private renderFirstSection() {
    return <Block flex={0.4} >
      <Block flex={0.1}>
        {null}
      </Block>

      <Block flex={0.4} style={{backgroundColor: 'white'}}>
        <Text style={styles.serviceTitle}> {this.props.requester.substring(0,25)}... </Text>
        <Text style={styles.serviceMetadata}> {this.props.callbackURL.substring(0,25)}... </Text>
      </Block>

      <Block flex={0.5}>
        <Text style={ styles.fixedText }>
          This service is asking you to share the following claims:
        </Text>
      </Block>
    </Block>
  }

  private renderSelectionSections(sections: StateTypeSummary[]) {
    return sections.map(section => 
      <AttributeSummary
        key={section.type.toString()}
        attributeType={section.type}
        attributes={section.credentials}
        handleAttributeSelection={(type: string[], credential: StateVerificationSummary) => 
          this.handleCredentialSelection(type, credential)
        }
      />
    )
  }

  // TODO No padding on containers by default
  render() {
    return (
      <Container style={{ padding: 0 }}>
        { this.renderFirstSection() }
        <Block flex={0.5}>
          <ScrollView style={{width: '100%'}}>
            { this.renderSelectionSections(this.props.requestedCredentials) }
          </ScrollView>
        </Block>
        { this.renderButtons() }
      </Container>
    )
  }
}