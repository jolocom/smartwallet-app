import { ThunkDispatch } from '../../../store'
import { withErrorScreen, withLoading } from '../../../actions/modifiers'
import { routeList } from '../../../routeList'
import { navigationActions, ssoActions } from '../../../actions'
import { connect } from 'react-redux'
import { CredentialsReceiveContainer } from './credentialReceive'
import { SignedCredentialWithMetadata } from 'src/lib/interactionManager/types'

const mapDispatchToProps = (dispatch: ThunkDispatch) => ({
  acceptSelectedCredentials: (
    selected: SignedCredentialWithMetadata[],
    interactionId: string,
  ) =>
    dispatch(
      withErrorScreen(
        withLoading(
          ssoActions.validateSelectionAndSave(selected, interactionId),
        ),
      ),
    ),
  goBack: () =>
    dispatch(
      navigationActions.navigate({ routeName: routeList.InteractionScreen }),
    ),
})

export const CredentialReceiveInvalid = connect(
  null,
  mapDispatchToProps,
)(CredentialsReceiveContainer)
