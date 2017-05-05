import React from 'react'
import Radium from 'radium'
import {
  EditAppBar,
  EditHeader,
  EditListItem,
  AddNew
} from './ui'
import {
  Content,
  Block
} from '../../structure'
import {theme} from 'styles'
import CommunicationCall from 'material-ui/svg-icons/communication/call'
import CommunicationEmail from 'material-ui/svg-icons/communication/email'
import {
  List
} from 'material-ui'
import Formsy from 'formsy-react'

import Loading from 'components/common/loading'

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
    close: React.PropTypes.func.isRequired
  }

  renderContent() {
    return (
      <div>
        {this.renderFields({
          key: 'phoneNumbers',
          label: 'Phone Number',
          errorText: 'Invalid phone number',
          addText: 'Add phone number',
          icon: CommunicationCall

        })}
        {this.renderFields({
          key: 'emails',
          label: 'Email Address',
          errorText: 'Invalid email address',
          addText: 'Add another email',
          icon: CommunicationEmail
        })}
      </div>
    )
  }

  renderField(i, field) {
    let {
      key,
      label,
      value,
      types,
      type,
      verified,
      icon,
      isNew
    } = field

    const prefix = isNew ? 'newInformation' : 'originalInformation'
    const id = `${prefix}_${key}_${i}`
    const name = `${key}[${i}]`

    return (
      <EditListItem
        key={id}
        id={id}
        icon={icon}
        iconStyle={STYLES.icon}
        label={label}
        name={name}
        value={value}
        types={types}
        type={type}
        verified={verified}
        focused={this.props.focused === key}
        enableEdit={isNew}
        enableDelete
        onFocusChange={() => {
          if (isNew) {
            this.props.addNewEntry(key)
          }
          this.props.onFocusChange(key)
        }}
        onChange={(e) => {
          if (isNew) {
            this.props.setInformation(key, i, e.target.value)
          } else {
            this.props.updateInformation(key, i, e.target.value)
          }
        }}
        onDelete={() => {
          if (!isNew && verified) {
            this.props.confirm(
              'Are you sure you want to delete a verified email?',
              'Delete', () => {
                this.props.deleteInformation(prefix, key, i)
                this.props.close()
              }
            )
          } else {
            this.props.deleteInformation(prefix, key, i)
          }
        }}
        />
    )
  }

  renderFields({key, label, icon, errorText, addText}) {
    let fields = []

    const {originalInformation, newInformation} = this.props.information

    const getValue = (field) => {
      switch (key) {
        case 'phoneNumbers':
          return field.number
        case 'emails':
          return field.address
        default:
          return field.value
      }
    }

    const getTypes = (field) => {
      switch (key) {
        case 'phoneNumbers':
          return [
            'mobile',
            'private',
            'work',
            'fax',
            'other'
          ]
        case 'emails':
          return [
            'private',
            'work',
            'other'
          ]
        default:
          return
      }
    }

    if (this.props.loading === false) {
      fields.push(
        originalInformation[key].map((field, i) => {
          if (!field.delete) {
            return this.renderField(i, {
              key,
              label,
              icon: i === 0 && icon,
              value: getValue(field),
              type: field.type,
              types: getTypes(field),
              verified: !!field.verified,
              errorText,
              isNew: false
            })
          }
        })
      )

      fields.push(
        newInformation[key].map((field, i) => {
          if (!field.delete) {
            return this.renderField(i, {
              key,
              label,
              icon: !fields.length && i === 0 && icon,
              value: getValue(field),
              verified: !!field.verified,
              errorText,
              isNew: true
            })
          }
        })
      )

      if (!fields.length) {
        fields.push(
          this.renderField(0, {
            key,
            label,
            icon: !fields.length && icon,
            value: '',
            verified: false,
            errorText,
            isNew: true
          })
        )
      } else {
        fields.push(
          <Block key={`add_${key}`}>
            <AddNew
              onClick={() => {
                var length = newInformation[key].length
                if (length === 0 ||
                  newInformation[key][length - 1].value !== '') {
                  this.props.addNewEntry(key)
                  this.props.onFocusChange(
                    `newInformation_${key}`,
                     newInformation[key].length
                  )
                }
              }}
              value={addText}
            />
          </Block>
        )
      }
    }

    return fields
  }

  render() {
    let content

    if (this.props.loading) {
      content = <Loading />
    } else {
      content = this.renderContent()
    }

    return (
      <div>
        <EditAppBar title="Edit Contact"
          loading={this.props.loading}
          onSave={this.props.saveChanges}
          onClose={this.props.exitWithoutSaving} />
        <Content>
          <EditHeader title="Contact" />
          <Formsy.Form>
            <List>
              {content}
            </List>
          </Formsy.Form>
        </Content>
      </div>
    )
  }
}
