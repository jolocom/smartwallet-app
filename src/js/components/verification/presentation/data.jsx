import React from 'react'
import Radium from 'radium'

import Cake from 'material-ui/svg-icons/social/cake'
import Person from 'material-ui/svg-icons/social/person'
import Location from 'material-ui/svg-icons/maps/place'
import {List} from 'material-ui'

import {
  EditAppBar,
  EditHeader,
  EditListItem,
  SelectCountryItem,
  SelectListItem,
  IconNumber,
  DateListItem
} from './ui'

import {Content, Header} from '../../structure'

@Radium
export default class VerificationDataPresentation extends React.Component {
  static propTypes = {
    verify: React.PropTypes.func,
    showVerifierLocations: React.PropTypes.func,
    change: React.PropTypes.func,
    selectCountry: React.PropTypes.func,
    cancel: React.PropTypes.func,
    showVerifiers: React.PropTypes.func,
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
        return null // handled with birthDate or streetWithNumber
      case 'birthDate':
        return this.renderBirthDate(field)
      case 'streetWithNumber':
        return this.renderStreetAndZipFields(field)
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
      value={value}
      onFocusChange={(field) => this.props.setFocused(field, group)}
      showErrors={!valid && this.props.showErrors}
      valid={valid}
      onChange={(e) => this.props.change(key, e.target.value)}
      focused={this.props.focusedGroup === group && !!icon}
      onDelete={() => this.props.change(key, '')}
      enableDelete={value.length > 0} />
  }

  renderStreetAndZipFields({value, label, valid, key, index, icon, group}) {
    return (<table key={key} style={{width: '100%'}} ><tbody> <tr>
      <td style={{width: '70%', position: 'fix'}} key="0" >
        {this.renderTextField({value, label, valid, key, index, icon, group})}
      </td>
      <td style={{width: '30%', position: 'fix'}} key="1">
        {this.renderTextField(this.props.physicalAddress[1])}
      </td>
    </tr> </tbody> </table>)
  }

  renderBirthDate({value, label, valid, key, index, icon, group}) {
    return (<table key={key} style={{width: '100%'}}> <tbody><tr>
      <td key="0" style={{width: '70%', position: 'fix'}}>
        {this.renderTextField({value, label, valid, key, index, icon, group})}
      </td>
      <td key="1" style={{width: '30%', position: 'fix'}}>
        {this.renderTextField(this.props.idCard[index + 1])}
      </td>
    </tr></tbody> </table>)
  }

  renderDateField({value, label, valid, key, index, icon, group}) {
    return <DateListItem
      key={key}
      icon={icon}
      label={label}
      name={key}
      value={value}
      onFocusChange={(field) => this.props.setFocused(field, group)}
      showErrors={!valid && this.props.showErrors}
      valid={valid}
      focused={this.props.focusedGroup === group}
      onDelete={() => { this.props.change(key, '') }}
      enableDelete={value.toString().length > 0}
      onChange={(event, date) => this.props.change(key, date)} />
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
    const {idCard, physicalAddress, showAddress, verify, cancel} = this.props

    const addressFields = showAddress ? physicalAddress : physicalAddress[0]

    const fields = idCard.concat(addressFields).map(
      (field, index) => this.renderField({...field, index, icon: icons[index]}))

    return (<div>
      <EditAppBar
        title="DATA CHECK"
        rightTitle="VERIFFY"
        onSave={verify}
        onClose={cancel} />
      <Header style={{textAlign: 'center'}}>STEP 2</Header>
      <Content style={{textAlign: 'center'}}>
        Please fill in the following ID Card details for further verfication.
      </Content>
      <Content>
        <EditHeader title="ID Card" />
        <List>
          {fields}
        </List>
      </Content>
    </div>)
  }
}
