import React from 'react'
import Radium from 'radium'
import {
  EditAppBar,
  EditHeader,
  Container,
  Content,
  Block,
  EditListItem
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
    onFocusChange: React.PropTypes.func
  }

  render() {
    return (
      <Container>
        <EditAppBar title="Edit Contact"
          onSave={() => { null }} onClose={() => { null }} />
        <Content>
          <EditHeader title="Contact" />
          <List>
            <Block>
              <EditListItem
                id={this.props.contact.id}
                icon={ContentMail}
                iconStyle={STYLES.icon}
                textLabel="Email Address"
                textName="email"
                textValue={this.props.contact.emails[0]}
                focused={this.props.focused === this.props.contact.id}
                onFocusChange={this.props.onFocusChange}
                onChange={this.props.onChange} />
            </Block>
          </List>
        </Content>
      </Container>
    )
  }
}
