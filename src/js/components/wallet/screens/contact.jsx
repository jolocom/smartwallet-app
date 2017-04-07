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
    'wallet/contact:exitWithoutSaving',
    'wallet/contact:saveChanges',
    'wallet/contact:addNewEntry']
})
export default class WalletContactScreen extends React.Component {
  static propTypes = {
    children: React.PropTypes.node,
    contact: React.PropTypes.object,
    getAccountInformation: React.PropTypes.func,
    updateInformation: React.PropTypes.func,
    setInformation: React.PropTypes.func,
    deleteInformation: React.PropTypes.func,
    exitWithoutSaving: React.PropTypes.func,
    saveChanges: React.PropTypes.func,
    addNewEntry: React.PropTypes.func
  }
  constructor() {
    super()

    this.state = {
      focused: '',
      onFocusChange: (value) => {
        this.setState({focused: value})
      }
    }
  }
  componentDidMount() {
    this.props.getAccountInformation()
  }
  render() {
    return (
      <Presentation
        onChange={this.state.onChange}
        focused={this.state.focused}
        onFocusChange={this.state.onFocusChange}
        information={this.props.contact.information}
        loading={this.props.contact.loading}
        updateInformation={this.props.updateInformation}
        setInformation={this.props.setInformation}
        exitWithoutSaving={this.props.exitWithoutSaving}
        saveChanges={this.props.saveChanges}
        addNewEntry={this.props.addNewEntry}
      />
    )
  }
}
