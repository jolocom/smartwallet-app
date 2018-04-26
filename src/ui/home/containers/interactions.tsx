import React from 'react'
import { InteractionsComponent } from 'src/ui/home/components/interactions'
import { connect } from 'react-redux'
import { AnyAction } from 'redux'
import { RootState } from 'src/reducers/'

interface ConnectProps {}

interface Props extends ConnectProps {}

interface State {}

export class InteractionsContainer extends React.Component<Props, State> {

  state = {}

  render() {

    return (
    <InteractionsComponent
    />
    )
  }
}


const mapStateToProps = (state: RootState) => {
  return {}
}

const mapDispatchToProps = (dispatch: (action: AnyAction) => void) => {
  return {}
}

export const Interactions = connect(mapStateToProps, mapDispatchToProps)(InteractionsContainer)
