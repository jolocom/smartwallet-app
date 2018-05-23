import React from 'react'
import { Container, Block, CenteredText } from 'src/ui/structure'
import { Button } from 'react-native-material-ui'
import { TextInputField } from 'src/ui/home/components/textInputField'
import { JolocomTheme } from 'src/styles/jolocom-theme'


interface Props {
  selectedClaim: any
  saveClaim: (claimVal: string) => void
}

interface State {
  fieldValue: any
}

export class ClaimDetailsComponent extends React.Component<Props, State> {
  state = {
    fieldValue: ''
  }

  componentWillMount() {
    this.props.selectedClaim.claimValue !== undefined ?
    this.setState( {fieldValue: this.props.selectedClaim.claimValue} ) :
    null
  }

  private handleFieldInput = (fieldValue: Event) => {
    // TODO: sanity check for type of field
    this.setState({
      fieldValue
    })
  }

  private onSubmit = () => {
    this.props.saveClaim(this.state.fieldValue)
  }

  render() {
    let claimName = stringCapitalize(this.props.selectedClaim.claimField)

    return (
      <Container>
        <Block>
          <CenteredText
            style={ JolocomTheme.textStyles.light.subheader }
            msg={ claimName } />

          <TextInputField
            fieldValue={ this.state.fieldValue }
            claimName={ claimName }
            handleFieldInput={ this.handleFieldInput }
          />
        </Block>

        <Block>
          <Button
            disabled={this.state.fieldValue.length === 0}
            onPress={ () => this.onSubmit() }
            raised
            primary
            text="Add claim"
          />
        </Block>
      </Container>
    )
  }
}


const stringCapitalize = (myString : string) : string => {
  const matches = myString.match(/[A-Z]/g)
  if (matches !== null) {
    matches.map((match) => {
      const ix = myString.indexOf(match)
      const tx = myString.slice(0, ix) + " " + myString.slice(ix)
      myString = tx
    })
  }
  return myString[0].toUpperCase() + myString.slice(1)
}
