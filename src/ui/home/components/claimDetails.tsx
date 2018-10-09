import React from 'react'
import { Container, Block, CenteredText } from 'src/ui/structure'
import { StyleSheet, Text } from 'react-native'
import { JolocomTheme } from 'src/styles/jolocom-theme'
import { DecoratedClaims } from 'src/reducers/account/'
import { Button } from 'react-native-material-ui'
import { TextInputField } from 'src/ui/home/components/textInputField'
import { ClaimData } from 'src/reducers/account'


interface Props {
  selectedClaim: DecoratedClaims
  handleClaimInput: (fieldName: string, fieldValue: string) => void
  saveClaim: () => void
}

interface State {
}

export class ClaimDetailsComponent extends React.Component<Props, State> {
  state = {
    pending: false
  }

  private onSubmit = () => {
    this.setState({pending: true})
    this.props.saveClaim()
  }

  private handleFieldInput = (fieldValue: string, fieldName: string) => {
    this.props.handleClaimInput(fieldValue, fieldName)
  }

  private renderInputFields = (claimData: ClaimData) => {
    return Object.keys(claimData).map((item) => {
      return (
        <TextInputField
          fieldName={ item }
          fieldValue={ claimData[item]}
          handleFieldInput={ this.handleFieldInput }
        />
      )
    })
  }

  private confirmationEligibilityCheck = () => {
    const { claimData } = this.props.selectedClaim
    return Object.keys(claimData).find(c => claimData[c].length === 0) || this.state.pending
  }

  render() {
    const { credentialType, claimData } = this.props.selectedClaim
    return (
      <Container>
        <Block>
          <CenteredText
            style={ JolocomTheme.textStyles.light.subheader }
            msg={ credentialType }
          />
          { this.renderInputFields(claimData) }
        </Block>
        <Button
          onPress={ () => this.onSubmit() }
          upperCase={ false }
          text='Add claim'
          disabled={ !!this.confirmationEligibilityCheck() }
        />
      </Container>
    )
  }
}
