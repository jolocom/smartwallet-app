import React from 'react'
import { connect } from 'react-redux'
import { View } from 'react-native'
import Keychain from 'react-native-keychain'

import { CredentialOverview } from '../components/credentialOverview'
import { accountActions } from 'src/actions'
import { DecoratedClaims } from 'src/reducers/account/'
import { RootState } from '../../../reducers'
import { withLoading } from '../../../actions/modifiers'
import { ThunkDispatch } from '../../../store'
import { PIN_SERVICE } from 'src/ui/deviceauth/utils/keychainConsts'

interface Props
  extends ReturnType<typeof mapDispatchToProps>,
    ReturnType<typeof mapStateToProps> {}

export class ClaimsContainer extends React.Component<Props> {
  public componentWillMount(): void {
    const getPin = async () => {
      const pin = await Keychain.getGenericPassword({
        service: PIN_SERVICE,
      })
      console.log({ pin })
      if (pin) {
        this.props.setLocalAuth()
      } else {
        this.props.openLocalAuth()
      }
    }
    getPin()
    this.props.setClaimsForDid()
  }

  public render(): JSX.Element {
    const { did, claimsState, openClaimDetails } = this.props
    return (
      <View testID="claimsScreen" style={{ flex: 1 }}>
        <CredentialOverview
          did={did}
          claimsToRender={claimsState.decoratedCredentials}
          onEdit={openClaimDetails}
        />
      </View>
    )
  }
}

const mapStateToProps = ({
  account: {
    did: { did },
    claims: claimsState,
  },
}: RootState) => ({ did, claimsState })

const mapDispatchToProps = (dispatch: ThunkDispatch) => ({
  openClaimDetails: (claim: DecoratedClaims) =>
    dispatch(accountActions.openClaimDetails(claim)),
  setClaimsForDid: () => dispatch(withLoading(accountActions.setClaimsForDid)),
  setLocalAuth: () => dispatch(accountActions.setLocalAuth()),
  openLocalAuth: () => dispatch(accountActions.openLocalAuth()),
  closeLocalAuth: () => dispatch(accountActions.closeLocalAuth()),
})

export const Claims = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ClaimsContainer)
