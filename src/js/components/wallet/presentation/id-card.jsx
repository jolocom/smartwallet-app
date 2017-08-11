import React from 'react'
import Radium from 'radium'

import {
  SocialPerson,
  MapsLocation,
  ImageCameraAlt,
  ActionLanguage,
  SocialCake
} from 'material-ui/svg-icons'
import moment from 'moment'
import { List, ListItem, FloatingActionButton } from 'material-ui'
import {theme} from 'styles'

import {
  EditAppBar,
  EditHeader,
  EditListItem,
  SelectCountryItem,
  SelectListItem,
  IconNumber,
  ImageItem,
  DateListItem
} from './ui'
import { Content } from '../../structure'

const STYLES = {
  verificationBlock: {
    color: theme.palette.textColor,
    fontSize: '24px'
  },
  verificationMsgHeader: {
    color: theme.palette.textColor
  },
  explanText: {
    fontSize: '14pt',
    lineHeight: '16pt',
    fontWeight: '300',
    color: theme.jolocom.gray2
  },
  flatBtn: {
    color: theme.palette.accent1Color,
    marginLeft: '-16px'
  },
  uploadContainer: {
    backgroundColor: theme.jolocom.gray5,
    textAlign: 'center',
    padding: '30px'
  },
  uploadBtn: {
    margin: '10px'
  },
  verifierLocationsMsg: {
    width: '100%',
    textAlign: 'center'
  }
}

@Radium
export default class WalletIdCard extends React.Component {
  static propTypes = {
    cancel: React.PropTypes.func,
    change: React.PropTypes.func,
    focusedGroup: React.PropTypes.string,
    focusedField: React.PropTypes.string,
    goToIdCardPhotoScreen: React.PropTypes.func,
    idCard: React.PropTypes.array,
    loaded: React.PropTypes.bool,
    physicalAddress: React.PropTypes.array,
    save: React.PropTypes.func,
    setFocused: React.PropTypes.func,
    showVerifierLocations: React.PropTypes.func,
    selectCountry: React.PropTypes.func,
    showVerifiers: React.PropTypes.func,
    showErrors: React.PropTypes.bool,
    showAddress: React.PropTypes.bool,
    verifierLocations: React.PropTypes.array
  }

  renderField(field) {
    switch (field.key) {
      case 'birthCountry':
      case 'country':
        return this.renderCountryField(field)
      case 'backSideImg':
      case 'frontSideImg':
        return this.renderImgField(field)
      case 'gender':
        return this.renderGenderField(field)
      case 'streetWithNumber':
        return this.renderStreetWithNumber(field)
      case 'zip':
        return this.renderCityAndZip(field)
      case 'city':
        return null // handled with zip
      case 'birthPlace':
        return null // handled with birthDate
      case 'birthDate':
        return this.renderBirthDate(field)
      case 'expirationDate':
        return this.renderDateField(field)
      default:
        return this.renderTextField(field)
    }
  }

  renderImgField({value, label, valid, key, options, index, icon, group}) {
    return <ImageItem
      id={key}
      key={key}
      value={value}
      label={label}
      focused={false}
      icon={icon}
      onFocusChange={() => this.props.setFocused(key, group)}
      types={options}
      onDelete={() => this.props.change(key, '')}
      fullWidth
      enableEdit
      onChange={(e, i, v) => this.props.change(key, v)} />
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

  renderStreetWithNumber({value, label, valid, key, index, icon, group}) { // eslint-disable-line max-len
    return (<div>
      <EditListItem
        id={key}
        icon={icon}
        label={this.props.showAddress ? label : 'Physical Address'}
        enableEdit
        value={value}
        underlineHide={!!value}
        onFocusChange={(field) => this.props.setFocused(field, group)}
        onChange={(e) => this.props.change(key, e.target.value)}
        focused={this.props.focusedGroup === group}
        enableDelete={value.length > 0}
        onDelete={() => {
          this.props.change(key, '')
        }} />
    </div>)
  }

  renderCityAndZip({value, label, valid, key, index, icon, group}) {
    const zip = this.props.physicalAddress[1]
    const city = this.props.physicalAddress[2]
    return (<table key={key} style={{width: '100%'}}>
      <tr>
        <td key="0" >
          <EditListItem
            id={key}
            label={city.label}
            enableEdit
            value={city.value}
            underlineHide={!!city.value}
            onFocusChange={(field) => this.props.setFocused(field, group)}
            onChange={(e) => this.props.change(city.key, e.target.value)}
            onDelete={() => {
              this.props.change(city.key, '')
            }}
            enableDelete={city.value.length > 0}
            focused={this.props.focusedGroup === group &&
              this.props.focusedField === key} />
        </td>
        <td key="1">
          <EditListItem
            widthTextField={{padding: '0 0px 0 4px'}}
            id={zip.key}
            label={zip.label}
            underlineHide={!!zip.value}
            enableEdit
            value={zip.value}
            onFocusChange={field => this.props.setFocused(field, group)}
            onChange={(e) => this.props.change(zip.key, e.target.value)}
            enableDelete={!!zip.value || !!value}
            onDelete={() => {
              this.props.change(zip.key, '')
            }} />
        </td>
      </tr>
    </table>)
  }

  renderBirthDate({value, label, valid, key, index, icon, group}) {
    const birthPlace = this.props.idCard[index + 1]

    return (<table key={key} style={{width: '100%'}}>
      <tr>
        <td key="0">
          <DateListItem
            icon={icon}
            label={label}
            enableEdit
            value={value || null}
            onFocusChange={(field) => this.props.setFocused(field, group)}
            focused={this.props.focusedGroup === group}
            onChange={(e, date) =>
              this.props.change(key, moment(date).format('YYYY-MM-DD'))} />
        </td>
        <td key="1">
          <EditListItem
            widthTextField={{padding: '0 0px 0 4px'}}
            id={birthPlace.key}
            label={birthPlace.label}
            enableEdit
            value={birthPlace.value}
            underlineHide={!!birthPlace.value}
            onFocusChange={(field) => this.props.setFocused(field, birthPlace.group)} // eslint-disable-line
            onChange={(e) => this.props.change(birthPlace.key, e.target.value)}
            onDelete={() => {
              this.props.change(birthPlace.key, '')
            }}
            enableDelete={!!birthPlace.value || !!value} />
        </td>
      </tr>
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
      onChange={(e, date) =>
        this.props.change(key, moment(date).format('YYYY-MM-DD'))} />
  }

  createIcons() {
    const idCardGroups = this.props.idCard.map(({group}) => group)
    let icons = [ActionLanguage]
    icons[idCardGroups.indexOf('img')] = ActionLanguage
    icons[idCardGroups.indexOf('numbers')] = IconNumber
    icons[idCardGroups.indexOf('person')] = SocialPerson
    icons[idCardGroups.indexOf('cake')] = SocialCake
    icons[idCardGroups.length] = MapsLocation
    return icons
  }

  render() {
    const icons = this.createIcons()
    const {idCard, physicalAddress, showAddress, loaded, save,
      cancel} = this.props
    const [{value: frontSideImg}, {value: backSideImg}] = idCard

    const address = showAddress ? physicalAddress : [physicalAddress[0]]
    const fields = [...idCard, ...address].map(
      (field, index) => this.renderField({...field, index, icon: icons[index]})
    )

    return (<div>
      <EditAppBar
        title="Add ID Card"
        loading={loaded}
        onSave={save}
        onClose={cancel} />
      <Content>
        <EditHeader title="ID Card" />
        <List>
          {
            frontSideImg === '' || backSideImg === ''
            ? <ListItem
              disabled
              innerDivStyle={{padding: '0 16px 0 54px'}}
              leftIcon={<img src="/img/ic_idcard.svg" />}>
              <div style={STYLES.uploadContainer}>
                <FloatingActionButton secondary style={STYLES.uploadBtn}>
                  <ImageCameraAlt
                    onClick={() => this.props.goToIdCardPhotoScreen()} />
                </FloatingActionButton>
                <div style={STYLES.explanText}>
                  Take a picture or upload one of your ID Cards
                </div>
              </div>
            </ListItem>
            : null
          }
        </List>
        <List>
          {fields}
        </List>
      </Content>
    </div>)
  }
}
