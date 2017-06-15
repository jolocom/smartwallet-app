import React from 'react'
import {connect} from 'redux/utils'
import Presentation from '../presentation/data'

@connect({
  props: ['verification.data'],
  actions: [
    'simple-dialog:showSimpleDialog',
    'simple-dialog:configSimpleDialog',
    'verification/country:initiateCountrySelectScreen',
    'verification/data:changeIdCardField',
    'verification/data:changePhysicalAddressField',
    'verification/data:setFocusedField',
    'verification/data:setShowAddress',
    'verification/data:verifyData',
    'verification/data:cancel'
  ]
})
export default class VerificationDataScreen extends React.Component {
  static propTypes = {
    data: React.PropTypes.object.isRequired,
    changeIdCardField: React.PropTypes.func.isRequired,
    initiateCountrySelectScreen: React.PropTypes.func.isRequired,
    changePhysicalAddressField: React.PropTypes.func.isRequired,
    setFocusedField: React.PropTypes.func.isRequired,
    setShowAddress: React.PropTypes.func.isRequired,
    verifyData: React.PropTypes.func.isRequired,
    cancel: React.PropTypes.func.isRequired
  }

  render() {
    const {cancel, verifyData, initiateCountrySelectScreen} = this.props
    const {focusedField, focusedGroup, verifierLocations
    } = this.props.data

    return <Presentation
      loaded
      focusedGroup={focusedGroup}
      focusedField={focusedField}
      verify={verifyData}
      verifierLocations={verifierLocations}
      setFocused={(...args) => { this.setFocusedElements(...args) }}
      change={(...args) => { this.change(...args) }}
      cancel={cancel}
      selectCountry={initiateCountrySelectScreen}
      showAddress={this.props.data.idCard.showAddress}
      physicalAddress={this.parseAddressDetailsToArray()}
      idCard={this.parseIdCardDetailsToArray()} />
  }

  change(field, value) {
    const idCardFields = this.parseIdCardDetailsToArray()
      .map(({key}) => key)
    if (idCardFields.includes(field)) {
      return this.props.changeIdCardField(field, value)
    } else if (field === 'streetWithNumber') {
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
      birthPlace, birthCountry} = this.props.data.idCard
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
      .data.idCard.physicalAddress
    const group = 'address'
    return [
      {...streetWithNumber, key: 'streetWithNumber', label: 'Street', group},
      {...city, key: 'city', label: 'City', group},
      {...zip, key: 'zip', label: 'Zip Code', group},
      {...state, key: 'state', label: 'State', group},
      {...country, key: 'country', label: 'Country', group}
    ]
  }
}
