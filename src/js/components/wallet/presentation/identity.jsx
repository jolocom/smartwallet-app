import React from 'react'
import Radium from 'radium'
import {Container, Content, Block} from './ui'
import Info from 'material-ui/svg-icons/action/info'
import ContentAdd from 'material-ui/svg-icons/content/add'
import {theme} from 'styles'

import {
  TextField,
  Divider,
  List, ListItem,
  FloatingActionButton
} from 'material-ui'

const STYLES = {
  inputName: {
    color: '#4b132b',
    fontSize: '1.5em'
  },
  labelName: {
    color: 'rgba(75, 19, 43, 0.5)'
  },
  iconName: {
    top: '40px',
    fill: theme.palette.accent1Color
  },
  divider: {
    marginLeft: '16px'
  },
  addBtn: {
    width: '40px',
    boxShadow: 'none',
    marginTop: '27px'
  },
  infoHeader: {
    textAlign: 'left'
  }
}

@Radium
export default class WalletIdentity extends React.Component {
  static propTypes = {
    children: React.PropTypes.node
  }

  render() {
    return (
      <Container>
        <Content>
          <Block>
            <List>
              <ListItem
                key={1}
                rightIcon={<Info style={STYLES.iconName} />}
                disabled>
                <TextField
                  floatingLabelText="Name"
                  inputStyle={STYLES.inputName}
                  floatingLabelStyle={STYLES.labelName}
                  underlineShow={false}
                  floatingLabelFixed
                  value="Annika Hamann"
                />
              </ListItem>
              <Divider style={STYLES.divider} />
            </List>
          </Block>
          <Block>
            {/** TODO create separate component **/}
            <List>
              <ListItem
                key={2}
                disabled
                primaryText="Contact"
                style={STYLES.infoHeader}
                rightIcon={
                  <FloatingActionButton
                    mini
                    secondary
                    containerElement="label"
                    style={STYLES.addBtn}>
                    <ContentAdd />
                  </FloatingActionButton>
                } />
              <Divider style={STYLES.divider} />
            </List>
          </Block>
        </Content>
      {/* <Link to="/wallet/identity/contact"></Link> */}
      </Container>
    )
  }
}
