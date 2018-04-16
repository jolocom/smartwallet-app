import React from 'react'
import { View, Text } from 'react-native'
import { connect } from 'react-redux'
import { AnyAction } from 'redux'
import { accountActions } from 'src/actions'
import { RootState } from 'src/reducers/'

interface ConnectProps {
  did: string;
  setDid: (did: string) => void;
}

interface Props extends ConnectProps {}

interface State {}

class HomeComponent extends React.Component<Props, State> {
  render() {
    return (
     <View>
       <Text>Home Welcome Screen</Text>
       <Text> {this.props.did} </Text>
       <Text> HELLO </Text>
     </View>
    )
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    did: state.account.did
  }
}

const mapDispatchToProps = (dispatch: (action: AnyAction) => void) => {
  return { }
}

export const Home = connect(mapStateToProps, mapDispatchToProps)(HomeComponent)
