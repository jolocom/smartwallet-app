import React from 'react'
import {connect} from 'redux/utils'
import Presentation from '../presentation/contact'

@connect({
  props: ['wallet.contact'],
  actions: ['wallet/contact:saveChanges',
    'wallet/contact:getAccountInformation',
    'wallet/contact:setInformation',
    'wallet/contact:deleteInformation',
    'wallet/contact:updateInformation',
    'wallet/contact:exitWithoutSaving']
})
export default class WalletContactScreen extends React.Component {
  static propTypes = {
    children: React.PropTypes.node,
    contact: React.PropTypes.object,
    onChange: React.PropTypes.func,
    focused: React.PropTypes.string,
    setFocused: React.PropTypes.func,
    getAccountInformation: React.PropTypes.func,
    updateInformation: React.PropTypes.func,
    setInformation: React.PropTypes.func,
    exitWithoutSaving: React.PropTypes.func
  }
  constructor() {
    super()

    this.state = {
      contact: {
        id: 'email1',
        emails: [
          'a@a.com',
          'b@b.com'
        ]
      },
      focused: 'address1@example.com',
      onFocusChange: (value) => {
        this.setState({focused: value})
      }
    }
  }
  render() {
    return (
      <Presentation
        contact={this.state.contact}
        onChange={this.state.onChange}
        focused={this.state.focused}
        onFocusChange={this.state.onFocusChange}
        information={this.props.contact}
        getAccountInformation={this.props.getAccountInformation}
        updateInformation={this.props.updateInformation}
        setInformation={this.props.setInformation}
        exitWithoutSaving={this.props.exitWithoutSaving}
      />
    )
  }
}
