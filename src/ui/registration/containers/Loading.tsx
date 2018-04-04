import * as React from 'react'
import { View, Text, ActivityIndicator } from 'react-native'
import { connect } from 'react-redux'
import { registrationActions } from 'src/actions'
import { AnyAction } from 'redux'
import Immutable from 'immutable'

export interface LoadingProps {
  loadingMsg: string
}

export interface Props extends LoadingProps {
  generateAndEncryptKeyPairs: () => void
}

export interface State {
  registration: {
    progress: {
      loadingMsg: string
  },
    getIn: ([]) => void
  }
}

export class LoadingComponent extends React.Component<Props, State> {

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

const mapStateToProps = (state: State) => {
  return {
    loadingMsg: state.registration.getIn(['progress', 'loadingMsg'])
  }
}

const mapDispatchToProps = (dispatch: Function) => {
  return {
    generateAndEncryptKeyPairs: () => dispatch(registrationActions.generateAndEncryptKeyPairs())
  }
}

// tslint:disable-next-line
export const Loading = connect(mapStateToProps, mapDispatchToProps)(LoadingComponent)
