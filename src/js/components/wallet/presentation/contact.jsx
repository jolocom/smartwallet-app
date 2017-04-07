import React from 'react'
import Radium from 'radium'
import {
  EditAppBar,
  EditHeader,
  Container,
  Content,
  Block,
  EditListItem,
  AddNew
} from './ui'
import {theme} from 'styles'
import ContentMail from 'material-ui/svg-icons/content/mail'
import {
  List
} from 'material-ui'

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
    top: '40px',
    marginRight: '40px'
  }
}

@Radium
export default class WalletContact extends React.Component {
  static propTypes = {
    children: React.PropTypes.node,
    onChange: React.PropTypes.func,
    contact: React.PropTypes.object,
    focused: React.PropTypes.string,
    onFocusChange: React.PropTypes.func,
    information: React.PropTypes.object,
    getAccountInformation: React.PropTypes.func,
    updateInformation: React.PropTypes.func,
    setInformation: React.PropTypes.func,
    exitWithoutSaving: React.PropTypes.func
  }

  componentDidMount() {
    this.props.getAccountInformation()
  }

  render() {
    let emailFields
    for (let age in this.props.information) {
      emailFields = this.props.information[age].emails.map(
        (email, i) => {
          return (
            <Block key={age + 'emails' + i}>
              <EditListItem
                id={age + 'emails' + i}
                icon={ContentMail}
                iconStyle={STYLES.icon}
                textLabel="Email Address"
                textName="email"
                textValue={email.address}
                focused={this.props.focused === age + 'emails' + i}
                onFocusChange={this.props.onFocusChange}
                onChange={age === 'originalInformation'
                ? (e) => this.props.updateInformation('emails', i, e.target.value) //eslint-disable-line
                : (e) => this.props.setInformation('emails', i, e.target.value)
              } />
            </Block>
          )
        }
      )
    }
    // fields = [<div key="key1">blah1</div>, <div key="key2">blah2</div>]

    // console.log(fields)
    return (
      <Container>
        <EditAppBar title="Edit Contact"
          onSave={() => { null }} onClose={this.props.exitWithoutSaving} />
        <Content>
          <EditHeader title="Contact" />
          <List>
            {emailFields}
            <AddNew onClick={() => { null }} value="Additional email" />
          </List>
        </Content>
      </Container>
    )
  }
}
