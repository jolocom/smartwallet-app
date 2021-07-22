import { useAgent } from './sdk'
import { useDispatch } from 'react-redux'
import { deleteCredential } from '~/modules/credentials/actions'
import { ClaimKeys, DisplayCredential } from '~/types/credentials'
import { useTranslation } from 'react-i18next'
import moment from 'moment'

export const useDeleteCredential = () => {
  const agent = useAgent()
  const dispatch = useDispatch()

  return async (id: string) => {
    await agent.credentials.delete({ id })
    dispatch(deleteCredential(id))
  }
}

export const useCredentialOptionalFields = () => {
  const { t } = useTranslation()

  const nonOptionalFields = [
    ClaimKeys.familyName,
    ClaimKeys.givenName,
    ClaimKeys.id,
    ClaimKeys.photo,
  ]

  const getOptionalFields = <T extends DisplayCredential>(credential: T) => {
    const additionalFields = [
      {
        label: t('Documents.issuedFieldLabel'),
        value: moment(credential.issued).format('DD.MM.YYYY'),
      },
      {
        label: t('Documents.issuerFieldLabel'),
        value:
          credential.issuer?.publicProfile?.name ?? credential.issuer?.did!,
      },
      {
        label: t('Documents.expiresFieldLabel'),
        value: moment(credential.expires).format('DD.MM.YYYY'),
      },
    ]

    if (!credential.properties.length) return additionalFields

    return credential.properties
      .filter((p) => !nonOptionalFields.includes(p.key as ClaimKeys))
      .map(({ label, value }) => ({
        label: label || t('Documents.unspecifiedField'),
        value: value || t('Documents.unspecifiedField'),
      }))
      .concat(additionalFields)
  }

  return { nonOptionalFields, getOptionalFields }
}
