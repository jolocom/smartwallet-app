import React from 'react'
import Radium from 'radium'

import {theme} from 'styles'
import {List} from 'material-ui'

import {
  CommunicationCall,
  CommunicationEmail
} from 'material-ui/svg-icons'
import Location from 'material-ui/svg-icons/maps/place'

import Loading from 'components/common/loading'
import { Content } from '../../structure'
import {
  EditAppBar,
  EditHeader,
  EditListItem,
  AddNew,
  SelectCountryItem
} from './ui'

const STYLES = {
  title: {
    padding: '0 24px',
    color: theme.palette.textColor,
    fontWeight: '100'
  },
  titleDivider: {
    marginTop: '10px'
  },
  spinner: {
    position: 'absolute',
    top: '50%',
    left: '50%'
  }
}

@Radium
export default class WalletContact extends React.Component {
  static propTypes = {
    children: React.PropTypes.node,
    focused: React.PropTypes.string.isRequired,
    onFocusChange: React.PropTypes.func.isRequired,
    information: React.PropTypes.object.isRequired,
    updateInformation: React.PropTypes.func.isRequired,
    deleteInformation: React.PropTypes.func.isRequired,
    setInformation: React.PropTypes.func.isRequired,
    exitWithoutSaving: React.PropTypes.func.isRequired,
    saveChanges: React.PropTypes.func.isRequired,
    loading: React.PropTypes.bool.isRequired,
    showErrors: React.PropTypes.bool,
    addNewEntry: React.PropTypes.func.isRequired,
    confirm: React.PropTypes.func.isRequired,
    selectCountry: React.PropTypes.func.isRequired,
    setAddressField: React.PropTypes.func.isRequired,
    close: React.PropTypes.func.isRequired
  }

  renderContent() {
    return (
      <div>
        {this.renderFields({
          key: 'phones',
          label: 'Phone Number',
          errorText: 'Invalid phone number',
          addText: 'Add phone number',
          icon: CommunicationCall
        })}
        {this.renderFields({
          key: 'emails',
          label: 'Email Address',
          errorText: 'Invalid email address',
          addText: 'Add email address',
          icon: CommunicationEmail
        })}
      </div>
    )
  }
  renderField(i, field) {
    const [
      {key, label, value, type, verified, valid, errorText, icon, isNew},
      {setInformation, updateInformation, deleteInformation, close, confirm,
      focused, showErrors, onFocusChange}
    ] = [field, this.props]
    const prefix = isNew ? 'newInformation' : 'originalInformation'
    const id = `${prefix}_${key}_${i}`
    const name = `${key}[${i}]`

    const actionValue = (key, e) => key === 'phones'
      ? ({value: e.target.value, type}) : e.target.value

    const types = ((field) => {
      switch (key) {
        case 'phones':
          return [
            'personal',
            'work'
          ]
        default:
          return
      }
    })()
    return (<EditListItem
      key={id}
      id={key}
      icon={icon}
      iconStyle={STYLES.icon}
      label={label}
      name={name}
      enableEdit={!verified}
      value={value}
      types={types}
      type={type}
      showErrors={showErrors}
      valid={valid}
      verified={verified}
      focused={focused === key}
      enableDelete
      errorText={errorText}
      onFocusChange={(key) => onFocusChange(key)}
      onChange={(e) => isNew
        ? setInformation(key, i, actionValue(key, e))
        : updateInformation(key, i, actionValue(key, e))
      }
      onDelete={() => (isNew || !verified)
        ? deleteInformation(prefix, key, i)
        : confirm(
          'Are you sure you want to delete a verified email?',
          'Delete',
          () => {
            deleteInformation(prefix, key, i)
            close()
          })
      }
      onTypeChange={(type) => {
        isNew ? setInformation(key, i, {value, type})
          : updateInformation(key, i, {value, type})
      }} />)
  }

  renderFields({key, label, icon, errorText, addText}) {
    let fields = []

    const {originalInformation, newInformation} = this.props.information
    const {loading, addNewEntry, onFocusChange} = this.props

    let firstElementToAppear
    let indexIcon
    if (!loading) {
      if (originalInformation[key].length > 0) {
        firstElementToAppear = originalInformation[key]
          .find(element => !element.delete)
        indexIcon = originalInformation[key].indexOf(firstElementToAppear)
        fields.push(
          originalInformation[key].map((field, i) => {
            if (!field.delete) {
              return this.renderField(i, {
                key,
                label,
                icon: i === indexIcon && icon,
                value: field.value,
                type: field.type,
                verified: !!field.verified,
                valid: field.valid,
                errorText,
                isNew: false
              })
            }
          })
        )
      }
      if (newInformation[key].length > 0) {
        if (!firstElementToAppear) {
          firstElementToAppear = newInformation[key]
            .find(element => !element.delete)
          indexIcon = newInformation[key].indexOf(firstElementToAppear)
        }
        fields.push(
          newInformation[key].map((field, i) => {
            if (!field.delete) {
              return this.renderField(i, {
                key,
                label,
                icon: i === indexIcon && icon,
                value: field.value,
                type: field.type,
                verified: !!field.verified,
                valid: field.valid,
                errorText,
                isNew: true
              })
            }
          })
        )
      }
    }
    if (originalInformation[key].length > 0 || newInformation[key].length > 0 && newInformation[key][0].value !== '') { // eslint-disable-line max-len
      fields.push(<AddNew key={`add_${key}`} onClick={() => {
        addNewEntry(key, newInformation[key].length)
        onFocusChange(`newInformation_${key}`)
      }}
        value={addText} />)
    }
    return (<div>
      {fields}
    </div>)
  }

  renderAddressField({streetWithNumber, zip, country, city, state, id, age, index}) { // eslint-disable-line max-len
    id = id || `address_${age}_${index}`
    const blank = [streetWithNumber, city, country, zip, state]
      .every(({value}) => value.trim().length === 0)
    const addressFieldsVisibility = this.props.focused === id || !blank
    const {onFocusChange, setAddressField, focused, selectCountry} = this.props

    return (<div key={id}>
      <EditListItem
        key="streetWithNumber"
        id={id}
        icon={Location}
        iconStyle={STYLES.icon}
        value={streetWithNumber.value}
        label={addressFieldsVisibility ? 'Street' : 'Physical Address'}
        enableEdit
        showErrors
        onFocusChange={() => onFocusChange(id)}
        onDelete={(evt) => setAddressField(
          'newInformation', 'streetWithNumber', index, '')}
        onChange={(e) =>
          setAddressField(
            'newInformation', 'streetWithNumber', index, e.target.value)}
        focused={focused === id}
        enableDelete={streetWithNumber.value.length > 0} />
        {
          addressFieldsVisibility ? <div>
            <table style={{width: '100%'}}><tbody>
              <tr><td style={{width: '70%'}} key="city">
                <EditListItem
                  id={id}
                  focused={false}
                  label="City"
                  enableEdit
                  value={city.value}
                  onFocusChange={() => onFocusChange(id)}
                  onDelete={() => this.props
                    .setAddressField('newInformation', 'city', index, '')}
                  onChange={(evt) => setAddressField(
                    'newInformation', 'city', index, evt.target.value)}
                  enableDelete={city.value.length > 0} />
              </td><td style={{width: '30%'}} key="zip">
                <EditListItem
                  id={id}
                  label="Zip"
                  enableEdit
                  value={zip.value}
                  focused={false}
                  onFocusChange={(field) => onFocusChange(id)}
                  onChange={(e) =>
                  setAddressField(
                  'newInformation', 'zip', index, e.target.value)}
                  onDelete={() => setAddressField(
                    'newInformation', 'zip', index, '')}
                  enableDelete={zip.value.length > 0} />
              </td></tr>
            </tbody></table>
            <EditListItem
              id={id}
              label="State"
              enableEdit
              focused={false}
              enableDelete={state.value.length > 0}
              value={state.value}
              onFocusChange={() => onFocusChange(id)}
              onChange={(e) =>
              setAddressField(
                'newInformation', 'state', index, e.target.value)}
              onDelete={() => setAddressField(
                'newInformation', 'state', index, '')} />
            <SelectCountryItem
              id={id}
              value={country.value}
              focused={false}
              label="Country"
              onChange={() => {}}
              onFocusChange={() => {
                onFocusChange(id)
                selectCountry('newInformation', index, '')
              }}
              onDelete={() => {
                setAddressField('newInformation', 'country', index, '')
                onFocusChange(id)
              }}
              enableEdit
              enableDelete={country.value.length > 0} />
          </div> : null
        }
    </div>)
  }
  render() {
    let content
    const {loading, saveChanges, exitWithoutSaving} = this.props
    const {originalInformation, newInformation} = this.props.information
    let addressFields
    let addNewAddress
    if (originalInformation) {
      if (originalInformation.addresses.length > 0 || newInformation.addresses.length > 0 && newInformation.addresses[0].streetWithNumber.value !== '') { // eslint-disable-line max-len
        addNewAddress = (<AddNew key="add_address" onClick={() => {
          this.props.addNewEntry('addresses', newInformation.addresses.length)
          this.props.onFocusChange(`address_newInformation_${newInformation.addresses.length}`) // eslint-disable-line max-len
        }}
          value="ADD NEW ADDRESS" />)
      }
    } else {
      addNewAddress = null
    }
    if (this.props.loading) {
      content = <Loading />
    } else {
      content = this.renderContent()
      addressFields = [
        ...originalInformation.addresses.map((address, index) =>
        this.renderAddressField({...address, age: 'originalInformation', index})), // eslint-disable-line max-len
        ...newInformation.addresses.map((address, index) =>
        this.renderAddressField({...address, age: 'newInformation', index})),
        addNewAddress
      ]
    }

    return (
      <div>
        <EditAppBar
          title="Edit Contact"
          loading={loading}
          onSave={saveChanges}
          onClose={exitWithoutSaving} />
        <Content>
          <EditHeader title="Contact" />
          <List>
            {content}
            {addressFields}
          </List>
        </Content>
      </div>
    )
  }
}
