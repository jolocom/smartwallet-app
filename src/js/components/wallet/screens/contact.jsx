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
    'wallet/contact:addNewEntry',
    'confirmation-dialog:confirm',
    'confirmation-dialog:close']
})
export default class WalletContactScreen extends React.Component {
  static propTypes = {
    children: React.PropTypes.node,
    contact: React.PropTypes.object.isRequired,
    getAccountInformation: React.PropTypes.func.isRequired,
    updateInformation: React.PropTypes.func.isRequired,
    setInformation: React.PropTypes.func.isRequired,
    deleteInformation: React.PropTypes.func.isRequired,
    exitWithoutSaving: React.PropTypes.func.isRequired,
    saveChanges: React.PropTypes.func.isRequired,
    addNewEntry: React.PropTypes.func.isRequired,
    confirm: React.PropTypes.func.isRequired,
    close: React.PropTypes.func.isRequired
  }
  constructor() {
    super()

    this.state = {
      focused: ''
    }
  }
  componentDidMount() {
    this.props.getAccountInformation()
  }
  render() {
    return (
      <Presentation
        focused={this.state.focused}
        onFocusChange={this._onFocusChange}
        information={this.props.contact.information}
        loading={this.props.contact.loading}
        showErrors={this.props.contact.showErrors}
        deleteInformation={this.props.deleteInformation}
        updateInformation={this.props.updateInformation}
        setInformation={this.props.setInformation}
        exitWithoutSaving={this.props.exitWithoutSaving}
        saveChanges={this.props.saveChanges}
        addNewEntry={this.props.addNewEntry}
        confirm={this.props.confirm}
        close={this.props.close}
      />
    )
  }

  _onFocusChange = (value) => {
    this.setState({focused: value})
  }
}
