import React from 'react'
import { Text, StyleSheet } from 'react-native'
import { Button, Checkbox } from 'react-native-material-ui'
import { Container, Block } from 'src/ui/structure'
import { JolocomTheme } from 'src/styles/jolocom-theme'

//interface for checkbox list

interface Props {
  serviceProvider: any
  checkboxList: any
  handleSubmitClaims: () => void
  handleDenySubmit: () => void
}

interface State {
  checkboxList: object[]
  claimsProvided: boolean
}

//interface for Checkbox

const styles = StyleSheet.create({
  
  buttonBlock: {
    justifyContent: 'space-around',
    flexDirection: 'row'
  },
  denyShareContainer: {

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
    color: JolocomTheme.primaryColorBlack
  },
  serviceProviderName: {
    fontFamily: JolocomTheme.contentFontFamily,
    fontSize: JolocomTheme.labelFontSize,
    color: JolocomTheme.primaryColorBlack
  },
  metadata: {
    fontFamily: JolocomTheme.contentFontFamily,
    fontSize: 14,
    color: JolocomTheme.primaryColorBlack
  }
})

export class ConsentComponent extends React.Component<Props, State> {

  state = {
    checkboxList: [],
    claimsProvided: false
  }

  private renderServiceDetails() {
    return (
      <Block>
        <Text style={ styles.serviceProviderName}>
        { this.props.serviceProvider.name }
        </Text>
        <Text style={ styles.metadata }>
        { this.props.serviceProvider.metadata }
        </Text>
      </Block>
    )
  }

  //redux action
  private renderRequestedClaimsList (checkboxList: any) {
    //typing 
    return checkboxList.map( (checkbox: any, index: number) => {
      return (
        <Block key={index}>
          <Checkbox 
            label={ checkbox.label }
            value={ checkbox.value }
            checked= { checkbox.checked }
            checkedIcon= 'check-circle'
            uncheckedIcon='fiber-manual-record'
            onCheck={ this.toggleCheck.bind(this, index) }
            // style={ styles.checkBox }
          />
        </Block>
      )
    })
  }

  private toggleCheck (index: any) {
    const checkboxList  = this.props.checkboxList
    checkboxList[index].checked = !checkboxList[index].checked

    this.setState({
      checkboxList
    })

    const test = checkboxList.filter(this.checkAllClaimsSubmitted)
    if (test.length === 0) {
      this.setState({ claimsProvided: true })
    } else {
      this.setState({ claimsProvided: false })
    }
  }

  private checkAllClaimsSubmitted (checkbox: any) {
  //interface checkbox
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

         { this.renderServiceDetails() }

          <Block>
            <Text style={ styles.fixedText }>
              is asking you to share the following claims:
            </Text>
          </Block>

          { this.renderRequestedClaimsList(this.props.checkboxList) }
          { this.renderButtons() }

        </Container>
    )
  }
}