import React from 'react'
import { Container, Block, CenteredText } from 'src/ui/structure'
import { Button } from 'react-native-material-ui'
import { TextInputField } from 'src/ui/home/components/textInputField'
import { JolocomTheme } from 'src/styles/jolocom-theme'
import { ClaimSingle } from 'src/ui/home/components/claimCard'



interface Props {
  selectedClaim: ClaimSingle
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
    const { claimField, claimValue } = this.props.selectedClaim
    if (claimValue && claimField === 'name') {
      const fullName = claimValue.split(' ')
      this.setState({
        line_1: fullName[0],
        line_2: fullName[1] ? fullName[1] : ''
      })
    } else if (claimValue) {
      this.setState({ line_1: claimValue })
    }
  }

  private handleFieldInput = (fieldValue: string, field: string) => {
    this.setState({[field]: fieldValue})
  }

  private onSubmit = (claimField: string) => {
    const claimValue = (claimField === 'name') ? this.prepareNameClaim() : this.state.line_1
    this.props.saveClaim(claimValue, claimField)
  }

  private prepareNameClaim = () => {
    const { line_1, line_2 } = this.state
    return line_1 && line_2 ? line_1 + " " + line_2 : line_1 + line_2
  }

  private renderInputFields = (claimName: string) => {
    const { line_1, line_2 } = this.state
    switch(claimName) {
      case ('Name'):
        return (
          <Block>
            <TextInputField
              field={ 'line_1' }
              fieldValue={ line_1 }
              claimName={ 'First Name' }
              handleFieldInput={ this.handleFieldInput }
            />
            <TextInputField
              field={ 'line_2' }
              fieldValue={ line_2 }
              claimName={ 'Last Name' }
              handleFieldInput={ this.handleFieldInput }
            />
          </Block>
        )
      default:
        return (
          <TextInputField
            field={ 'line_1' }
            fieldValue={ line_1 }
            claimName={ claimName }
            handleFieldInput={ this.handleFieldInput }
          />
        )
    }
  }

  render() {
    const { claimField } = this.props.selectedClaim
    const claimName = prepareFieldLabel(claimField)
    return (
      <Container>
        <Block>
          <CenteredText
            style={ JolocomTheme.textStyles.light.subheader }
            msg={ claimName } />
          { this.renderInputFields(claimName) }
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

const prepareFieldLabel = (myString : string) : string => {
  const matches = myString.match(/[A-Z]/g)
  if(matches) {
    matches.map((match) => {
      const index = myString.indexOf(match)
      const tx = myString.slice(0, index) + " " + myString.slice(index)
      myString = tx
    })
  }
  return myString[0].toUpperCase() + myString.slice(1)
}
