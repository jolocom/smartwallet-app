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
    'wallet/contact:storeCallback',
    'wallet/contact:exitWithoutSaving',
    'wallet/contact:saveChanges',
    'wallet/contact:addNewEntry',
    'wallet/contact:setAddressField',
    'confirmation-dialog:confirm',
    'confirmation-dialog:openConfirmDialog',
    'confirmation-dialog:close'
  ]
})
export default class WalletContactScreen extends React.Component {
  static propTypes = {
    children: React.PropTypes.node,
    location: React.PropTypes.object,
    contact: React.PropTypes.object.isRequired,
    getUserInformation: React.PropTypes.func.isRequired,
    updateInformation: React.PropTypes.func.isRequired,
    setInformation: React.PropTypes.func.isRequired,
    deleteInformation: React.PropTypes.func.isRequired,
    exitWithoutSaving: React.PropTypes.func.isRequired,
    saveChanges: React.PropTypes.func.isRequired,
    addNewEntry: React.PropTypes.func.isRequired,
    openConfirmDialog: React.PropTypes.func.isRequired,
    setAddressField: React.PropTypes.func.isRequired,
    initiateCountryScreenFromContactScreen: React.PropTypes.func.isRequired
  }
  constructor() {
    super()

    this.state = {
      focused: ''
    }
  }
  componentWillMount() {
    let callback
    if (this.props.location.query !== undefined &&
        this.props.location.query.callbackUrl !== undefined) {
      callback = this.props.location.query.callbackUrl
    } else {
      callback = '/wallet/identity'
    }
    if (this.props.contact.getDataFromBackend) {
      this.props.getUserInformation(callback)
    }
  }

  render() {
    const [{
      deleteInformation, addNewEntry, setAddressField, saveChanges,
      updateInformation, setInformation, exitWithoutSaving,
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
      confirm={this.handleConfirmDialog}
      selectCountry={initiateCountryScreenFromContactScreen} />)
  }

  handleConfirmDialog = ({title, message, rightButtonLabel, leftButtonLabel, callback}) => { // eslint-disable-line max-len
    this.props.openConfirmDialog(title, message, rightButtonLabel,
    callback, leftButtonLabel)
  }
  _onFocusChange = (value) => {
    this.setState({focused: value})
  }
}
