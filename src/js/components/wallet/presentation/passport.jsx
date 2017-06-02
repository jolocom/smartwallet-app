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
  SelectListItem,
  DateListItem
} from './ui'
import {Content, Block} from '../../structure'

const STYLES = {
  verificationBlock: {
    color: theme.palette.textColor,
    fontSize: '24',
    textAlign: 'center'
  }
}
@Radium
export default class WalletPassport extends React.Component {
  static propTypes = {
    save: React.PropTypes.func.isRequired,
    showVerifierLocations: React.PropTypes.func.isRequired,
    change: React.PropTypes.func.isRequired,
    selectCountry: React.PropTypes.func.isRequired,
    cancel: React.PropTypes.func.isRequired,
    showVerifiers: React.PropTypes.func.isRequired,
    loaded: React.PropTypes.bool.isRequired,
    focusedGroup: React.PropTypes.string.isRequired,
    focusedField: React.PropTypes.string.isRequired,
    setFocused: React.PropTypes.func.isRequired,
    showErrors: React.PropTypes.bool.isRequired,
    showAddress: React.PropTypes.bool.isRequired,
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
      case 'zip':
      case 'birthPlace':
        return null // handled birthDate and city
      case 'birthDate':
        return this.renderBirthDate(field)
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
      onFocusChange={() => {
        this.props.setFocused(key, group)
        this.props.selectCountry(key)
      }}
      fullWidth
      types={options}
      enableEdit
      onDelete={() => this.props.change(key, '')}
      enableDelete={value.length > 0}
      onChange={() => this.props.change(key, '')}
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

  renderBirthDate({value, label, valid, key, index, icon, group}) {
    let field = this.renderTextField({...this.props.passport[index + 1],
      index: index + 1,
      icon: null
    })
    return (<table style={{width: '100%'}}>
      <td style={{width: '70%'}}>
        <DateListItem
          birthDate
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
          errorText={'errorText'}
          onChange={(e, date) => this.props.change(key, date)} />
      </td>
      <td style={{width: '30%', position: 'fix'}}>
        {field
      }
      {console.log('===============')}
      </td>
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
    const {passport, physicalAddres, showAddress, loaded, save, cancel
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
      <Block style={STYLES.verificationBlock}>
        <Block>
          Request personal verification of <br />
          your Passport/ID Card by an <br />
          instutioon Close to your location
        </Block>
        <FlatButton
          label="List Of Locations"
          onClick={e => {
            this.props.showVerifierLocations()
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
}
