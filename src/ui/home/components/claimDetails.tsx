import React from 'react'
import { Container, Block, CenteredText } from 'src/ui/structure'
import { Button } from 'react-native-material-ui'
import { TextInputField } from 'src/ui/home/components/textInputField'
import { JolocomTheme } from 'src/styles/jolocom-theme'
import { DecoratedClaims } from 'src/reducers/account/'

interface Props {
  selectedClaim: DecoratedClaims
  saveClaim: (claimVal: string, claimField: string) => void
}

interface State {
  line_1: string
  line_2: string
  [key: string]: string
}

export class ClaimDetailsComponent extends React.Component<Props, State> {
  state = {
    line_1: '',
    line_2: '',
  }

  componentWillMount() {
    // TODO: adjust for multiline when enabled
    const { value } = this.props.selectedClaim.claims[0]
    debugger
    const claimField = this.props.selectedClaim.type[1]
    if (value && (claimField.toString() === 'ProofOfNameCredential')) {
      const fullName = value.split(' ')
      this.setState({
        line_1: fullName[0],
        line_2: fullName[1] ? fullName[1] : ''
      })
    } else if (value) {
      this.setState({ line_1: value })
    }
  }

  private handleFieldInput = (fieldValue: string, fieldName: string) => {
    this.setState({[fieldName]: fieldValue})
  }

  private onSubmit = (fieldName: string) => {
    const value = (fieldName === 'name') ? this.prepareNameValue() : this.state.line_1
    this.props.saveClaim(value, fieldName)
  }

  private prepareNameValue = () => {
    const { line_1, line_2 } = this.state
    return line_1 && line_2 ? line_1 + " " + line_2 : line_1 + line_2
  }

  private renderInputFields = (displayName: string) => {
    const { line_1, line_2 } = this.state
    switch(displayName) {
      case ('Name'):
        return (
          <Block>
            <TextInputField
              fieldName={ 'line_1' }
              fieldValue={ line_1 }
              displayName={ 'First Name' }
              handleFieldInput={ this.handleFieldInput }
            />
            <TextInputField
              fieldName={ 'line_2' }
              fieldValue={ line_2 }
              displayName={ 'Last Name' }
              handleFieldInput={ this.handleFieldInput }
            />
          </Block>
        )
      default:
        return (
          <TextInputField
            fieldName={ 'line_1' }
            fieldValue={ line_1 }
            displayName={ displayName }
            handleFieldInput={ this.handleFieldInput }
          />
        )
    }
  }

  render() {
    if (this.props.selectedClaim.claims.length === 0) {
      return
    }
    const claimField = this.props.selectedClaim.type[1]
    return (
      <Container>
        <Block>
          <CenteredText
            style={ JolocomTheme.textStyles.light.subheader }
            msg={ claimField } />
          { this.renderInputFields(claimField) }
        </Block>
        <Button
          disabled={ !this.state.line_1 }
          onPress={ () => this.onSubmit(claimField) }
          raised
          primary
          text="Add claim"
        />
      </Container>
    )
  }
}
