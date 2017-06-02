import React from 'react'
import {connect} from 'redux/utils'

import Presentation from '../presentation/passport'

@connect({
  props: ['wallet.passport'],
  actions: [
    'simple-dialog:showSimpleDialog',
    'simple-dialog:configSimpleDialog',
    'wallet/country-select:initiate',
    'wallet/passport:save',
    'wallet/passport:retrievePassportInformation',
    'wallet/passport:changePassportField',
    'wallet/passport:changePhysicalAddressField',
    'wallet/passport:setFocusedField',
    'wallet/passport:setShowAddress',
    'wallet/passport:cancel'
  ]
})

export default class WalletPaasportScreen extends React.Component {
  static propTypes = {
    passport: React.PropTypes.object.isRequired,
    save: React.PropTypes.func.isRequired,
    retrievePassportInformation: React.PropTypes.func.isRequired,
    changePassportField: React.PropTypes.func.isRequired,
    initiate: React.PropTypes.func.isRequired,
    changePhysicalAddressField: React.PropTypes.func.isRequired,
    setFocusedField: React.PropTypes.func.isRequired,
    setShowAddress: React.PropTypes.func.isRequired,
    showSimpleDialog: React.PropTypes.func.isRequired,
    configSimpleDialog: React.PropTypes.func.isRequired,
    cancel: React.PropTypes.func.isRequired
  }

  render() {
    const {save, cancel, initiate} = this.props
    const {loaded, focusedField, focusedGroup, verifierLocations
    } = this.props.passport

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
      selectCountry={initiate}
      showAddress={this.props.passport.passport.showAddress}
      physicalAddress={this.parseAddressDetailsToArray()}
      passport={this.parsePassportDetailsToArray()} />
  }

  showVerifiers(...args) {
    this.props.configSimpleDialog(null, 'OK', 'OK', {})
    this.props.showSimpleDialog()
  }

  change(field, value) {
    const passportFields = this.parsePassportDetailsToArray()
      .map(({key}) => key)
    if (passportFields.includes(field)) {
      return this.props.changePassportField(field, value)
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

  parsePassportDetailsToArray() {
    const {number, expirationDate, firstName, lastName, gender, birthDate,
      birthPlace, birthCountry} = this.props.passport.passport
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
      .passport.passport.physicalAddress
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
