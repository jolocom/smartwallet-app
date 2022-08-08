import { ClaimMimeType } from '@jolocom/protocol-ts'
import moment from 'moment'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { deleteCredential } from '~/modules/credentials/actions'
import { ClaimKeys, DisplayCredential } from '~/types/credentials'
import { useAgent } from './sdk'

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

  const getPreviewFields = <T extends DisplayCredential>(credential: T) => {
    return credential.properties.filter((f) =>
      credential.previewKeys.includes(f.key!),
    )
  }

  const getOptionalFields = <T extends DisplayCredential>(credential: T) => {
    const additionalFields = [
      {
        key: 'issued',
        label: t('Documents.issuedFieldLabel'),
        value: moment(credential.issued).format('DD.MM.YYYY'),
        mime_type: ClaimMimeType.text_plain,
        preview: false,
      },
      {
        key: 'issuer',
        label: t('Documents.issuerFieldLabel'),
        value:
          credential.issuer?.publicProfile?.name ?? credential.issuer?.did!,
        mime_type: ClaimMimeType.text_plain,
        preview: false,
      },
      {
        key: 'expires',
        label: t('Documents.expiresFieldLabel'),
        value: moment(credential.expires).format('DD.MM.YYYY'),
        mime_type: ClaimMimeType.text_plain,
        preview: true,
      },
    ]

    if (!credential.properties.length) return additionalFields

    return credential.properties
      .filter((p) => !nonOptionalFields.includes(p.key as ClaimKeys))
      .map(({ label, value, key, preview, mime_type }, i) => ({
        key: key ?? `generatedKey${i}`,
        label: label ?? t('Documents.unspecifiedField'),
        value: value ?? t('Documents.unspecifiedField'),
        mime_type,
        preview,
      }))
      .concat(additionalFields)
  }

  return { nonOptionalFields, getOptionalFields, getPreviewFields }
}
