import { createDeepLinkingHandler } from 'react-native-deep-link'
import { navigationActions } from 'src/actions'

const handleCredentialRequestScreenDeepLink = ({ dispatch }) => ({ params: {} }) => {
    dispatch(navigationActions.navigate({
        routeName: 'Consent'
    }))
}

let withDeepLinking

export default withDeepLinking = createDeepLinkingHandler([{
    name: 'example:',
    routes: [{
        name: '/credentialRequest/:jwt',
        callback: handleCredentialRequestScreenDeepLink
    }]
}])
