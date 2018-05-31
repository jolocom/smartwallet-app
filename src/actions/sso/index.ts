import { Dispatch, AnyAction } from 'redux'
import { BackendMiddleware } from '../../backendMiddleware'
import { CredentialRequest } from 'jolocom-lib/js/credentialRequest/'
import { VerifiableCredential } from 'jolocom-lib/js/credentials/verifiableCredential'

export const consumeCredentialRequest = (jwtEncodedCR: string) => {
  return async(dispatch: Dispatch<AnyAction>, getState: Function, backendMiddleware: BackendMiddleware) => {
    const { storageLib } = backendMiddleware
    const CR = new CredentialRequest().fromJWT(jwtEncodedCR)

    const requestedTypes = CR.getRequestedCredentialTypes()

    await Promise.all(requestedTypes.map(async type => {
      const values: string[] = await storageLib.get.attributesByType(type)

      const attributeSummaries = await Promise.all(values.map(async value => {
        const verifications: VerifiableCredential[] = await storageLib.get.vCredentialsByAttributeValue(value)
        const json = verifications.map(v => v.toJSON())
        const validVerifications = CR.applyConstraints(json)

        return {
          value,
          verifications: validVerifications
        }
      }))

      return {
        type,
        credentials: attributeSummaries
      }
    }))
  }
}