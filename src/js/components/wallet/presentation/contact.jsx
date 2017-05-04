import React from 'react'
import Radium from 'radium'
import {Form} from 'formsy-react'
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
import ContentMail from 'material-ui/svg-icons/content/mail'
import {
  List
} from 'material-ui'

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
  icon: {
    marginTop: '35px',
    marginRight: '40px'
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
          icon: ContentMail
        })}
        {this.renderFields({
          key: 'emails',
          label: 'Email Address',
          errorText: 'Invalid email address',
          addText: 'Add another email',
          icon: ContentMail
        })}
      </div>
    )
  }

  renderField(i, field) {
    let {
      key,
      label,
      value,
      verified,
      icon,
      isNew,
      type
    } = field
    type = type === undefined ? '' : type
    const prefix = isNew ? 'newInformation' : 'originalInformation'
    const id = `${prefix}_${key}_${i}`
    const name = `${key}[${i}]`
    const actionValue = (key, e) => key === 'emails' ? e.target.value
    : {value: e.target.value, type: type}
    let {
      setInformation,
      updateInformation,
      deleteInformation,
      close,
      confirm,
      focused,
      onFocusChange
    } = this.props
    return (
      <EditListItem
        key={id}
        id={id}
        icon={i === 0 && icon || null}
        iconStyle={STYLES.icon}
        label={label}
        name={name}
        enableEdit={!verified}
        value={value}
        type={type}
        verified={verified}
        focused={focused === key}
        onFocusChange={() => onFocusChange(key)}
        onChange={(e) => isNew
          ? setInformation(key, i, actionValue(key, e))
          : updateInformation(key, i, actionValue(key, e))
        }
        onDelete={() => (isNew || !verified) ? deleteInformation(prefix, key, i)
          : confirm(
            'Are you sure you want to delete a verified email?',
            'Delete',
            () => {
              deleteInformation(prefix, key, i)
              close()
            })
        }
        enableDelete
        />
    )
  }

  renderFields({key, label, icon, errorText, addText}) {
    let fields = []

    const {originalInformation, newInformation} = this.props.information
    const {
      loading,
      addNewEntry,
      onFocusChange
    } = this.props
    if (!loading) {
      fields.push(
        originalInformation[key].map((field, i) => {
          if (!field.delete) {
            return this.renderField(i, {
              key,
              label,
              icon,
              value: field.value,
              verified: field.verified,
              errorText,
              isNew: false,
              type: field.type
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
              icon,
              value: field.value,
              verified: field.verified,
              errorText,
              isNew: true,
              type: field.type
            })
          }
        })
      )

      if (fields.length === 0) {
        fields.push(
          this.renderField(0, {
            key,
            label,
            value: '',
            verified: false,
            errorText,
            isNew: true,
            type: ''
          })
        )
      } else {
        fields.push(
          <Block key={`add_${key}`}>
            <AddNew onClick={() => {
              const length = newInformation[key].length
              if (length === 0 ||
                newInformation[key][length - 1].value !== '') {
                addNewEntry(key, length)
                onFocusChange(`newInformation_${key}`, length)
              }
            }}
              value={addText}
            />
          </Block>
        )
      }
    }

    return <Form>
      {fields}
    </Form>
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
          <List>
            {content}
          </List>
        </Content>
      </div>
    )
  }
}
