import {
  ErrorCode,
  TransportMessageHandler,
  DeepLinkingProvider,
} from 'react-native-jolocom'
import branch from 'react-native-branch'

/*
 * In order to use the Branch Deeplinking plugin, the installation steps
 * from https://www.npmjs.com/package/react-native-branch should be followed.
 */

export class BranchDeepLinking implements DeepLinkingProvider {
  constructor() {
    branch.disableTracking(true)
  }

  subscribe(onMessage: TransportMessageHandler) {
    branch.subscribe(({ error, params }) => {
      if (onMessage && params) {
        if (error) {
          console.warn('Error processing DeepLink: ', error)
          return
        }

        if (params['token'] && typeof params['token'] === 'string') {
          onMessage(params['token'])
          return
        } else if (
          !params['+clicked_branch_link'] ||
          JSON.stringify(params) === '{}'
        ) {
          return
        }

        onMessage('', new Error(ErrorCode.InvalidToken))
      }
    })
  }
}
