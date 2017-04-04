import React from 'react'
import Radium from 'radium'
import {Layout} from 'components/layout'

import {
  EditAppBar,
  EditHeader,
  Container,
  EditListItem
} from './ui'
import {theme} from 'styles'
import ContentMail from 'material-ui/svg-icons/content/mail'
import {
  List,
  ListItem,
  TextField
} from 'material-ui'

const STYLES = {
  title: {
    padding: '0 24px',
    color: theme.palette.textColor,
    fontWeight: '100'
  },
  titleDivider: {
    marginTop: '10px'
  }
}

@Radium
export default class WalletContact extends React.Component {
  static propTypes = {
    children: React.PropTypes.node,
    onChange: React.PropTypes.func,
    email: React.PropTypes.string
  }

  render() {
    return (

      <Layout fixedHeader>
        <EditAppBar title="Edit Contact"
          onSave={() => { null }} onClose={() => { null }} />
        <Container>
          <EditHeader title="Contact" />
          <List>
            <EditListItem
              Icon={ContentMail}
              iconStyle={{top: '40px'}}
              textLabel="Email Address"
              textName="email"
              textValue="a@a.com"
              onChange={() => { null }} />
          </List>
        </Container>
      </Layout>
    )
  }
}
