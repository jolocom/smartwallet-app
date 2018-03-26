import * as React from 'react'
import { View, Text, StyleSheet, Button } from 'react-native'
import {connect, Dispatch} from 'react-redux'
import {accountActions, registrationActions} from '../../../actions'
import {AnyAction} from 'redux'
import { StackNavigator } from 'react-navigation'

export interface HomeProps {
  did: string;
}

export interface ReduxProps extends HomeProps {
  setDid: (did: string) => void;
  generateAndEncryptKeyPairs: () => void
}

export interface HomeState {}

class HomeComponent extends React.Component<ReduxProps, HomeState> {
  render() {
    console.log("HOME")
    return (
     <View style={styles.container}>
       <Text> Hey Hey Hey {this.props.did} </Text>
         <Button
           onPress={() => this.props.navigation.navigate('Loading')}
           title="Press Me"
         />
     </View>
    )
  }
}

const mapStateToProps = (state: HomeProps) => {
  return {
    did: state.did
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    setDid: (did:string) => dispatch(accountActions.setDid(did)),
    generateAndEncryptKeyPairs: () => dispatch(registrationActions.generateAndEncryptKeyPairs())
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
