import React from 'react'
import { View, StyleSheet } from 'react-native'
import { JolocomTheme } from 'src/styles/jolocom-theme'
const ReactMUI = require('react-native-material-textfield')

interface Props {
  displayName: string
  fieldValue: string
  fieldName: string
  errorMsg: string
  handleFieldInput: (fieldValue: string, fieldName: string) => void
}

interface State {
  focused: boolean
}

const styles = StyleSheet.create({
  inputContainer: {
    height: 72,
    width: '80%'
  },
  labelStyle: {
    color: 'grey',
    fontFamily: JolocomTheme.contentFontFamily
  }
})

export class TextInputField extends React.Component<Props, State> {
  state = {
    focused: false
  }

  private handleFocus = () => {
    this.setState({
      focused: true
    })
  }

  private handleBlur = () => {
    this.setState({
      focused: false
    })
  }

  render() {
    const { fieldValue, displayName, handleFieldInput, errorMsg } = this.props
    const labelText = this.state.focused || !fieldValue ? displayName : ''
    return (
      <View style={ styles.inputContainer }>
        <ReactMUI.TextField
          onFocus={ () => this.handleFocus() }
          onBlur={ () => this.handleBlur() }
          label={ labelText }
          error={ errorMsg }
          labelTextStyle={ styles.labelStyle }
          style={{ fontFamily: JolocomTheme.contentFontFamily }}
          tintColor={ JolocomTheme.primaryColorPurple }
          textColor={ JolocomTheme.primaryColorBlack }
          value={ fieldValue }
          onChangeText={ (fieldValue: string, field: string) => {
            handleFieldInput(fieldValue, this.props.fieldName)
          } }
        />
      </View>
    )
  }
}
