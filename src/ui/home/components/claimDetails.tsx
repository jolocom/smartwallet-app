import React from 'react'
import { Container, Block, CenteredText } from 'src/ui/structure'
import { Button } from 'react-native-material-ui'
import { TextInputField } from 'src/ui/home/components/textInputField'
import { JolocomTheme } from 'src/styles/jolocom-theme'

interface Props {
  selectedClaim: any
  saveClaim: (claimVal: string, claimField: string) => void
}

interface State {
  fieldValue: any
  firstName: string
  lastName: string
  [key: string]: string
}

export class ClaimDetailsComponent extends React.Component<Props, State> {
  state = {
    fieldValue: '',
    firstName: '',
    lastName: ''
  }

  componentWillMount() {
    const { selectedClaim } = this.props
    selectedClaim.claimValue !== undefined ?
      this.setState({
        fieldValue: this.props.selectedClaim.claimValue
      }) : ''

    if (selectedClaim.claimField === 'name' && selectedClaim.claimValue !== undefined) {
      const splitName = selectedClaim.claimValue.split(' ')
      this.setState({
        firstName: splitName[0],
        lastName: splitName[1] !== undefined ? splitName[1] : ''
      })
    }
  }

  private handleFieldInput = (fieldValue: string, field: string) => {
    this.setState({
      [field]: fieldValue
    })
  }

  private onSubmit = () => {
    const { claimField } = this.props.selectedClaim
    let claimValue = this.state.fieldValue
    if (claimField === 'name') {
      claimValue = this.prepareNameClaim()
    }
    this.props.saveClaim(claimValue, claimField)
  }

  private prepareNameClaim = () => {
    const { firstName, lastName } = this.state
    let name
    firstName && lastName ? name = firstName + ' ' + lastName : name = firstName + lastName
    return name
  }

  private renderInputFields = (claimName: string) => {
    if (this.props.selectedClaim.claimField === 'name') {
      return (
        <Block>
          <TextInputField
            field={ 'firstName' }
            fieldValue={ this.state.firstName }
            claimName={ 'First Name' }
            handleFieldInput={ this.handleFieldInput }
          />
          <TextInputField
            field={ 'lastName' }
            fieldValue={ this.state.lastName }
            claimName={ 'Last Name' }
            handleFieldInput={ this.handleFieldInput }
          />
      </Block>
      )
    } else {
      return (
        <TextInputField
          field={ 'fieldValue' }
          fieldValue={ this.state.fieldValue }
          claimName={ claimName }
          handleFieldInput={ this.handleFieldInput }
        />
      )
    }
  }

  render() {
    let claimName = stringCapitalize(this.props.selectedClaim.claimField)
    return (
      <Container>
        <Block>
          <CenteredText
            style={ JolocomTheme.textStyles.light.subheader }
            msg={ claimName } />
          { this.renderInputFields(claimName) }
        </Block>
          <Button
            disabled={this.state.fieldValue.length === 0}
            onPress={ () => this.onSubmit() }
            raised
            primary
            text="Add claim"
          />
      </Container>
    )
  }
}

const stringCapitalize = (myString : string) : string => {
  const matches = myString.match(/[A-Z]/g)
  if (matches !== null) {
    matches.map((match) => {
      const index = myString.indexOf(match)
      const tx = myString.slice(0, index) + " " + myString.slice(index)
      myString = tx
    })
  }
  return myString[0].toUpperCase() + myString.slice(1)
}
