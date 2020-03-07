import { ThunkDispatch, ThunkAction } from '../../../store'
import { withErrorScreen, withLoading } from '../../../actions/modifiers'
import { routeList } from '../../../routeList'
import { navigationActions } from '../../../actions'
import { connect } from 'react-redux'
import { CredentialsReceiveContainer } from './credentialReceive'
import { abstracted } from 'src/actions/sso/credentialOffer'
import { SignedCredentialWithMetadata } from 'src/lib/interactionManager/types'

const mapDispatchToProps = (dispatch: ThunkDispatch) => ({
  acceptSelectedCredentials: (
    selected: SignedCredentialWithMetadata[],
    interactionId: string,
  ): ThunkAction => {
    debugger
    return dispatch(
      withErrorScreen(
        withLoading(abstracted(selected, interactionId)),
      )
    )
  },
  goBack: () =>
    dispatch(
      navigationActions.navigate({ routeName: routeList.InteractionScreen }),
    ),
})

export const CredentialReceiveInvalid = connect(
  null,
  mapDispatchToProps,
)(CredentialsReceiveContainer)
