import * as React from 'react'
import {View, Text} from 'react-native'
import {connect} from 'react-redux'
import {accountActions} from '../../../actions'
import {AnyAction} from 'redux'

export interface HomeProps {
  did: string;
}

export interface ReduxProps extends HomeProps {
  setDid: (did: string) => void;
}

export interface HomeState {}

class HomeComponent extends React.Component<ReduxProps, HomeState> {
  render() {
    return (
     <View>
       <Text> Hey Hey Hey {this.props.did} </Text>
     </View>
    )
  }
}

const mapStateToProps = (state: HomeProps) => {
  return {
    did: state.did
  }
}

const mapDispatchToProps = (dispatch: (action: AnyAction) => void) => {
  return {
    setDid: (did:string) => dispatch(accountActions.setDid(did))
  }
}

export const Home = connect(mapStateToProps, mapDispatchToProps)(HomeComponent)
