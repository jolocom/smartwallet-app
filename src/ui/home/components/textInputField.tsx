import React from 'react'
import { View, StyleSheet } from 'react-native'
import I18n from 'src/locales/i18n'
import { Colors, Typography } from 'src/styles'
const ReactMUI = require('react-native-material-textfield')

interface Props {
  fieldValue: string
  fieldName: string
  handleFieldInput: (fieldValue: string, fieldName: string) => void
  keyboardType?: string
}

interface State {
  focused: boolean
  fieldNameDisplay: string
}

const styles = StyleSheet.create({
  inputContainer: {
    height: 72,
    width: '80%',
  },
  labelStyle: {
    color: Colors.grey,
    fontFamily: Typography.fontMain,
  },
})

export class TextInputField extends React.Component<Props, State> {
  state = {
    focused: false,
    fieldNameDisplay: '',
  }

  // TODO replace all componentWillMount calls
  UNSAFE_componentWillMount() {
    const fn = this.props.fieldName.replace(/([A-Z])/g, ' $1')
    this.setState({
      fieldNameDisplay: fn.charAt(0).toUpperCase() + fn.slice(1),
    })
  }

  private handleFocus = () => {
    this.setState({
      focused: true,
    })
  }

  private handleBlur = () => {
    this.setState({
      focused: false,
    })
  }

  render() {
    const { fieldValue, fieldName, handleFieldInput, keyboardType } = this.props
    const labelText =
      this.state.focused || !fieldValue
        ? I18n.t(this.state.fieldNameDisplay)
        : ''

    return (
      <View style={styles.inputContainer}>
        <ReactMUI.TextField
          onFocus={() => this.handleFocus()}
          onBlur={() => this.handleBlur()}
          label={labelText}
          labelTextStyle={styles.labelStyle}
          style={{ fontFamily: Typography.fontMain }}
          tintColor={Colors.purpleMain}
          textColor={Colors.blackMain}
          value={fieldValue}
          onChangeText={(fieldValue: string) => {
            handleFieldInput(fieldValue, fieldName)
          }}
          keyboardType={keyboardType}
        />
      </View>
    )
  }
}
