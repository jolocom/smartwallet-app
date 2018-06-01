import React from 'react'
import { Text, StyleSheet } from 'react-native'
import { Button, Checkbox } from 'react-native-material-ui'
import { Container, Block } from 'src/ui/structure'
import { JolocomTheme } from 'src/styles/jolocom-theme'
import { SingleCheckBox, 
  // ServiceProvider
 } from 'src/ui/home/containers/consent'


interface Props {
  //TODO: typing for service Provider
  // serviceProvider: ServiceProvider 
  checkboxList: SingleCheckBox[] 
  handleSubmitClaims: () => void
  handleDenySubmit: () => void
}

interface State {
  checkboxList: object[]
  claimsProvided: boolean
}

const styles = StyleSheet.create({
  
  buttonBlock: {
    justifyContent: 'space-around',
    flexDirection: 'row'
  },
  denyShareContainer: {

  },
  denyShareText:{
    fontSize: JolocomTheme.labelFontSize,
    color: JolocomTheme.primaryColorPurple,
    fontWeight: '100'
  },
  shareClaimsContainer: {
    backgroundColor: JolocomTheme.primaryColorPurple
  },
  shareClaimsText:{
    fontSize: JolocomTheme.labelFontSize,
    color: JolocomTheme.primaryColorSand,
    fontWeight: '100'
  },
  disabledShareClaimsContainer: {
    backgroundColor: JolocomTheme.disabledButtonBackgroundGrey
  },
  disabledShareClaimsText:{
    fontSize: JolocomTheme.labelFontSize,
    color: JolocomTheme.disabledButtonTextGrey,
    fontWeight: '100'
  },
  fixedText: {
    alignItems: 'center',
    fontSize: JolocomTheme.labelFontSize,
    color: JolocomTheme.primaryColorBlack
  },
  serviceProviderName: {
    fontSize: JolocomTheme.labelFontSize,
    color: JolocomTheme.primaryColorBlack
  },
  metadata: {
    fontSize: 14,
    color: JolocomTheme.primaryColorBlack
  },
  checkBox: {
    color: JolocomTheme.primaryColorPurple
  },
  checkBoxText: {

  },
  checkBoxContainer: {

  }
})

export class ConsentComponent extends React.Component<Props, State> {

  state = {
    checkboxList: [],
    claimsProvided: false
  }

  // private renderServiceDetails() {
  //   return (
  //     <Block>
  //       <Text style={ styles.serviceProviderName}>
  //       { this.props.serviceProvider.name }
  //       </Text>
  //       <Text style={ styles.metadata }>
  //       { this.props.serviceProvider.metadata }
  //       </Text>
  //     </Block>
  //   )
  // }

  private renderRequestedClaimsList (checkboxList: SingleCheckBox[] ) {
    return checkboxList.map( (checkbox: SingleCheckBox, index: number) => {
      return (
        <Block key={index}>
          <Checkbox 
            label={ checkbox.label }
            value={ checkbox.value }
            checked= { checkbox.checked }
            checkedIcon= 'check-circle'
            uncheckedIcon='fiber-manual-record'
            onCheck={ this.toggleCheck.bind(this, index) }
            style={{
              container: styles.checkBoxContainer,
              icon: styles.checkBox,
              label: styles.checkBoxText
            }}
          />
        </Block>
      )
    })
  }

  private toggleCheck (index: number) {
    const checkboxList  = this.props.checkboxList
    checkboxList[index].checked = !checkboxList[index].checked
    this.setState({
      checkboxList
    })
    const notSubmitted = checkboxList.filter(this.checkAllClaimsSubmitted)
    if (notSubmitted.length === 0) {
      this.setState({ claimsProvided: true })
    } else {
      this.setState({ claimsProvided: false })
    }
  }

  private checkAllClaimsSubmitted (checkbox: SingleCheckBox) {
    return !checkbox.checked
  }

  private renderButtons () {
   return (
    <Block style={ styles.buttonBlock }>
      <Button
        raised= { false }
        onPress={ this.props.handleDenySubmit }
        style={{ 
          container: styles.denyShareContainer, 
          text: styles.denyShareText
        }}
        upperCase= { false }
        text='Deny'
      />
      <Button
        disabled= { !this.state.claimsProvided }
        raised= { false }
        onPress={ this.props.handleSubmitClaims }
        style={ this.state.claimsProvided ? 
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

  render() {

    return (
        <Container>

         {/* { this.renderServiceDetails() } */}

          <Block>
            <Text style={ styles.fixedText }>
              This service is asking you to share the following claims:
            </Text>
          </Block>

          { this.renderRequestedClaimsList(this.props.checkboxList) }
          { this.renderButtons() }

        </Container>
    )
  }
}
