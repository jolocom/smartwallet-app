import React from 'react'
import { ButtonSection } from 'src/ui/structure/buttonSectionBottom'
import { Text } from 'react-native'
import I18n from 'src/locales/i18n'
import { Container, Block } from 'src/ui/structure'
import { StateAuthenticationRequestSummary } from 'src/reducers/sso'

interface Props {
  activeAuthenticationRequest: StateAuthenticationRequestSummary
  cancelAuthenticationRequest: () => void
  confirmAuthenticationRequest: () => void
}

interface State {}

export class AuthenticationConsentComponent extends React.Component<
  Props,
  State
> {
  state = {
    pending: false,
  }

  private handleConfirm = () => {
    this.setState({ pending: true })
    this.props.confirmAuthenticationRequest()
  }

  private renderButtons() {
    return (
      <ButtonSection
        disabled={this.state.pending}
        confirmText={I18n.t('Confirm')}
        denyText={I18n.t('Deny')}
        handleConfirm={this.handleConfirm}
        handleDeny={() => this.props.cancelAuthenticationRequest()}
      />
    )
  }

  render() {
    return (
      <Container>
        <Block>
          <Text>This is the Authentication Request Page</Text>
        </Block>
        {this.renderButtons()}
      </Container>
    )
  }
}
