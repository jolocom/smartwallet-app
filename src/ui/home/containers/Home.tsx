import * as React from 'react'
import { View, Text } from 'react-native'
import { connect } from 'react-redux'
import { AnyAction } from 'redux'
import { accountActions } from 'src/actions'

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
       <Text>Home Welcome Screen</Text>
       <Text> {this.props.did} </Text>
       <Text> HELLO </Text>
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
  return { }
}

export const Home = connect(mapStateToProps, mapDispatchToProps)(HomeComponent)
