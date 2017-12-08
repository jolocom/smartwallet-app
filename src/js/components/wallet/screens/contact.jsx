import PropTypes from 'prop-types';
import React from 'react'
import {connect} from 'redux_state/utils'
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
    'confirmation-dialog:openConfirmDialog'
  ]
})
export default class WalletContactScreen extends React.Component {
  static propTypes = {
    children: PropTypes.node,
    location: PropTypes.object,
    contact: PropTypes.object.isRequired,
    getUserInformation: PropTypes.func.isRequired,
    updateInformation: PropTypes.func.isRequired,
    setInformation: PropTypes.func.isRequired,
    deleteInformation: PropTypes.func.isRequired,
    exitWithoutSaving: PropTypes.func.isRequired,
    saveChanges: PropTypes.func.isRequired,
    addNewEntry: PropTypes.func.isRequired,
    openConfirmDialog: PropTypes.func.isRequired,
    setAddressField: PropTypes.func.isRequired,
    initiateCountryScreenFromContactScreen: PropTypes.func.isRequired
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
