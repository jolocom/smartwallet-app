import {
  JolocomSDK,
  JolocomPlugin,
  InteractionTransportType,
  TransportDesc,
  TransportAPI,
  SDKError,
  ErrorCode,
  TransportMessageHandler,
} from 'react-native-jolocom'
import branch from 'react-native-branch'

export class JolocomDeepLinking implements JolocomPlugin {
  async register(sdk: JolocomSDK) {
    sdk.transports.register(InteractionTransportType.Deeplink, this)
  }

  start(
    transport: TransportDesc,
    onMessage?: TransportMessageHandler,
  ): TransportAPI {
    const { config: callbackURL } = transport

    branch.subscribe(({ error, params }) => {
      if (onMessage && params) {
        console.log(JSON.stringify(params, null, 2))

        if (error) {
          onMessage('', new Error(error))
          console.warn('Error processing DeepLink: ', error)
          return
        }

        if (params['token'] && typeof params['token'] === 'string') {
          onMessage(params['token'])
          return
        } else if (!params['+clicked_branch_link']) {
          return
        }

        onMessage('', new Error(ErrorCode.InvalidToken))
      }
    })

    return {
      send: async (token: string) => {
        const response = await fetch(callbackURL, {
          method: 'POST',
          body: JSON.stringify({ token }),
          headers: { 'Content-Type': 'application/json' },
        })

        const text = await response.text()

        if (!response.ok) {
          throw new SDKError(ErrorCode.Unknown, new Error(text))
        }

        if (text.length) {
          let token
          try {
            token = JSON.parse(text).token
          } catch (err) {}
          if (!onMessage || !token) {
            throw new SDKError(ErrorCode.Unknown, new Error(text))
          }
          await onMessage(token)
        }
      },
    }
  }
}
