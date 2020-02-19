import { backendMiddleware, ThunkDispatch } from '../../../store'
import { CredentialOfferFlow } from '../../../lib/interactionManager/credentialOfferFlow'
import { withErrorScreen, withLoading } from '../../../actions/modifiers'
import { saveCredentialOffer } from '../../../actions/sso/credentialOffer'
import { navigationActions } from '../../../actions'
import { routeList } from '../../../routeList'
import { connect } from 'react-redux'
import { CredentialsReceiveContainer } from './credentialReceive'
import { CredentialOffering } from '../../../lib/interactionManager/types'

const mapDispatchToProps = (dispatch: ThunkDispatch) => ({
  acceptSelectedCredentials: (
    selected: CredentialOffering[],
    interactionId: string,
  ) => {
    backendMiddleware.interactionManager
      .getInteraction(interactionId)
      .getFlow<CredentialOfferFlow>()
      .setOffering(_ => selected)

    dispatch(withErrorScreen(withLoading(saveCredentialOffer(interactionId))))
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
