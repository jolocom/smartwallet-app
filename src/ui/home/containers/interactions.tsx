import React from 'react'
import { InteractionsComponent } from 'src/ui/home/components/interactions'
import { connect } from 'react-redux'
import {navigationActions, interactionHandlerActions} from 'src/actions'
import { RootState } from 'src/reducers/'
import {routeList} from '../../../routeList'

interface ConnectProps {
  openScanner: () => void
  parseJWT: (jwt: string) => void
  loading: boolean
}

interface Props extends ConnectProps {}

interface State {}

export class InteractionsContainer extends React.Component<Props, State> {
  state = {}

  render() {
    return (
        <InteractionsComponent />
    )
  }
}


const mapStateToProps = (state: RootState) => {
  return {}
}

const mapDispatchToProps = (dispatch: Function) => {
  return {
    parseJWT: (jwt: string) => dispatch(interactionHandlerActions.parseJWT(jwt)),
    openScanner: () => dispatch( navigationActions.navigate({ routeName: routeList.QRCodeScanner }))
  }
}

export const Interactions = connect(mapStateToProps, mapDispatchToProps)(InteractionsContainer)
