/* eslint-disable */
import React from 'react'
import Radium from 'radium'

import {EditAppBar, EditHeader, EditListItem, AddNew} from './ui'
import {Content} from '../../structure'
import {theme} from 'styles'
import CommunicationCall from 'material-ui/svg-icons/communication/call'
import CommunicationEmail from 'material-ui/svg-icons/communication/email'
import {TextField, SelectField, MenuItem} from 'material-ui'

@Radium
export default class WalletPassport extends React.Component {
  static propTypes = {
    save: React.PropTypes.node,
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
        return this.renderOptionsField(field)
      case 'birthDate':
      case 'expirationDate':
        return this.renderDateField(field)
      default:
        return this.renderTextField(field)
    }
  }

  renderTextField({value, label, valid, key}) {
    return <EditListItem
       key={key + '_' + value}
       id={'value'}
       iconStyle={{maxWidth: '400px'}}
       label={label}
       name={key}
       enableEdit
       value={value}
       showErrors={!valid}
       valid={valid}
       verified={false}
       onChange={(e) => this.props.change(key, e.target.value)}
       focused
       onDelete={() => this.props.change(key, '')}
       enableDelete={value.length > 0}
       errorText={'errorText'} />
  }

  renderDateField({value, label, valid, key}) {
    return <DatePicker
      hintText={label}
       />
  }

  renderOptionsField({value, label, valid, key, options}) {
    <SelectField
      floatingLabelText="Frequency"
      value={value}
      fullWidth
      onChange={(e,i,v) => this.props.change(key, v)}
      autoWidth={true}
    >
      {options.map((e, i)=> <MenuItem ket={i} value={e} primaryText={e} />)}
    </SelectField>
  }

  render() {
    let {passport, physicalAddres} = this.props

    let a = passport.map(({value, label, valid, key, options}, i) => key !== 'gender'
     ? <EditListItem
      key={i}
      id={'id'}
      iconStyle={{maxWidth: '400px'}}
      label={label}
      name={'name'}
      enableEdit
      value={value}
      showErrors={false}
      valid={false}
      verified={false}
      onChange={(e) => this.props.change(key, e.target.value)}
      focused
      onDelete={() => this.props.change(key, '')}
      enableDelete={value.length > 0}
      errorText={'errorText'} />
    :  <SelectField
          floatingLabelText="Frequency"
          value={value}
          fullWidth
          onChange={(e,i,v) => this.props.change(key, v)}
          autoWidth={true}
        >
          {options.map((e, i)=> <MenuItem ket={i} value={e} primaryText={e} />)}
        </SelectField>
    )

    return (<div> {a} </div>)
  }
}
