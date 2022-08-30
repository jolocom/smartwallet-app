import { SignedCredential } from 'jolocom-lib/js/credentials/signedCredential/signedCredential'
import { intersectionBy, pick } from 'lodash'
import { useDispatch, useSelector } from 'react-redux'
import { attributeConfig } from '~/config/claims'
import { getDid } from '~/modules/account/selectors'
import { initAttrs } from '~/modules/attributes/actions'
import { AttributeI, AttrsState } from '~/modules/attributes/types'
import { setCredentials } from '~/modules/credentials/actions'
import { AttributeTypes } from '~/types/credentials'
import { extractClaims, extractCredentialType } from '~/utils/dataMapping'
import { useAgent } from '../sdk'
import {
  Document,
  DocumentIssuer,
  DocumentProperty,
  DocumentsSortingType,
  DocumentStyle,
} from './types'

export const useInitDocuments = () => {
  const agent = useAgent()
  const dispatch = useDispatch()
  const did = useSelector(getDid)

  //NOTE: The query can be moved as a separate type
  const queryCredentials = async (query?: { type: string[] }[]) => {
    return agent.credentials.query(query)
  }

  const getProperties = async (
    credential: SignedCredential,
  ): Promise<{ properties: DocumentProperty[]; previewKeys: string[] }> => {
    const {
      display: { properties },
    } = await agent.credentials.display(credential)

    const previewKeys: string[] = []
    const mappedProperties = properties.map((p) => {
      const base = pick(p, ['key', 'label', 'value', 'mime_type', 'preview'])
      if (p.preview) previewKeys.push(p.key!)

      return base
    })

    // @ts-expect-error FIXME @migration should remove assertion
    return { properties: mappedProperties as DocumentProperty[], previewKeys }
  }

  const getStyle = async (
    credential: SignedCredential,
  ): Promise<DocumentStyle> => {
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
      backgroundImage: styles?.background?.image_url?.uri,
      backgroundColor: styles?.background?.color,
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
    const credentials = await queryCredentials()
    const { rest, attributes } = splitAttributes(credentials)
    const documents = await Promise.all(rest.map(toDocument))

    dispatch(
      setCredentials(
        sortDocuments(documents, DocumentsSortingType.issuanceDate),
      ),
    )
    dispatch(initAttrs(attributes))
  }

  return {
    initialize,
    toDocument,
    queryCredentials,
    sortDocuments,
    splitAttributes,
  }
}
