import { SignedCredential } from 'jolocom-lib/js/credentials/signedCredential/signedCredential'
import { intersectionBy, pick } from 'lodash'
import moment from 'moment'
import { useDispatch, useSelector } from 'react-redux'
import { attributeConfig } from '~/config/claims'
import { getDid } from '~/modules/account/selectors'
import { initAttrs } from '~/modules/attributes/actions'
import { AttributeI, AttrsState } from '~/modules/attributes/types'
import { setCredentials } from '~/modules/credentials/actions'
import { getAllDocuments } from '~/modules/credentials/selectors'
import { AttributeTypes, ClaimKeys } from '~/types/credentials'
import { extractClaims, extractCredentialType } from '~/utils/dataMapping'
import { useAgent } from '../sdk'
import useTranslation from '../useTranslation'
import {
  Document,
  DocumentIssuer,
  DocumentProperty,
  DocumentsSortingType,
  PropertyMimeType,
} from './types'

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

export const useInitDocuments = () => {
  const agent = useAgent()
  const dispatch = useDispatch()
  const did = useSelector(getDid)

  const queryAllCredentials = async () => {
    return agent.credentials.query()
  }

  const getProperties = async (
    credential: SignedCredential,
  ): Promise<{ properties: DocumentProperty[]; previewKeys: string[] }> => {
    const {
      display: { properties },
    } = await agent.credentials.display(credential)

    const previewKeys: string[] = []
    const mappedProperties = properties.map((p) => {
      const base = pick(p, ['key', 'label', 'value', 'mime_type'])
      if (p.preview) previewKeys.push(p.key!)

      return base
    })

    // @ts-expect-error FIXME @migration should remove assertion
    return { properties: mappedProperties as DocumentProperty[], previewKeys }
  }

  const getStyle = async (credential: SignedCredential): DocumentStyle => {
    const { styles } = await agent.credentials.display(credential)

    const heroIcon = styles?.hero?.uri
    const thumbnailIcon = styles?.thumbnail?.uri
    const contextIcons: string[] = []

    if (heroIcon) {
      contextIcons.push(heroIcon)
    }
    if (thumbnailIcon) {
      contextIcons.push(thumbnailIcon)
    }

    return {
      backgroundColor: styles?.background?.image_url?.uri,
      backgroundImage: styles?.background?.color,
      contextIcons,
    }
  }

  const getIssuer = async (
    credential: SignedCredential,
  ): Promise<DocumentIssuer> => {
    const { issuerProfile } = await agent.credentials.types.forCredential(
      credential,
    )

    return {
      did: issuerProfile?.did!,
      name: issuerProfile?.publicProfile?.name,
      icon: issuerProfile?.publicProfile?.image,
    }
  }

  const toDocument = async (
    credential: SignedCredential,
  ): Promise<Document> => {
    // TODO @clauxx: during interaction should check if requested type in inside the array
    const base = pick(credential, [
      'id',
      'issued',
      'expires',
      'type',
      'subject',
      'name',
    ])

    const [{ properties, previewKeys }, style, issuer] = await Promise.all([
      getProperties(credential),
      getStyle(credential),
      getIssuer(credential),
    ])

    return {
      ...base,
      properties,
      previewKeys,
      style,
      issuer,
    }
  }

  const splitAttributes = (credentials: SignedCredential[]) => {
    const attributeCredentials: SignedCredential[] = []
    const rest: SignedCredential[] = []

    credentials.forEach((credential) => {
      const isSelfIssued = credential.issuer === did
      const isAttribute =
        intersectionBy(credential.type, Object.keys(attributeConfig)).length !==
        0

      if (isSelfIssued && isAttribute) {
        attributeCredentials.push(credential)
      } else {
        rest.push(credential)
      }
    })

    const attributes = attributeCredentials.reduce((acc, cred) => {
      const type = extractCredentialType(cred) as AttributeTypes
      const entry = { id: cred.id, value: extractClaims(cred.claim) }
      const prevEntries = acc[type]

      acc[type] = prevEntries ? [...prevEntries, entry] : [entry]
      return acc
    }, {} as AttrsState<AttributeI>)

    return { rest, attributes }
  }

  const sortDocuments = (documents: Document[], type: DocumentsSortingType) => {
    if (type === DocumentsSortingType.issuanceDate) {
      return documents.sort((a, b) => {
        const aMs = new Date(a.issued).getTime()
        const bMs = new Date(b.issued).getTime()
        if (aMs > bMs) {
          return -1
        } else {
          return 1
        }
      })
    } else {
      return documents
    }
  }

  const initialize = async () => {
    const credentials = await queryAllCredentials()
    const { rest, attributes } = splitAttributes(credentials)
    const documents = await Promise.all(rest.map(toDocument))

    dispatch(
      setCredentials(
        sortDocuments(documents, DocumentsSortingType.issuanceDate),
      ),
    )
    dispatch(initAttrs(attributes))
  }

  return { initialize, toDocument }
}
