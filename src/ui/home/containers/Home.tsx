import * as React from 'react'
import { View, Text, StyleSheet, Button } from 'react-native'
import {connect, Dispatch} from 'react-redux'
import {accountActions, registrationActions} from 'src/actions'
import {AnyAction} from 'redux'
import { StackNavigator } from 'react-navigation'
import { RootState } from 'src/reducers/'

interface ConnectProps {
  did: string;
  setDid: (did: string) => void;
}

interface Props extends ConnectProps {}

interface State {}

export class HomeComponent extends React.Component<Props, State> {
  render() {
    console.log("HOME")
    return (
     <View style={styles.container}>
       <Text> Hey Hey Hey {this.props.did} </Text>
     </View>
    )
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    did: state.account.did
  }
}

const mapDispatchToProps = (dispatch: Function) => {
  return {
    setDid: (did:string) => dispatch(accountActions.setDid(did)),
  }
}

export const Home = connect(mapStateToProps, mapDispatchToProps)(HomeComponent)

const styles = StyleSheet.create({
  container: {
   flex: 1,
   justifyContent: 'center',
  },
  buttonContainer: {
    margin: 20
  },
  alternativeLayoutButtonContainer: {
    margin: 20,
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
})
