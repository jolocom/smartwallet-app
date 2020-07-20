import { useContext } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { InteractionChannel } from '@jolocom/sdk/js/src/lib/interactionManager/types'
import { JolocomLib } from 'jolocom-lib'
import { ErrorCode } from '@jolocom/sdk/js/src/lib/errors'

import { SDKContext } from '~/utils/sdk/context'
import { getClaimMetadataByCredentialType } from '~/utils/claims'
import { useLoader } from './useLoader'
import {
  setInteractionSummary,
  setInteraction,
} from '~/modules/interaction/actions'
import { getInteractionId } from '~/modules/interaction/selectors'
import { getDid } from '~/modules/account/selectors'
import { setAttrs } from '~/modules/attributes/actions'

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
    // NOTE For testing Authorization flow until it's available on a demo service
    // const encodedToken = await sdk.authorizationRequestToken({
    //   description:
    //     'The  http://google.com is ready to share a scooter with you, unlock to start your ride',
    //   imageURL: 'http://www.pngmart.com/files/10/Vespa-Scooter-PNG-Pic.png',
    //   action: 'unlock the scooter',
    //   callbackURL: 'http://test.test.test',
    // })
    // console.log({ encodedToken })

    const token = parseJWT(jwt)

    await loader(
      async () => {
        const interaction = await sdk.bemw.interactionManager.start(
          channel,
          token,
        )

        dispatch(
          setInteraction({
            interactionId: interaction.id,
            interactionType: interaction.flow.type,
          }),
        )

        const summary = interaction.getSummary()
        dispatch(setInteractionSummary(summary))
      },
      { showSuccess: false },
    )
  }

  return { startInteraction }
}

export const useInteraction = () => {
  const sdk = useSDK()
  const interactionId = useSelector(getInteractionId)
  if (!interactionId.length) throw new Error('Interaction not found')

  return sdk.bemw.interactionManager.getInteraction(interactionId)
}

export const useVerifiableCredentials = () => {
  const sdk = useSDK()
  const dispatch = useDispatch()

  const getVerifiableCredentials = async () => {
    try {
      const verifiableCredentials = await sdk.bemw.storageLib.get.verifiableCredential()
      verifiableCredentials.map((cred) => console.log)

      const mappedCredentials = verifiableCredentials.reduce((acc, v) => {
        if (v.name === 'Email address') {
          acc['email'] = Array.isArray(acc[v.name])
            ? [...acc['email'], v.claim.email]
            : [v.claim.email]
        } else if (v.name === 'Name') {
          acc['name'] = Array.isArray(acc[v.name])
            ? [...acc['name'], `${v.claim.givenName} ${v.claim.familyName}`]
            : [`${v.claim.givenName} ${v.claim.familyName}`]
        }
        return acc
      }, {})

      dispatch(setAttrs(mappedCredentials))
    } catch (err) {
      console.warn('Failed getting verifiable credentials')
    }
  }

  return getVerifiableCredentials
}

export const useCreateSelfIssuedCredential = () => {
  const sdk = useSDK()
  const did = useSelector(getDid)

  const createSelfIssuedCredential = async (
    credentialType: 'Email' | 'Name',
    claimData: { [key: string]: any },
  ) => {
    const password = await sdk.bemw.keyChainLib.getPassword()

    const claim = {
      credentialType,
      claimData,
      id: '',
      issuer: {
        did: '',
      },
      subject: '',
    }

    const verifiableCredential = await sdk.bemw.identityWallet.create.signedCredential(
      {
        metadata: getClaimMetadataByCredentialType(claim.credentialType),
        claim: { ...claim.claimData },
        subject: did,
      },
      password,
    )

    await sdk.bemw.storageLib.store.verifiableCredential(verifiableCredential)
  }

  return {
    addEmail: () =>
      createSelfIssuedCredential('Email', { email: 'johnsmith@example.com' }),
    addName: () =>
      createSelfIssuedCredential('Name', {
        familyName: 'Smith',
        givenName: 'John',
      }),
  }
}
