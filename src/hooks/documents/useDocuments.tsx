import moment from 'moment'
import { useDispatch, useSelector } from 'react-redux'
import { deleteCredential } from '~/modules/credentials/actions'
import {
  getAllDocuments,
  getExpiredDocuments,
  getValidDocuments,
} from '~/modules/credentials/selectors'
import { ClaimKeys } from '~/types/credentials'
import { useAgent } from '../sdk'
import useTranslation from '../useTranslation'
import { Document, DocumentProperty, PropertyMimeType } from './types'

export const useDocuments = () => {
  const { t } = useTranslation()
  const agent = useAgent()
  const dispatch = useDispatch()
  const documents = useSelector(getAllDocuments)
  const expiredDocuments = useSelector(getExpiredDocuments)
  const validDocuments = useSelector(getValidDocuments)

  const deleteDocument = async (id: string) => {
    await agent.credentials.delete({ id })
    dispatch(deleteCredential(id))
  }

  const getDocumentById = (id: string) => {
    return documents.find((d) => d.id === id)
  }

  const getHolderName = (doc: Document) => {
    if (!doc.properties.length) return undefined

    const givenName = doc.properties.find((p) => p.key === ClaimKeys.givenName)
    const familyName = doc.properties.find(
      (p) => p.key === ClaimKeys.familyName,
    )

    if (!givenName || !familyName) return undefined

    return `${givenName.value} ${familyName.value}`
  }

  const getHolderPhoto = (doc: Document) => {
    return doc.properties.find((p) => p.key === ClaimKeys.photo)?.value
  }

  const hasImageProperties = (doc: Document) => {
    return doc.properties.some(
      (prop) =>
        prop.key !== ClaimKeys.photo &&
        prop.mime_type === PropertyMimeType.image_png,
    )
  }

  const getExtraProperties = (doc: Document): DocumentProperty[] => {
    return [
      {
        key: 'issued',
        label: t('Documents.issuedFieldLabel'),
        value: moment(doc.issued).format('DD.MM.YYYY'),
        mime_type: PropertyMimeType.text_plain,
        preview: false,
      },
      {
        key: 'issuer',
        label: t('Documents.issuerFieldLabel'),
        value: doc.issuer.name ?? doc.issuer.did,
        mime_type: PropertyMimeType.text_plain,
        preview: false,
      },
      {
        key: 'expires',
        label: t('Documents.expiresFieldLabel'),
        value: moment(doc.expires).format('DD.MM.YYYY'),
        mime_type: PropertyMimeType.text_plain,
        preview: false,
      },
    ]
  }

  const getPreviewProperties = (doc: Document) => {
    let previewFields: DocumentProperty[] = []

    if (doc.previewKeys.length) {
      previewFields = doc.previewKeys.map(
        (key) => doc.properties.find((property) => property.key === key)!,
      )
    } else if (doc.properties.length) {
      previewFields = doc.properties.filter(
        (prop) =>
          prop.key !== ClaimKeys.photo &&
          prop.key !== ClaimKeys.givenName &&
          prop.key !== ClaimKeys.familyName,
      )
    }

    return previewFields
  }

  return {
    documents,
    expiredDocuments,
    validDocuments,
    deleteDocument,
    getDocumentById,
    getHolderName,
    getHolderPhoto,
    hasImageProperties,
    getExtraProperties,
    getPreviewProperties,
  }
}
