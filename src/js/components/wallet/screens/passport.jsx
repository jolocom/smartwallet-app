/* eslint-disable */
import React from 'react'
import {connect} from 'redux/utils'
import Presentation from '../presentation/passport'

@connect({
  props: ['wallet.passport'],
  actions: [
    'wallet/passport:save',
    'wallet/passport:retrievePassportInformation',
    'wallet/passport:change',
    'wallet/passport:showVerifierLocations',
    'wallet/passport:chooseCountry',
    'wallet/passport:chooseGender',
    'wallet/passport:cancel'
  ]
})
export default class WalletPaasportScreen extends React.Component {
  static propTypes = {
    passport: React.PropTypes.object.isRequired,
    save: React.PropTypes.func.isRequired,
    retrievePassportInformation: React.PropTypes.func.isRequired,
    change: React.PropTypes.func.isRequired,
    showVerifierLocations: React.PropTypes.func.isRequired,
    chooseCountry: React.PropTypes.func.isRequired,
    chooseGender: React.PropTypes.func.isRequired,
    cancel: React.PropTypes.func.isRequired
  }

  ComponentWillMount() {
    this.props.retrievePassportInformation()
  }

  render() {
    const {save, retrievePassportInformation, showVerifierLocations, change,
      chooseCountry, chooseGender, cancel} = this.props
    let {loaded, showErrors, focussedGroup, passport, showAddress, focussedField} = this.props.passport

    return <Presentation
      loaded={loaded}
      focussedGroup={focussedGroup}
      focussedField={focussedField}
      showErrors={showErrors}
      save={save}
      retrievePassportInformation={retrievePassportInformation}
      change={change}
      showVerifierLocations={showVerifierLocations}
      chooseCountry={chooseCountry}
      chooseGender={chooseGender}
      cancel={cancel}
      showAddress={showAddress}
      physicalAddres={this.parseAddressDetailsToArray()}
      passport={this.parsePassportDetailsToArray()} />
  }

  parsePassportDetailsToArray() {
    let {number, expirationDate, firstName, lastName, gender, birthDate,
      birthPlace, birthCountry} = this.props.passport.passport
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

  parseAddressDetailsToArray() {
    let {
      streetWithNumber,
      zip,
      city,
      state,
      country
    } = this.props.passport.passport.physicalAddress
    console.log('hhhhhhhhhhhhhhhhhh ',this.props.passport.passport);
    return [
      {...streetWithNumber, key: 'streetWithNumber', label: 'Street'},
      {...zip, key: 'zip', label: 'Zip Code'},
      {...city, key: 'city', label: 'City'},
      {...state, key: 'state', label: 'State'},
      {...country, key: 'country', label: 'Country'}
    ]
  }
}
