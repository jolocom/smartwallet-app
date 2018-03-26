import * as React from 'react'
import { View, Text, ActivityIndicator } from 'react-native'
import { connect } from 'react-redux'
import { accountActions } from '../../../actions'
import { AnyAction } from 'redux'

export interface LoadingProps {
  loadingMsg: string;
}

export interface ReduxProps extends LoadingProps {
}

export interface LoadingState {
  loadingMsg: string
}

class LoadingComponent extends React.Component<ReduxProps, LoadingState> {
  render() {
    console.log("LOADING")
    return (
     <View style={{
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
     }}>
       <ActivityIndicator size='large' color="#00ff00" />
       <Text> {this.props.loadingMsg} dsssssfegvsfd </Text>
     </View>
    )
  }
}

const mapStateToProps = (state: LoadingProps) => {
  return {
    loadingMsg: state.loadingMsg
  }
}

const mapDispatchToProps = (dispatch: (action: AnyAction) => void) => {
  return {
  }
}

export const Loading = connect(mapStateToProps, mapDispatchToProps)(LoadingComponent)
