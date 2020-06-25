import { Alert } from 'react-native'
import { useContext } from 'react'
import { useDispatch } from 'react-redux'
import {
  InteractionChannel,
  FlowType,
} from '@jolocom/sdk/js/src/lib/interactionManager/types'
import { JolocomLib } from 'jolocom-lib'
import { ErrorCode } from '@jolocom/sdk/js/src/lib/errors'

import { SDKContext } from '~/utils/sdk/context'
import { setInteraction } from '~/modules/account/actions'
import { useLoader } from './useLoader'

export const useSDK = () => {
  const sdk = useContext(SDKContext)
  if (!sdk?.current) throw new Error('SDK was not found!')
  return sdk.current
}

export const useMnemonic = () => {
  const sdk = useSDK()

  return (entropy: string) => {
    return sdk.bemw.fromEntropyToMnemonic(Buffer.from(entropy, 'hex'))
  }
}

export const useInteractionStart = (channel: InteractionChannel) => {
  const sdk = useSDK()
  const dispatch = useDispatch()
  const loader = useLoader()

  //NOTE: This can move to the SDK
  const parseJWT = (jwt: string) => {
    try {
      return JolocomLib.parse.interactionToken.fromJWT(jwt)
    } catch (e) {
      if (e instanceof SyntaxError) {
        throw new Error(ErrorCode.ParseJWTFailed)
      } else if (e.message === 'Token expired') {
        throw new Error(ErrorCode.TokenExpired)
      } else {
        throw new Error(ErrorCode.Unknown)
      }
    }
  }

  const startInteraction = async (jwt: string) => {
    const token = parseJWT(jwt)
    await loader(
      async () => {
        const interaction = await sdk.bemw.interactionManager.start(
          channel,
          token,
        )
        dispatch(setInteraction(interaction.id))

        switch (interaction.flow.type) {
          case FlowType.Authentication:
            return null
          case FlowType.CredentialShare:
            return null
          case FlowType.CredentialReceive:
            return null
          default:
            return null
        }
      },
      { showStatus: false },
    )
  }

  return { startInteraction }
}
