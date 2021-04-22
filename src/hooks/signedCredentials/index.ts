import { SignedCredential } from 'jolocom-lib/js/credentials/signedCredential/signedCredential'
import { Dispatch } from 'react'
import { Agent } from 'react-native-jolocom'
import { useDispatch, useSelector } from 'react-redux'
import { getDid } from '~/modules/account/selectors'
import { initAttrs } from '~/modules/attributes/actions'
import { setCredentials } from '~/modules/credentials/actions'
import { DisplayCredential } from '~/types/credentials'
import { useAgent } from '../sdk'
import {
  mapCredentialsToDisplay,
  separateCredentialsAndAttributes,
  mapAttributesToDisplay,
} from './utils'

const makeSeparateSignedTransformToUI = (agent: Agent, did: string) => {
  return async (credentials: SignedCredential[]) => {
    const {
      credentials: serviceIssuedCredentials,
      selfIssuedCredentials,
    } = separateCredentialsAndAttributes(credentials, did)

    const attributes = mapAttributesToDisplay(selfIssuedCredentials)
    const displayCredentials = await makeTransformSignedCredentialToUI(agent)(
      serviceIssuedCredentials,
    )

    return {
      attributes,
      displayCredentials,
    }
  }
}

const makeInitializeCredentials = (
  agent: Agent,
  did: string,
  dispatch: Dispatch<any>,
) => {
  return async () => {
    try {
      const allCredentials: SignedCredential[] = await agent.credentials.query()
      const {
        attributes,
        displayCredentials,
      } = await makeSeparateSignedTransformToUI(agent, did)(allCredentials)

      // TODO: namings are inconsistent across modules: initAttrs vs setCredentials
      dispatch(initAttrs(attributes))
      dispatch(setCredentials(displayCredentials))
    } catch (err) {
      console.warn('Failed getting verifiable credentials or its metadata', err)
    }
  }
}

const makeTransformSignedCredentialToUI = (agent: Agent) => async (
  credentials: SignedCredential[],
): Promise<DisplayCredential[]> => {
  return Promise.all(
    credentials.map((c) => mapCredentialsToDisplay(agent.credentials, c)),
  )
}

export const useCredentials = () => {
  const agent = useAgent()
  const did = useSelector(getDid)
  const dispatch = useDispatch()

  // TODO: think together about names
  return {
    separateSignedTransformToUI: makeSeparateSignedTransformToUI(agent, did),
    initializeCredentials: makeInitializeCredentials(agent, did, dispatch),
    signedCredentialToUI: makeTransformSignedCredentialToUI(agent),
  }
}
