import React from 'react'
import Radium from 'radium'

import Cake from 'material-ui/svg-icons/social/cake'
import Person from 'material-ui/svg-icons/social/person'
import Location from 'material-ui/svg-icons/maps/place'
import {List, SelectField, MenuItem, FlatButton} from 'material-ui'
import {theme} from 'styles'

import {
  EditAppBar,
  EditHeader,
  EditListItem,
  SelectCountryItem,
  SelectListItem,
  IconNumber,
  DateListItem
} from './ui'
import {Content, Block} from '../../structure'

const STYLES = {
  verificationBlock: {
    color: theme.palette.textColor,
    fontSize: '24px'
  },
  verificationMsgHeader: {
    color: theme.palette.textColor
  }
}
@Radium
export default class WalletIdCard extends React.Component {
  static propTypes = {
    save: React.PropTypes.func,
    showVerifierLocations: React.PropTypes.func,
    change: React.PropTypes.func,
    selectCountry: React.PropTypes.func,
    cancel: React.PropTypes.func,
    showVerifiers: React.PropTypes.func,
    loaded: React.PropTypes.bool,
    focusedGroup: React.PropTypes.string,
    focusedField: React.PropTypes.string,
    setFocused: React.PropTypes.func,
    verifierLocations: React.PropTypes.array,
    showErrors: React.PropTypes.bool,
    showAddress: React.PropTypes.bool,
    physicalAddress: React.PropTypes.array,
    idCard: React.PropTypes.array
  }

  renderField(field) {
    switch (field.key) {
      case 'birthCountry':
      case 'country':
        return this.renderCountryField(field)
      case 'gender':
        return this.renderGenderField(field)
      case 'zip':
      case 'birthPlace':
        return null // handled with birthDate or streetWithNumber fields
      case 'birthDate':
        return this.renderBirthDate(field)
      case 'streetWithNumber':
        return this.renderStreetWithNumberAndZipFields(field)
      case 'expirationDate':
        return this.renderDateField(field)
      default:
        return this.renderTextField(field)
    }
  }

  renderGenderField({value, label, valid, key, options, index, icon, group}) {
    return <SelectListItem
      id={key}
      key={key}
      value={value}
      label={label}
      focused={false}
      onFocusChange={() => this.props.setFocused(key, group)}
      types={options}
      onDelete={() => this.props.change(key, '')}
      fullWidth
      enableEdit
      enableDelete={value.length > 0}
      onChange={(e, i, v) => this.props.change(key, v)} />
  }

  renderCountryField({value, label, valid, key, options, index, icon, group}) {
    return <SelectCountryItem
      id={key}
      key={key}
      icon={icon}
      value={value}
      label={label}
      onFocusChange={() => {
        this.props.setFocused(key, group)
        this.props.selectCountry(key)
      }}
      types={options}
      onDelete={() => this.props.change(key, '')}
      fullWidth
      enableEdit
      focused={false}
      enableDelete={value.length > 0}
      onChange={() => this.props.change(key, '')} />
  }

  renderTextField({value, label, valid, key, index, icon, group}) {
    return <EditListItem
      icon={icon}
      key={key}
      id={key}
      label={label}
      underlineHide={!!value}
      name={key}
      enableEdit
      value={value}
      onFocusChange={(field) => this.props.setFocused(field, group)}
      showErrors={!valid && this.props.showErrors}
      valid={valid}
      verified={false}
      onChange={(e) => this.props.change(key, e.target.value)}
      focused={this.props.focusedGroup === group && !!icon}
      onDelete={() => this.props.change(key, '')}
      enableDelete={value.length > 0} />
  }

  renderStreetWithNumberAndZipFields({value, label, valid, key, index, icon, group}) { // eslint-disable-line max-len
    const zip = this.props.physicalAddress[1]
    return (<table key={key}> <tr>
      <td style={{width: '70%'}} key="0" >
        <EditListItem
          id={key}
          icon={icon}
          label={label}
          enableEdit
          value={value}
          underlineHide={!!value}
          onFocusChange={(field) => this.props.setFocused(field, group)}
          onChange={(e) => this.props.change(key, e.target.value)}
          focused={this.props.focusedGroup === group} />
      </td>
      <td style={{width: '30%'}} key="1">
        <EditListItem
          id={zip.key}
          label={zip.label}
          underlineHide={!!zip.value}
          enableEdit
          value={zip.value}
          onFocusChange={field => this.props.setFocused(field, zip.group)}
          onChange={(e) => this.props.change(zip.key, e.target.value)}
          onDelete={() => {
            this.props.change(zip.key, '')
            this.props.change(key, '')
          }}
          enableDelete={!!zip.value || !!value} />
      </td> </tr>
    </table>)
  }

  renderBirthDate({value, label, valid, key, index, icon, group}) {
    const birthPlace = this.props.idCard[index + 1]

    return (<table key={key} style={{width: '100%'}}>
      <th key="0" style={{width: '70%'}}>
        <DateListItem
          icon={icon}
          label={label}
          enableEdit
          value={value || null}
          onFocusChange={(field) => this.props.setFocused(field, group)}
          focused={this.props.focusedGroup === group}
          onChange={(e, date) => this.props.change(key, date)} />
      </th>
      <th key="1" style={{width: '30%', position: 'fix'}}>
        <EditListItem
          id={birthPlace.key}
          label={birthPlace.label}
          enableEdit
          value={birthPlace.value}
          underlineHide={!!value}
          onFocusChange={(field) => this.props.setFocused(field, birthPlace.group)} // eslint-disable-line
          onChange={(e) => this.props.change(birthPlace.key, e.target.value)}
          onDelete={() => {
            this.props.change(birthPlace.key, '')
            this.props.change(key, '')
          }}
          enableDelete={!!birthPlace.value || !!value} />
      </th>
    </table>)
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
    const idCardGroups = this.props.idCard.map(({group}) => group)
    let icons = [IconNumber]
    icons[idCardGroups.indexOf('person')] = Person
    icons[idCardGroups.indexOf('cake')] = Cake
    icons[idCardGroups.length] = Location
    return icons
  }

  render() {
    const icons = this.createIcons()
    const {idCard, physicalAddress, showAddress, loaded, save, cancel,
      showVerifierLocations} = this.props

    let address = physicalAddress[0]
    if (showAddress) { address = physicalAddress }

    const fields = idCard.concat(address).map(
      (field, index) => this.renderField({...field, index, icon: icons[index]})
    )

    return (<div>
      <EditAppBar
        title="Add ID Card"
        loading={loaded}
        onSave={save}
        onClose={cancel} />
      <Block style={STYLES.verificationBlock}>
        <Block>
          Request personal verification of <br />
          your IdCard/ID Card by an <br />
          instutioon Close to your location
        </Block>
        <FlatButton
          label="List Of Locations"
          onClick={e => {
            showVerifierLocations(this.verifierLocationsMsg())
          }} />
      </Block>
      <Content>
        <EditHeader title="ID Card" />
        <List>
          {fields}
        </List>
      </Content>
    </div>)
  }

  verifierLocationsMsg = () => (
    <div>
      <div key="0" style={{width: '100%', textAlign: 'center'}}>
        verification Locations
      </div>
      <div key="1"> Title </div>
      <div key="2"> Street With Number </div>
      <div key="3"> Zip </div>
      <div key="4"> City </div>
    </div>
  )
}
