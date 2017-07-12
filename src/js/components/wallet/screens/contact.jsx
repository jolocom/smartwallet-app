import React from 'react'
import {connect} from 'redux/utils'
import Presentation from '../presentation/contact'

@connect({
  props: ['wallet.contact'],
  actions: [
    'wallet/contact:saveChanges',
    'wallet/contact:getUserInformation',
    'wallet/country-select:initiateCountryScreenFromContactScreen',
    'wallet/contact:setInformation',
    'wallet/contact:deleteInformation',
    'wallet/contact:updateInformation',
    'wallet/contact:exitWithoutSaving',
    'wallet/contact:saveChanges',
    'wallet/contact:addNewEntry',
    'wallet/contact:setAddressField',
    'confirmation-dialog:confirm',
    'confirmation-dialog:close'
  ]
})
export default class WalletContactScreen extends React.Component {
  static propTypes = {
    children: React.PropTypes.node,
    contact: React.PropTypes.object.isRequired,
    getUserInformation: React.PropTypes.func.isRequired,
    updateInformation: React.PropTypes.func.isRequired,
    setInformation: React.PropTypes.func.isRequired,
    deleteInformation: React.PropTypes.func.isRequired,
    exitWithoutSaving: React.PropTypes.func.isRequired,
    saveChanges: React.PropTypes.func.isRequired,
    addNewEntry: React.PropTypes.func.isRequired,
    confirm: React.PropTypes.func.isRequired,
    setAddressField: React.PropTypes.func.isRequired,
    initiateCountryScreenFromContactScreen: React.PropTypes.func.isRequired,
    close: React.PropTypes.func.isRequired
  }
  constructor() {
    super()

    this.state = {
      focused: ''
    }
  }
  componentWillMount() {
    if (this.props.contact.getDataFromBackend) {
      this.props.getUserInformation()
    }
  }

  render() {
    const [{
      deleteInformation, addNewEntry, confirm, setAddressField, saveChanges,
      updateInformation, setInformation, exitWithoutSaving, close,
      initiateCountryScreenFromContactScreen
    }, {
      information, loading, showErrors
    }] = [this.props, this.props.contact]
    return (<Presentation
      information={information}
      focused={this.state.focused}
      onFocusChange={this._onFocusChange}
      loading={loading}
      setAddressField={setAddressField}
      showErrors={showErrors}
      deleteInformation={deleteInformation}
      updateInformation={updateInformation}
      setInformation={setInformation}
      exitWithoutSaving={exitWithoutSaving}
      saveChanges={saveChanges}
      addNewEntry={addNewEntry}
      confirm={confirm}
      close={close}
      selectCountry={initiateCountryScreenFromContactScreen} />)
  }

  _onFocusChange = (value) => {
    this.setState({focused: value})
  }
}
