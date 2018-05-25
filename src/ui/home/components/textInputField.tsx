import React from 'react'
import { View, StyleSheet } from 'react-native'
import { TextField } from 'react-native-material-textfield'
import { JolocomTheme } from 'src/styles/jolocom-theme'

interface Props {
  claimName: string
  fieldValue: any
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
    const { fieldValue } = this.props
    let labelText = fieldValue.length > 0 && !this.state.focused ?
      '' : this.props.claimName
    return (
      <View style={ styles.inputContainer }>
        <TextField
          onFocus={ () => this.handleFocus() }
          onBlur={ () => this.handleBlur() }
          label={ labelText }
          labelTextStyle={ styles.labelStyle }
          tintColor={ JolocomTheme.palette.primaryColor }
          textColor={ JolocomTheme.palette.primaryColorBlack }
          value={ fieldValue }
          onChangeText={ (fieldValue: string, field: string) => {
            this.props.handleFieldInput(fieldValue, this.props.field)
          } }
        />
      </View>
    )
  }
}
