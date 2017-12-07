import React from 'react'
import PropTypes from 'prop-types';
import Radium from 'radium'
import List from 'material-ui/List'
import CommunicationCall from 'material-ui/svg-icons/communication/call.js'
import CommunicationEmail from 'material-ui/svg-icons/communication/email.js'
import Location from 'material-ui/svg-icons/maps/place'
import Loading from 'components/common/loading'
import {
  EditAppBar,
  EditHeader,
  EditListItem,
  AddNew,
  SelectCountryItem
} from './ui'

import { Content } from '../../structure'
import { theme } from 'styles'

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
    children: PropTypes.node,
    focused: PropTypes.string.isRequired,
    onFocusChange: PropTypes.func.isRequired,
    information: PropTypes.object.isRequired,
    updateInformation: PropTypes.func.isRequired,
    deleteInformation: PropTypes.func.isRequired,
    setInformation: PropTypes.func.isRequired,
    exitWithoutSaving: PropTypes.func.isRequired,
    saveChanges: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    showErrors: PropTypes.bool,
    addNewEntry: PropTypes.func.isRequired,
    confirm: PropTypes.func.isRequired,
    selectCountry: PropTypes.func.isRequired,
    setAddressField: PropTypes.func.isRequired
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
      {setInformation, updateInformation, deleteInformation, confirm,
      focused, showErrors, onFocusChange}
    ] = [field, this.props]
    const prefix = isNew ? 'newInformation' : 'originalInformation'
    const id = `${prefix}_${key}_${i}`
    const name = `${key}[${i}]`

    const actionValue = (key, e) => key === 'phones'
      ? ({value: e.target.value, type}) : e.target.value

    const confirmDelete = {
      title: 'Are you sure you want to delete a verified attribute?',
      message: 'Please confirm.',
      rightButtonLabel: 'DELETE',
      callback: () => deleteInformation(prefix, key, i),
      leftButtonLabel: 'CANCEL'
    }
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
        : confirm(confirmDelete)
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

  render() {
    const {loading, saveChanges, exitWithoutSaving} = this.props
    const {originalInformation, newInformation} = this.props.information
    const content = this.props.loading ? <Loading /> : this.renderContent()

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
          </List>
        </Content>
      </div>
    )
  }
}
