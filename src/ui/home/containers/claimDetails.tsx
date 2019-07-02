import React from 'react'
import { ClaimDetailsComponent } from 'src/ui/home/components/claimDetails'
import { connect } from 'react-redux'
import { RootState } from 'src/reducers/'
import { accountActions } from 'src/actions'
import { ThunkDispatch } from '../../../store'
import { withErrorHandling, withLoading } from '../../../actions/modifiers'
import { showErrorScreen } from '../../../actions/generic'
import { toggleLoading } from 'src/actions/account'

interface Props
  extends ReturnType<typeof mapDispatchToProps>,
    ReturnType<typeof mapStateToProps> {}

interface State {}

export class ClaimDetailsContainer extends React.Component<Props, State> {
  render() {
    return (
      <ClaimDetailsComponent
        saveClaim={this.props.saveClaim}
        handleClaimInput={this.props.handleClaimInput}
        selectedClaim={this.props.claims.selected}
      />
    )
  }
}

const mapStateToProps = ({ account: { claims } }: RootState) => ({
  claims,
})

const mapDispatchToProps = (dispatch: ThunkDispatch) => ({
  saveClaim: () =>
    dispatch(
      withLoading(toggleLoading)(
        withErrorHandling(showErrorScreen)(accountActions.saveClaim),
      ),
    ),
  handleClaimInput: (fieldValue: string, fieldName: string) => {
    dispatch(accountActions.handleClaimInput(fieldValue, fieldName))
  },
})

export const ClaimDetails = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ClaimDetailsContainer)
