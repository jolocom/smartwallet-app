import React from 'react'
import Radium from 'radium'
import {Container, Content, Block, PlusMenu} from './ui'
import Info from 'material-ui/svg-icons/action/info'
import {theme} from 'styles'

import {
  TextField,
  Divider,
  List, ListItem
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
    children: React.PropTypes.node,
    username: React.PropTypes.object.isRequired,
    passport: React.PropTypes.object.isRequired,
    isLoaded: React.PropTypes.bool.isRequired,
    contact:  React.PropTypes.object.isRequired,
    goToContactManagement: React.PropTypes.func.isRequired,
    goToPassportManagement: React.PropTypes.func.isRequired,
    goToDivingLicenceManagement: React.PropTypes.func.isRequired
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
                  value={this.props.username.value}
                />
              </ListItem>
              <Divider style={STYLES.divider} />
            </List>
          </Block>
          <Block>
            <PlusMenu name="Contact" onClick={this.props.goToContactManagement} />
          </Block>
          <Block>
            <PlusMenu name="Passport" onClick={ this.props.goToPassportManagement}/>
          </Block>
          <Block>
            <PlusMenu name="Diving Licnece" onClick={ this.props.goToDivingLicenceManagement}/>
          </Block>
        </Content>
      {/* <Link to="/wallet/identity/contact"></Link> */}
      </Container>
    )
  }
}
// const Field = (props) => {
//   if (props.isEmpty) {
//     return ( <Block>
//       <PlusMenu name={props.name} onClick={props.action} />
//       </Block>
//   )
//   } else {
//       return <PlusMenu name={props.name} onClick={props.action} value={props.value}/>
//     }
// }