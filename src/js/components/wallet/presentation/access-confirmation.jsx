import React from 'react'
import Radium from 'radium'

import {Header, Content, Block} from '../../structure'

const STYLES = {
  container: {
    margin: '10%',
    height: '400px',
    backgroundImage: 'url("img/img_successful_connection.svg")',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    position: 'relative'
  },
  name: {
    maxWidth: '100px',
    position: 'absolute',
    top: '12%',
    right: '30%'
  }
}

@Radium
export default class AccessConfirmation extends React.Component {
  // static propTypes = {
  //   entity: React.propTypes.obj
  // }

  render() {
    return (
      <div>
        <Content style={{margin: '16px'}}>
          <Header
            title={'Your connection was successfull.'} />
          <Block style={STYLES.container}>
            <div style={STYLES.name}><span>{this.props.entity.name}</span></div>
          </Block>
        </Content>
      </div>
    )
  }
}
