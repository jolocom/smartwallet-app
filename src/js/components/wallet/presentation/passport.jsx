import React from 'react'
import Radium from 'radium'

import Cake from 'material-ui/svg-icons/social/cake'
import Person from 'material-ui/svg-icons/social/person'
import Location from 'material-ui/svg-icons/maps/place'
import {List, SelectField, MenuItem} from 'material-ui'
// import DatePicker from 'material-ui/DatePicker'

import {
  EditAppBar,
  EditHeader,
  EditListItem,
  SelectListItem,
  DateListItem
} from './ui'
import {Content} from '../../structure'
// import {theme} from 'styles'

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
    focusedGroup: React.PropTypes.string.isRequired,
    focusedField: React.PropTypes.string.isRequired,
    setFocused: React.PropTypes.func.isRequired,
    showErrors: React.PropTypes.bool.isRequired,
    showAddress: React.PropTypes.bool.isRequired,
    showPhysicalAddress: React.PropTypes.bool.isRequired,
    physicalAddres: React.PropTypes.array.isRequired,
    passport: React.PropTypes.array.isRequired
  }

  renderField(field) {
    switch (field.key) {
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
      id={key}
      icon={icon}
      iconStyle={{maxWidth: '400px'}}
      value={value}
      label={label}
      name={key}
      onFocus={() => this.props.setFocused(key)}
      fullWidth
      types={options}
      enableEdit
      onDelete={() => this.props.change(key, '')}
      enableDelete={value.length > 0}
      onChange={(e, i, v) => this.props.change(key, v)}
      autoWidth />
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
      onFocus={() => this.setFocused(key)}
      onFocusChange={() => this.setFocused(key)}
      showErrors={!valid && this.props.showErrors}
      valid={valid}
      verified={false}
      onChange={(e) => this.props.change(key, e.target.value)}
      focused={this.props.focusedField === key}
      onDelete={() => this.props.change(key, '')}
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
      onFocus={() => this.setFocused(key)}
      onFocusChange={() => this.setFocused(key)}
      showErrors={!valid && this.props.showErrors}
      valid={valid}
      verified={false}
      focused={this.props.focusedField === key}
      onDelete={() => this.props.change(key, '')}
      enableDelete={value.length > 0}
      errorText={'errorText'}
      onChange={(e, date) => this.props.change(key, date)} />
  }

  renderOptionsField({value, label, valid, key, options, index, icon}) {
    return <SelectField
      floatingLabelText={label}
      id={key}
      key={key}
      value={value}
      fullWidth
      onFocus={() => this.setFocused(key)}
      onFocusChange={() => this.setFocused(key)}
      onChange={(e, i, v) => this.props.change(key, v)}
      autoWidth >
      {options.map((e, i) => <MenuItem key={i} value={e} primaryText={e} />)}
    </ SelectField>
  } // person location cake

  createIcons() {
    let listOfOcons = [Cake]
    const passportKeys = this.props.passport.map(({key}) => key)

    listOfOcons[passportKeys.indexOf('firstName')] = Person
    listOfOcons[passportKeys.indexOf('birthDate')] = Cake
    listOfOcons[passportKeys.length] = Location
    return listOfOcons.map(e => e || null)
  }

  render() {
    const icons = this.createIcons()
    let {
      passport,
      physicalAddres,
      showAddress,
      loaded,
      save,
      cancel
    } = this.props
    let icon = null
    let fields = passport.map(({value, label, valid, key, options}, index) => {
      icon = icons[index]
      return this.renderField({value, label, valid, key, options, index, icon})
    })
    let streetWithNumber = physicalAddres[0]
    icon = icons[passport.length]
    streetWithNumber.value = physicalAddres[0].value
    fields.push(this.renderField({...streetWithNumber, icon, index: 8}))
    if (showAddress) {
      physicalAddres.shift()
      fields = fields.concat(
        physicalAddres.map((field, i) => {
          let index = i + passport.length + 1// the 1 is for the shifted element
          icon = icons[index]
          return this.renderField({...field, index, icon})
        }))
    }
    return (<div>
      <EditAppBar
        title="Add ID Card"
        loading={loaded}
        onSave={cancel}
        onClose={cancel} />
      <Content>
        <EditHeader title="ID Card" />
        <List>
          {fields}
        </List>
      </Content>
    </div>
    )
  }
}
