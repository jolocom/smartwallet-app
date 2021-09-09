import {
  JolocomSDK,
  JolocomPlugin,
  InteractionTransportType,
  TransportDesc,
  TransportAPI,
  SDKError,
  ErrorCode,
  TransportMessageHandler,
} from '@jolocom/sdk'
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

    branch.subscribe(({ error, params, uri }) => {
      if (error) {
        console.warn('Error processing DeepLink: ', error)
        return
      }

      if (
        params &&
        params['token'] &&
        typeof params['token'] === 'string' &&
        onMessage
      ) {
        onMessage(params['token'])
        return
      }

      console.log('Cannot process')
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
