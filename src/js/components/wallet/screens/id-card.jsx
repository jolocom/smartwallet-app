import React from 'react'
import {connect} from 'redux/utils'

import Presentation from '../presentation/id-card'

@connect({
  props: ['wallet.idCard'],
  actions: [
    'simple-dialog:showSimpleDialog',
    'simple-dialog:configSimpleDialog',
    'wallet/country-select:initiateCountrySelectScreen',
    'wallet/id-card:save',
    'wallet/id-card:retrieveIdCardInformation',
    'wallet/id-card:changeIdCardField',
    'wallet/id-card:changePhysicalAddressField',
    'wallet/id-card:setFocusedField',
    'wallet/id-card:setShowAddress',
    'wallet/id-card:cancel'
  ]
})

export default class WalletPaasportScreen extends React.Component {
  static propTypes = {
    idCard: React.PropTypes.object.isRequired,
    save: React.PropTypes.func.isRequired,
    retrieveIdCardInformation: React.PropTypes.func.isRequired,
    changeIdCardField: React.PropTypes.func.isRequired,
    initiateCountrySelectScreen: React.PropTypes.func.isRequired,
    changePhysicalAddressField: React.PropTypes.func.isRequired,
    setFocusedField: React.PropTypes.func.isRequired,
    setShowAddress: React.PropTypes.func.isRequired,
    showSimpleDialog: React.PropTypes.func.isRequired,
    configSimpleDialog: React.PropTypes.func.isRequired,
    cancel: React.PropTypes.func.isRequired
  }

  render() {
    const {save, cancel, initiateCountrySelectScreen} = this.props
    const {loaded, focusedField, focusedGroup, verifierLocations
    } = this.props.idCard

    return <Presentation
      loaded={loaded}
      focusedGroup={focusedGroup}
      focusedField={focusedField}
      save={save}
      verifierLocations={verifierLocations}
      showVerifierLocations={(...args) => this.showVerifiers(...args)}
      setFocused={(...args) => { this.setFocusedElements(...args) }}
      change={(...args) => { this.change(...args) }}
      cancel={cancel}
      selectCountry={initiateCountrySelectScreen}
      showAddress={this.props.idCard.idCard.showAddress}
      physicalAddress={this.parseAddressDetailsToArray()}
      idCard={this.parseIdCardDetailsToArray()} />
  }

  showVerifiers(...args) {
    this.props.configSimpleDialog(null, 'OK', 'OK', {})
    this.props.showSimpleDialog()
  }

  change(field, value) {
    const idCardFields = this.parseIdCardDetailsToArray()
      .map(({key}) => key)
    if (idCardFields.includes(field)) {
      return this.props.changeIdCardField(field, value)
    } else if (['streetWithNumber', 'zip'].includes(field)) {
      this.props.setShowAddress(value.trim().length > 0)
    }
    return this.props.changePhysicalAddressField(field, value)
  }

  setFocusedElements(key, group) {
    if (key === '') {
      return this.props.setFocusedField('', '')
    }
    return this.props.setFocusedField(key, group)
  }

  parseIdCardDetailsToArray() {
    const {number, expirationDate, firstName, lastName, gender, birthDate,
      birthPlace, birthCountry} = this.props.idCard.idCard
    return [
      {label: 'Id Card Number', key: 'number', group: 'numbers', ...number},
      {label: 'Expiration Date', key: 'expirationDate', group: 'numbers', ...expirationDate}, // eslint-disable-line max-len
      {label: 'First Name', key: 'firstName', group: 'person', ...firstName},
      {label: 'Last Name', key: 'lastName', group: 'person', ...lastName},
      {label: 'Gender', key: 'gender', group: 'person', ...gender},
      {label: 'Date of Birth', key: 'birthDate', group: 'cake', ...birthDate},
      {label: 'Place of Birth', key: 'birthPlace', group: 'cake', ...birthPlace}, // eslint-disable-line max-len
      {label: 'Country of Birth', key: 'birthCountry', group: 'cake', ...birthCountry} // eslint-disable-line max-len
    ]
  }

  parseAddressDetailsToArray() {
    const {streetWithNumber, zip, city, state, country} = this.props
      .idCard.idCard.physicalAddress
    const group = 'address'
    return [
      {...streetWithNumber, key: 'streetWithNumber', label: 'Street', group},
      {...zip, key: 'zip', label: 'Zip Code', group},
      {...city, key: 'city', label: 'City', group},
      {...state, key: 'state', label: 'State', group},
      {...country, key: 'country', label: 'Country', group}
    ]
  }
}
