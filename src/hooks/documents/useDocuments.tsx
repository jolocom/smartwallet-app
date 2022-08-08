import moment from 'moment'
import { useSelector } from 'react-redux'
import { getAllDocuments } from '~/modules/credentials/selectors'
import { ClaimKeys } from '~/types/credentials'
import useTranslation from '../useTranslation'
import { Document, DocumentProperty, PropertyMimeType } from './types'

export const useDocuments = () => {
  const { t } = useTranslation()
  const documents = useSelector(getAllDocuments)

  const getHolderName = (doc: Document) => {
    if (!doc.properties.length) return undefined

    const givenName = doc.properties.find((p) => p.key === ClaimKeys.givenName)
    const familyName = doc.properties.find(
      (p) => p.key === ClaimKeys.familyName,
    )

    if (!givenName || !familyName) return undefined

    return `${givenName} ${familyName}`
  }

  const getHolderPhoto = (doc: Document) => {
    return doc.properties.find((p) => p.key === ClaimKeys.photo)?.value
  }

  const hasImageProperties = (doc: Document) => {
    return doc.properties.some(
      (prop) =>
        prop.key !== ClaimKeys.photo &&
        // @ts-expect-error
        prop.mime_type === ClaimMimeType.image_png,
    )
  }

  const getExtraProperties = (doc: Document): DocumentProperty[] => {
    return [
      {
        key: 'issued',
        label: t('Documents.issuedFieldLabel'),
        value: moment(doc.issued).format('DD.MM.YYYY'),
        mime_type: PropertyMimeType.text_plain,
      },
      {
        key: 'issuer',
        label: t('Documents.issuerFieldLabel'),
        value: doc.issuer.name ?? doc.issuer.did,
        mime_type: PropertyMimeType.text_plain,
      },
      {
        key: 'expires',
        label: t('Documents.expiresFieldLabel'),
        value: moment(doc.expires).format('DD.MM.YYYY'),
        mime_type: PropertyMimeType.text_plain,
      },
    ]
  }

  const getPreviewProperties = (doc: Document) => {
    return doc.previewKeys.map(
      (key) => doc.properties.find((property) => property.key === key)!,
    )
  }

  return {
    documents,
    getHolderName,
    getHolderPhoto,
    hasImageProperties,
    getExtraProperties,
    getPreviewProperties,
  }
}
