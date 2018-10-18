import { Dispatch } from 'react-redux'
import { AnyAction } from 'redux'
import { navigationActions } from 'src/actions'
const DeepLinking = require('react-native-deep-link')

const handleCredentialRequestScreenDeepLink = ({ dispatch }: { dispatch: Dispatch<AnyAction>}) => ({ params: {} }) => {
    dispatch(navigationActions.navigate({
        routeName: 'Consent'
    }))
}

export const withDeepLinking = DeepLinking.createDeepLinkingHandler([{
    name: 'example:',
    routes: [{
        name: '/credentialRequest/:jwt',
        callback: handleCredentialRequestScreenDeepLink
    }]
}])