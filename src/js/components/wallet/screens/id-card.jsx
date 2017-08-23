import React from 'react'
import {connect} from 'redux/utils'

import Presentation from '../presentation/id-card'

@connect({
  props: ['wallet.idCard'],
  actions: [
    'simple-dialog:configSimpleDialog',
    'simple-dialog:showSimpleDialog',
    'wallet/country-select:initiateCountrySelectScreen',
    'wallet/id-card:cancel',
    'wallet/id-card:changeIdCardField',
    'wallet/id-card:changeIdCardPhoto',
    'wallet/id-card:changePhysicalAddressField',
    'wallet/id-card:goToIdCardPhotoScreen',
    'wallet/id-card:save',
    'wallet/id-card:setFocusedField',
    'wallet/id-card:setShowAddress',
    'wallet/id-card:retrieveIdCardInformation'
  ]
})

export default class WalletPaasportScreen extends React.Component {
  static propTypes = {
    cancel: React.PropTypes.func.isRequired,
    changeIdCardField: React.PropTypes.func.isRequired,
    changeIdCardPhoto: React.PropTypes.func.isRequired,
    changePhysicalAddressField: React.PropTypes.func.isRequired,
    configSimpleDialog: React.PropTypes.func.isRequired,
    goToIdCardPhotoScreen: React.PropTypes.func.isRequired,
    idCard: React.PropTypes.object.isRequired,
    initiateCountrySelectScreen: React.PropTypes.func.isRequired,
    save: React.PropTypes.func.isRequired,
    setFocusedField: React.PropTypes.func.isRequired,
    setShowAddress: React.PropTypes.func.isRequired,
    showSimpleDialog: React.PropTypes.func.isRequired,
    retrieveIdCardInformation: React.PropTypes.func.isRequired
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
      goToIdCardPhotoScreen={this.props.goToIdCardPhotoScreen}
      cancel={cancel}
      selectCountry={initiateCountrySelectScreen}
      showAddress={this.props.idCard.idCard.showAddress}
      physicalAddress={this.parseAddressDetailsToArray()}
      idCard={this.parseIdCardDetailsToArray()} />
  }

  showVerifiers({callBack, message, buttonLabel, style}) {
    this.props.configSimpleDialog(callBack, message, buttonLabel, style)
    this.props.showSimpleDialog()
  }

  change(field, value) {
    const imageKeys = ['frontSideImg', 'backSideImg']
    if (imageKeys.includes(field)) {
      this.props.changeIdCardPhoto(field, '')
    }
    const idCardFields = [
      ...this.parseIdCardDetailsToArray().map(({key}) => key)
    ]
    if (idCardFields.includes(field)) {
      return this.props.changeIdCardField(field, value)
    } else if (field === 'streetWithNumber') {
      const {city} = this.props.idCard.idCard.physicalAddress
      this.props.setShowAddress(value.length > 0 || city.value.length > 0)
    }
    return this.props.changePhysicalAddressField(field, value)
  }

  setFocusedElements(key, group) {
    if (key === '') {
      return this.props.setFocusedField('', '')
    } else if (key === 'streetWithNumber') {
      this.props.setShowAddress(true)
    }
    return this.props.setFocusedField(key, group)
  }

  parseIdCardDetailsToArray() {
    const {number, expirationDate, firstName, lastName, gender, birthDate,
      birthPlace, birthCountry, images} = this.props.idCard.idCard
    const { frontSideImg, backSideImg } = images
    return [
      {label: 'ID Card Image', key: 'frontSideImg', group: 'img', ...frontSideImg}, // eslint-disable-line max-len
      {label: 'ID Card Image', key: 'backSideImg', group: 'img', ...backSideImg}, // eslint-disable-line max-len
      {label: 'ID Card Number', key: 'number', group: 'numbers', ...number},
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
      {...zip, key: 'zip', label: 'Zip', group},
      {...city, key: 'city', label: 'City', group},
      {...state, key: 'state', label: 'State', group},
      {...country, key: 'country', label: 'Country', group}
    ]
  }
}
