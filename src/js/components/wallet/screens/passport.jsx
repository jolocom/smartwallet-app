import React from 'react'
import {connect} from 'redux/utils'

import Presentation from '../presentation/passport'

@connect({
  props: ['wallet.passport'],
  actions: [
    'wallet/passport:save',
    'wallet/passport:retrievePassportInformation',
    'wallet/passport:changePassportField',
    'wallet/passport:changePhysicalAddressField',
    'wallet/passport:showVerifierLocations',
    'wallet/passport:chooseCountry',
    'wallet/passport:chooseGender',
    'wallet/passport:setFocusedGroup',
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
    changePhysicalAddressField: React.PropTypes.func.isRequired,
    setFocusedField: React.PropTypes.func.isRequired,
    setFocusedGroup: React.PropTypes.func.isRequired,
    showVerifierLocations: React.PropTypes.func.isRequired,
    focusedField: React.PropTypes.string.isRequired,
    focusedGroup: React.PropTypes.string.isRequired,
    setShowAddress: React.PropTypes.func.isRequired,
    chooseCountry: React.PropTypes.func.isRequired,
    chooseGender: React.PropTypes.func.isRequired,
    cancel: React.PropTypes.func.isRequired
  }

  ComponentWillMount() {
    this.props.retrievePassportInformation()
  }

  render() {
    const {
      save,
      retrievePassportInformation,
      showVerifierLocations,
      chooseCountry,
      cancel
    } = this.props
    let {
      loaded,
      showErrors,
      focusedField,
      focusedGroup
    } = this.props.passport
    const {showAddress} = this.props.passport.passport
    console.log('showwwwwww    ', focusedGroup)

    return <Presentation
      loaded={loaded}
      focusedGroup={focusedGroup}
      focusedField={focusedField}
      showErrors={showErrors}
      save={save}
      setFocused={(key) => { this.setFocusedElements(key) }}
      retrievePassportInformation={retrievePassportInformation}
      change={(...args) => this.change(...args)}
      showVerifierLocations={showVerifierLocations}
      chooseCountry={chooseCountry}
      cancel={cancel}
      showAddress={showAddress}
      physicalAddres={this.parseAddressDetailsToArray()}
      passport={this.parsePassportDetailsToArray()} />
  }

  change(field, value) {
    let passportFields = [
      'number',
      'expirationDate',
      'firstName',
      'lastName',
      'gender',
      'birthDate',
      'birthPlace',
      'birthCountry'
    ]
    if (passportFields.includes(field)) {
      return this.props.changePassportField(field, value)
    }
    if (field === 'streetWithNumber') {
      this.props.setShowAddress(value.length > 0)
      return this.props.changePhysicalAddressField(field, value)
    }
    return this.props.changePhysicalAddressField(field, value)
  }

  parsePassportDetailsToArray() {
    let {
      number,
      expirationDate,
      firstName,
      lastName,
      gender,
      birthDate,
      birthPlace,
      birthCountry
    } = this.props.passport.passport
    return [
      {label: 'Id Card Number', key: 'number', ...number},
      {label: 'Expiration Date', key: 'expirationDate', ...expirationDate},
      {label: 'First Name', key: 'firstName', ...firstName},
      {label: 'Last Name', key: 'lastName', ...lastName},
      {label: 'Gender', key: 'gender', ...gender, options: ['male', 'female']},
      {label: 'Date of Birth', key: 'birthDate', ...birthDate},
      {label: 'Place of Birth', key: 'birthPlace', ...birthPlace},
      {label: 'Country of Birth', key: 'birthCountry', ...birthCountry}
    ]
  }

  setFocusedElements(key) {
    let group
    if (['number', 'expirationDate'].includes(key)) {
      group = 'numbers'
    } else if (['firstName', 'lastName', 'gender'].includes(key)) {
      group = 'person'
    } else if (['birthDate', 'birthPlace', 'birthCountry'].includes(key)) {
      group = 'cake'
    } else {
      group = 'address'
    }
    this.props.setFocusedGroup(group)
    this.props.setFocusedField(key)
  }

  parseAddressDetailsToArray() {
    let {
      streetWithNumber,
      zip,
      city,
      state,
      country
    } = this.props.passport.passport.physicalAddress
    return [
      {...streetWithNumber, key: 'streetWithNumber', label: 'Street'},
      {...zip, key: 'zip', label: 'Zip Code'},
      {...city, key: 'city', label: 'City'},
      {...state, key: 'state', label: 'State'},
      {...country, key: 'country', label: 'Country'}
    ]
  }
}
