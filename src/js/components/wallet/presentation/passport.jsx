/* eslint-disable */
import React from 'react'
import Radium from 'radium'

import CommunicationCall from 'material-ui/svg-icons/communication/call'
import CommunicationEmail from 'material-ui/svg-icons/communication/email'
import {TextField, SelectField, MenuItem} from 'material-ui'
import DatePicker from 'material-ui/DatePicker'

import {EditAppBar, EditHeader, EditListItem, AddNew, SelectListItem, DateListItem} from './ui'
import {Content} from '../../structure'
import {theme} from 'styles'

@Radium
export default class WalletPassport extends React.Component {
  static propTypes = {
    save: React.PropTypes.func.isRequired,
    retrievePassportInformation: React.PropTypes.func.isRequired,
    showVerifierLocations: React.PropTypes.func.isRequired,
    change: React.PropTypes.func.isRequired,
    chooseCountry: React.PropTypes.func.isRequired,
    chooseGender: React.PropTypes.func.isRequired,
    cancel: React.PropTypes.func.isRequired,
    loaded: React.PropTypes.bool.isRequired,
    focussedGroup: React.PropTypes.string.isRequired,
    focussedField: React.PropTypes.string.isRequired,
    showErrors: React.PropTypes.bool.isRequired,
    showAddress: React.PropTypes.bool.isRequired,
    showPhysicalAddress: React.PropTypes.bool.isRequired,
    physicalAddres: React.PropTypes.array.isRequired,
    passport: React.PropTypes.array.isRequired
  }

  renderField(field) {
    switch(field.key) {
      case 'birthCountry':
      case 'country':
        return this.renderCountryField(field)
      case 'gender':
        return this.renderCountryField(field)
      case 'birthDate':
      case 'expirationDate':
        return this.renderDateField(field)
      default:
        return this.renderTextField(field)
    }
  }

  renderCountryField({value, label, valid, key, options, index, icon}) {
    return <SelectListItem
      floatingLabelText={label}
      key={key}
      icon={icon}
      iconStyle={{maxWidth: '400px'}}
      value={value}
      label={label}
      name={key}
      fullWidth
      types={options}
      enableEdit
      onDelete={() => this.props.change(key, key, '')}
      enableDelete={value.length > 0}
      onChange={(e,i,v) => this.props.change(key, key, v)}
      autoWidth={true} />

  }

  renderTextField({value, label, valid, key, index, icon}) {
    return <EditListItem
      icon={icon}
      key={key}
      iconStyle={{maxWidth: '400px'}}
      label={label}
      name={key}
      enableEdit
      value={value}
      showErrors={!valid && this.props.showErrors}
      valid={valid}
      verified={false}
      onChange={(e) => this.props.change(key, key, e.target.value)}
      focused
      onDelete={() => this.props.change(key, key, '')}
      enableDelete={value.length > 0}
      errorText={'errorText'} />
  }

  renderDateField({value, label, valid, key, index, icon}) {
    return <DateListItem
      key={key}
      icon={icon}
      iconStyle={{maxWidth: '400px'}}
      label={label}
      name={key}
      enableEdit
      value={value}
      showErrors={!valid && this.props.showErrors}
      valid={valid}
      verified={false}
      focused
      onDelete={() => this.props.change(key, key, '')}
      enableDelete={value.length > 0}
      errorText={'errorText'}
      onChange={(e, date) => this.props.change(key, key, date)} />
  }

  renderOptionsField({value, label, valid, key, options, index, icon}) {
    return <SelectField
      floatingLabelText={label}
      id={key}
      key={key}
      value={value}
      fullWidth
      onChange={(e,i,v) => this.props.change(key, key, v)}
      autoWidth={true} >
      {options.map((e, i)=> <MenuItem key={i} value={e} primaryText={e} />)}
    </ SelectField>
  } // person location cake

  createIcons() {
    let listOfOcons = [CommunicationCall,]
    listOfOcons[2] = CommunicationCall
    listOfOcons[5] = CommunicationCall
    listOfOcons[8] = CommunicationCall
    return listOfOcons.map(e => e || null)
  }

  render() {
    const icons = this.createIcons()
    let {passport, physicalAddres, showPhysicalAddress} = this.props
    let icon = null
    let fields = passport.map(({value, label, valid, key, options}, index) => {
      icon = icons[index]
      return this.renderField({value, label, valid, key, options, index, icon}  )
    })
    let streetWithNumber = physicalAddres[0]
    icon = icons[passport.length]
    streetWithNumber.value = physicalAddres[0].value
    console.log('======= field ==== ', streetWithNumber.value, '\n \n ')
    fields.push(this.renderField({...streetWithNumber, icon, index: 8}))
    if (showPhysicalAddress) {
      physicalAddres.shift()
      fields = fields.concat(
        physicalAddres.map((field, i) => {
          let index = i + passport.length
          icon = icons[index]
          return this.renderField({...field, index, icon})
        }))
    }
    return (<div> {fields} </div>)
  }
}
