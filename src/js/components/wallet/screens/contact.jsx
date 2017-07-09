import React from 'react'
import {connect} from 'redux/utils'
import Presentation from '../presentation/contact'

@connect({
  props: ['wallet.contact'],
  actions: ['wallet/contact:saveChanges',
    'wallet/contact:getUserInformation',
    'wallet/country-select:initiateCountrySelectScreen',
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
    getUserInformation: React.PropTypes.func.isRequired,
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
  componentWillMount() {
    this.props.getUserInformation()
  }

  render() {
    const [{
      initiateCountrySelectScreen,
      deleteInformation,
      updateInformation,
      setInformation,
      exitWithoutSaving,
      saveChanges,
      addNewEntry,
      confirm,
      close
    }, {
      information,
      loading,
      showErrors
    }] = [this.props, this.props.contact]
    return (<Presentation
      information={information}
      focused={this.state.focused}
      onFocusChange={this._onFocusChange}
      loading={loading}
      showErrors={showErrors}
      deleteInformation={deleteInformation}
      updateInformation={updateInformation}
      setInformation={setInformation}
      exitWithoutSaving={exitWithoutSaving}
      saveChanges={saveChanges}
      addNewEntry={addNewEntry}
      confirm={confirm}
      close={close}
      selectCountry={initiateCountrySelectScreen} />)
  }

  _onFocusChange = (value) => {
    this.setState({focused: value})
  }

  parseInformation() {
    const {originalInformation, newInformation} = this.props.contact.information
    if ([...originalInformation.phones, ...newInformation.phones].some(phone => !phone.delete)) { // eslint-disable-line max-len
      this.props.addNewEntry('phone', newInformation.phones.length)
    }
  }

  parseAddressDetailsToArray() {
    const {originalInformation, newInformation} = this.props.contact.information

    const addresses = [
      ...originalInformation.addresses
      .map(({streetWithNumber, zip, city, state, country}) => ([
        {...streetWithNumber, key: 'streetWithNumber', label: 'Street'},
        {...zip, key: 'zip', label: 'Zip Code'},
        {...city, key: 'city', label: 'City'},
        {...state, key: 'state', label: 'State'},
        {...country, key: 'country', label: 'Country'}
      ])),
      ...newInformation.addresses
      .map(({streetWithNumber, zip, city, state, country}) => ([
        {...streetWithNumber, key: 'streetWithNumber', label: 'Street'},
        {...zip, key: 'zip', label: 'Zip Code'},
        {...city, key: 'city', label: 'City'},
        {...state, key: 'state', label: 'State'},
        {...country, key: 'country', label: 'Country'}
      ]))
    ]
    return addresses.some(address => !address.delete) ? addresses : [
      {value: '', key: 'streetWithNumber', label: 'Street'},
      {value: '', key: 'zip', label: 'Zip Code'},
      {value: '', key: 'city', label: 'City'},
      {value: '', key: 'state', label: 'State'},
      {value: '', key: 'country', label: 'Country'}
    ]
  }
}
