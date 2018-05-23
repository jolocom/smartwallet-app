import React from 'react'
import { View } from 'react-native'
import { TextField } from 'react-native-material-textfield'

interface Props {
  claimName: string
  fieldValue: any
  handleFieldInput: (e: Event) => void
}

interface State {
  focused: boolean
  errorMsg: string
}


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
    let labelText = this.props.fieldValue.length > 0 && !this.state.focused ? '' : this.props.claimName

    return (
      <View style={{height: 130, width: '80%'}}>
        <TextField
          onFocus={ () => this.handleFocus() }
          onBlur={ () => this.handleBlur() }
          label={ labelText }
          labelTextStyle={{color: 'grey'}}
          tintColor={'#942f51'}
          textColor={'#05050d'}
          value={ this.props.fieldValue }
          onChangeText={ (e : Event) => this.props.handleFieldInput(e) }
        />
      </View>
    )
  }
}
