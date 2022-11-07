import { CredentialManifestDisplayMapping } from '@jolocom/protocol-ts'
import {
  AuthenticationFlowState,
  AuthorizationFlowState,
  CredentialOfferFlowState,
  CredentialRequestFlowState,
} from '@jolocom/sdk/js/interactionManager/types'

import { FlowType, IdentitySummary, Interaction } from 'react-native-jolocom'
import useTranslation from '~/hooks/useTranslation'
import { CredOfferI } from '~/modules/interaction/types'
import { AttributeTypes } from '~/types/credentials'
import { getCounterpartyName } from '~/utils/dataMapping'
import { useInitDocuments } from '../documents'
import {
  DocumentProperty,
  DocumentsSortingType,
  PropertyMimeType,
} from '../documents/types'
import { useToasts } from '../toasts'

const authenticationHandler = (state: AuthenticationFlowState) => ({
  description: state.description,
})

const authorizationHandler = (state: AuthorizationFlowState) => ({
  action: state.action,
  description: state.description,
  imageURL: state.imageURL,
})

const credentialOfferHandler = (
  state: CredentialOfferFlowState,
  initiator: IdentitySummary,
): Omit<CredOfferI, 'flowType' | 'id' | 'counterparty'> => {
  return {
    credentials: {
      service_issued: state.offerSummary.map(({ type, credential }) => {
        const previewKeys: string[] = []
        const properties = credential?.display?.properties?.map(
          ({ path, text, preview, mime_type, ...rest }) => {
            const key = path![0].toString()
            if (preview) {
              previewKeys.push(key)
            }
            return {
              ...rest,
              key,
              preview: preview ?? false,
              mime_type: mime_type as unknown as PropertyMimeType,
            }
          },
        )

        return {
          type,
          name: credential?.name ?? '',
          style: {
            backgroundImage: credential?.styles?.background?.image_url?.uri,
            backgroundColor: credential?.styles?.background?.color,
          },
          issuer: {
            did: initiator.did,
            icon: initiator.publicProfile?.image,
            name: initiator.publicProfile?.name,
          },
          previewKeys: previewKeys || [],
          properties: properties || [],
        }
      }),
    },
  }
}

/**
 * 1. Use it to check whatever logic should happen before
 * mapping interaction to the wallet UI structure
 * (process data, etc. for a given type of interaction)
 * before we dispatch interaction details into redux store
 * 2. Map interaction details to the wallet UI structure
 */
export const useInteractionHandler = () => {
  const { t } = useTranslation()
  const { scheduleWarning } = useToasts()
  const { queryCredentials, sortDocuments, toDocument, splitAttributes } =
    useInitDocuments()

  return async (interaction: Interaction) => {
    const { state, initiator } = interaction.getSummary()
    const serviceName = getCounterpartyName(initiator)

    let flowSpecificData

    switch (interaction.flow.type) {
      case FlowType.Authorization: {
        flowSpecificData = authorizationHandler(
          state as AuthenticationFlowState,
        )
        break
      }
      case FlowType.Authentication: {
        flowSpecificData = authenticationHandler(
          state as AuthorizationFlowState,
        )
        break
      }
      case FlowType.CredentialOffer: {
        flowSpecificData = credentialOfferHandler(
          state as CredentialOfferFlowState,
          initiator,
        )
        break
      }
      case FlowType.CredentialShare: {
        const shareState = state as CredentialRequestFlowState
        const requestedTypes =
          shareState.constraints[0].requestedCredentialTypes

        // NOTE: The query doesn't work as expected. Have to find manually, which is slow :(
        const { attributes, rest } = await queryCredentials(
          requestedTypes.map((t) => ({ type: t })),
        )
          .then((creds) =>
            creds.filter((cred) => {
              if (
                requestedTypes.find(
                  (t) => t[t.length - 1] === cred.type[cred.type.length - 1],
                )
              ) {
                return true
              }

              return false
            }),
          )
          .then((creds) => splitAttributes(creds))

        const documents = await Promise.all(rest.map(toDocument)).then((docs) =>
          sortDocuments(docs, DocumentsSortingType.issuanceDate),
        )

        const missingDocuments = requestedTypes
          .map((t) => t[t.length - 1])
          .filter((t) => {
            const isAttribute = Object.values(AttributeTypes).includes(
              t as AttributeTypes,
            )

            if (isAttribute) return false
            return !documents.find((d) => d.type[d.type.length - 1] === t)
          })

        const specificRequestedTypes = requestedTypes.map(
          (t) => t[t.length - 1],
        )

        flowSpecificData = {
          credentials: documents,
          attributes: attributes,
          requestedTypes: specificRequestedTypes,
          selectedCredentials: {},
        }

        if (missingDocuments.length) {
          flowSpecificData = undefined
          // FIXME: there is an issue with the strings here, will be fixed when the
          // i18n and PoEditor are properly set up.
          scheduleWarning({
            title: t('Toasts.shareMissingDocsTitle'),
            message: t('Toasts.shareMissingDocsMsg', {
              serviceName,
              documentType: missingDocuments.join(', '),
            }),
          })
        }

        break
      }

      default:
        // TODO: Define error and use translations
        throw new Error('Interaction not supported')
    }

    return flowSpecificData
  }
}
