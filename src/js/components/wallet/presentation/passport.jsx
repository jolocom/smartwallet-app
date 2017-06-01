import React from 'react'
import Radium from 'radium'

import Cake from 'material-ui/svg-icons/social/cake'
import Person from 'material-ui/svg-icons/social/person'
import Location from 'material-ui/svg-icons/maps/place'
import {List, SelectField, MenuItem, FlatButton} from 'material-ui'

import {
  EditAppBar,
  EditHeader,
  EditListItem,
  SelectListItem,
  DateListItem
} from './ui'
import {Content, Block} from '../../structure'

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

  renderCountryField({value, label, valid, key, options, index, icon, group}) {
    return <SelectListItem
      floatingLabelText={label}
      key={key}
      id={key}
      icon={icon}
      value={value}
      label={label}
      name={key}
      onFocusChange={(field) => this.props.setFocused(field, group)}
      fullWidth
      types={options}
      enableEdit
      onDelete={() => this.props.change(key, '')}
      enableDelete={value.length > 0}
      onChange={(e, i, v) => this.props.change(key, v)}
      autoWidth />
  }

  renderTextField({value, label, valid, key, index, icon, group}) {
    return <EditListItem
      icon={icon}
      key={key}
      id={key}
      label={label}
      name={key}
      enableEdit
      value={value}
      onFocusChange={(field) => this.props.setFocused(field, group)}
      showErrors={!valid && this.props.showErrors}
      valid={valid}
      verified={false}
      onChange={(e) => this.props.change(key, e.target.value)}
      focused={this.props.focusedGroup === group}
      onDelete={() => this.props.change(key, '')}
      enableDelete={value.length > 0}
      errorText={'errorText'} />
  }

  renderDateField({value, label, valid, key, index, icon, group}) {
    return <DateListItem
      key={key}
      icon={icon}
      label={label}
      name={key}
      enableEdit
      value={value}
      onFocusChange={(field) => this.props.setFocused(field, group)}
      showErrors={!valid && this.props.showErrors}
      valid={valid}
      verified={false}
      focused={this.props.focusedGroup === group}
      onDelete={() => { this.props.change(key, '') }}
      enableDelete={value.toString().length > 0}
      errorText={'errorText'}
      onChange={(e, date) => this.props.change(key, date)} />
  }

  renderOptionsField({value, label, valid, key, options, group, index, icon}) {
    return (<SelectField
      floatingLabelText={label}
      id={key}
      key={key}
      value={value}
      fullWidth
      focused={this.props.focusedGroup === group}
      onFocusChange={(field) => this.props.setFocused(field, group)}
      onChange={(e, i, v) => this.props.change(key, v)}
      onDelete={() => this.props.change(key, '')}
      autoWidth >
      {options.map((e, i) => <MenuItem key={i} value={e} primaryText={e} />)}
    </SelectField>)
  }

  createIcons() {
    const passportGroups = this.props.passport.map(({group}) => group)
    let listOfOcons = [Cake]
    listOfOcons[passportGroups.indexOf('person')] = Person
    listOfOcons[passportGroups.indexOf('cake')] = Cake
    listOfOcons[passportGroups.length] = Location
    return listOfOcons.map(e => e || null)
  }

  render() {
    const icons = this.createIcons()
    const {
      passport,
      physicalAddres,
      showAddress,
      loaded,
      save,
      cancel
    } = this.props
    let fields = passport.map((field, index) => this.renderField({
      ...field,
      index,
      icon: icons[index]
    }))
    const streetWithNumber = Object.assign({}, physicalAddres[0], {
      icon: icons[passport.length],
      index: passport.length
    })
    fields.push(this.renderField(streetWithNumber))
    if (showAddress) {
      physicalAddres.shift()
      fields = fields.concat(physicalAddres.map((field, i) => this.renderField({
        ...field,
        index: i + passport.length + 1,
        icon: icons[i + passport.length + 1]
      })))
    }

    return (<div>
      <EditAppBar
        title="Add ID Card"
        loading={loaded}
        onSave={save}
        onClose={cancel} />
      <Block>
        <div>
          Request personal verification of your Passport/ID Card by an
          instutioon Close to your location
        </div>
        <FlatButton
          label="List Of Locations"
          onSubmit={this.props.showVerifiers} />
      </Block>
      <Content>
        <EditHeader title="ID Card" />
        <List>
          {fields}
        </List>
      </Content>
    </div>)
  }
}
