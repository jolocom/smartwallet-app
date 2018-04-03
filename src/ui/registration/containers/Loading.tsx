import * as React from 'react'
import { View, Text, ActivityIndicator } from 'react-native'
import { connect } from 'react-redux'
import { registrationActions } from 'src/actions'
import { AnyAction } from 'redux'
import Immutable from 'immutable'

export interface LoadingProps {
  loadingMsg: string
}

export interface ReduxProps extends LoadingProps {
  generateAndEncryptKeyPairs: () => void
}

export interface LoadingState {
  registration: {
    progress: {
      loading: boolean,
      loadingMsg: string
  },
    getIn: ([]) => void
  }
}

class LoadingComponent extends React.Component<ReduxProps, LoadingState> {

  componentDidMount() {
    this.props.generateAndEncryptKeyPairs()
  }

  render() {
    console.log('render LOADING')
    return (
     <View style={{
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
     }}>
       <ActivityIndicator size='large' color="#00ff00" />
       <Text> {this.props.loadingMsg}</Text>
     </View>
    )
  }
}

const mapStateToProps = (state: LoadingState) => {
  return {
    loadingMsg: state.registration.getIn(['progress', 'loadingMsg'])
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    generateAndEncryptKeyPairs: () => dispatch(registrationActions.generateAndEncryptKeyPairs())
  }
}

export const Loading = connect(mapStateToProps, mapDispatchToProps)(LoadingComponent)
