import React from 'react'
import { RecordsComponent } from 'src/ui/home/components/records'
import { connect } from 'react-redux'
import { RootState } from 'src/reducers/'
import { ThunkDispatch } from '../../../store'

interface Props extends ReturnType<typeof mapStateToProps> {}

interface State {}

export class RecordsContainer extends React.Component<Props, State> {
  state = {}

  render() {
    return <RecordsComponent />
  }
}

const mapStateToProps = (state: RootState) => ({})

const mapDispatchToProps = (dispatch: ThunkDispatch) => ({})

export const Records = connect(
  mapStateToProps,
  mapDispatchToProps,
)(RecordsContainer)
