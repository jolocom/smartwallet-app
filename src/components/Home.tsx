import * as React from 'react'
import {View, Text} from 'react-native'
import {connect} from 'react-redux'
import {accountActions} from '../actions'

export interface HomeProps {
  did: string;
  setDid:(did: string) => {};
}

class Home extends React.Component<HomeProps, {}> {
  componentDidMount() {
  }

  render() {
    return (
     <View>
       <Text> {this.props.did} </Text>
     </View>
    )
  }
}

const mapStateToProps = (state:any) => {
  return {
    did: state.did
  }
}
const mapDispatchToProps = (dispatch: any) => {
  return {
    setDid: (did:string) => dispatch(accountActions.setDid(did))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)