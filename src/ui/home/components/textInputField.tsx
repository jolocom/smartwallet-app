import React from 'react'
import { View, StyleSheet } from 'react-native'
import { JolocomTheme } from 'src/styles/jolocom-theme'
const ReactMUI = require('react-native-material-textfield')

interface Props {
  claimName: string
  fieldValue: string
  field: string
  handleFieldInput: (fieldValue: string, field: string) => void
}

interface State {
  focused: boolean
  errorMsg: string
}

const styles = StyleSheet.create({
  inputContainer: {
    height: 72,
    width: '80%'
  },
  labelStyle: {
    color: 'grey'
  }
})

export class TextInputField extends React.Component<Props, State> {
  state = {
    focused: false,
    errorMsg: ''
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
    const { fieldValue, claimName, handleFieldInput } = this.props
    const labelText = this.state.focused || !fieldValue ? claimName : ''
    return (
      <View style={ styles.inputContainer }>
        <ReactMUI.TextField
          onFocus={ () => this.handleFocus() }
          onBlur={ () => this.handleBlur() }
          label={ labelText }
          labelTextStyle={ styles.labelStyle }
          tintColor={ JolocomTheme.palette.primaryColor }
          textColor={ JolocomTheme.palette.primaryColorBlack }
          value={ fieldValue }
          onChangeText={ (fieldValue: string, field: string) => {
            handleFieldInput(fieldValue, this.props.field)
          } }
        />
      </View>
    )
  }
}
