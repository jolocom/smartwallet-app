import React from 'react'
import Radium from 'radium'
import {Layout} from 'components/layout'

import {
  EditAppBar,
  EditHeader,
  Container
} from './ui'
import {theme} from 'styles'

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
    children: React.PropTypes.node
  }

  render() {
    return (

      <Layout fixedHeader>
        <EditAppBar title="Edit Contact"
          onSave={() => { null }} onClose={() => { null }} />
        <Container>
          <EditHeader title="Contact" />
        </Container>
      </Layout>
    )
  }
}
