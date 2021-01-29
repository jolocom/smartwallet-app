import { RecordAssembler } from '~/middleware/records/recordAssembler'
import { FlowType } from '@jolocom/sdk'
import { recordConfig } from '~/config/records'
import { IRecordStatus } from '~/types/records'
import { InteractionType } from 'jolocom-lib/js/interactionTokens/types'

const addDays = (days: number) => {
  var result = new Date()
  result.setDate(result.getDate() + days)
  return result.getTime()
}

const subDays = (days: number) => {
  var result = new Date()
  result.setDate(result.getDate() - days)
  return result.getTime()
}

const buildSummary = (state: any) => ({
  summary: { initiator: { did: 'test' }, state },
})

const genericArgs = {
  lastMessageDate: Date.now(),
  expirationDate: addDays(1),
  config: recordConfig,
}

const genericAuthArgs = {
  ...genericArgs,
  ...buildSummary({ description: 'test' }),
  messageTypes: [
    InteractionType.Authentication,
    InteractionType.Authentication,
  ],
  flowType: FlowType.Authentication,
}

const genericAuthzArgs = {
  ...genericArgs,
  ...buildSummary({ action: 'test' }),
  messageTypes: ['AuthorizationRequest', 'AuthorizationResponse'],
  flowType: FlowType.Authorization,
}

const genericOfferArgs = {
  ...genericArgs,
  ...buildSummary({
    offerSummary: [{ type: 'test-type' }],
    issued: [{ type: 'test-type', name: 'test-name' }],
  }),
  flowType: FlowType.CredentialOffer,
  messageTypes: [
    InteractionType.CredentialOfferRequest,
    InteractionType.CredentialOfferResponse,
    InteractionType.CredentialsReceive,
  ],
}

const genericRequestArgs = {
  ...genericArgs,
  ...buildSummary({
    providedCredentials: [
      { suppliedCredentials: [{ name: 'test-cred-name' }] },
    ],
    requestedCredentials: [
      { requestedCredentialTypes: [{ name: 'test-cred-type' }] },
    ],
  }),
  flowType: FlowType.CredentialOffer,
  messageTypes: [
    InteractionType.CredentialOfferRequest,
    InteractionType.CredentialOfferResponse,
    InteractionType.CredentialsReceive,
  ],
}

describe('Record Assembler', () => {
  describe('Status', () => {
    it('should calculate the expiration of the record correctly', () => {
      const assembler = new RecordAssembler({
        ...genericAuthArgs,
        messageTypes: [InteractionType.Authentication],
        expirationDate: subDays(1),
      })
      expect(assembler.getRecordDetails().status).toEqual(IRecordStatus.expired)
    })

    describe('should correctly find the non-expired status for', () => {
      describe('authentication', () => {
        it('pending', () => {
          const assembler = new RecordAssembler({
            ...genericAuthArgs,
            messageTypes: [InteractionType.Authentication],
          })
          expect(assembler.getRecordDetails().status).toEqual(
            IRecordStatus.pending,
          )
        })

        it('finished', () => {
          const assembler = new RecordAssembler({
            ...genericAuthArgs,
          })
          expect(assembler.getRecordDetails().status).toEqual(
            IRecordStatus.finished,
          )
        })
      })

      describe('authorization', () => {
        it('pending', () => {
          const assembler = new RecordAssembler({
            ...genericAuthzArgs,
            messageTypes: ['AuthorizationRequest'],
          })
          expect(assembler.getRecordDetails().status).toEqual(
            IRecordStatus.pending,
          )
        })

        it('finished', () => {
          const assembler = new RecordAssembler({
            ...genericAuthzArgs,
          })
          expect(assembler.getRecordDetails().status).toEqual(
            IRecordStatus.finished,
          )
        })
      })

      describe('credential offer', () => {
        it('pending', () => {
          const assembler = new RecordAssembler({
            ...genericOfferArgs,
            messageTypes: [
              InteractionType.CredentialOfferRequest,
              InteractionType.CredentialOfferResponse,
            ],
          })
          expect(assembler.getRecordDetails().status).toEqual(
            IRecordStatus.pending,
          )
        })
        it('finished', () => {
          const assembler = new RecordAssembler({
            ...genericOfferArgs,
            messageTypes: [
              InteractionType.CredentialOfferRequest,
              InteractionType.CredentialOfferResponse,
              InteractionType.CredentialsReceive,
            ],
          })
          expect(assembler.getRecordDetails().status).toEqual(
            IRecordStatus.finished,
          )
        })
      })
    })
  })
})
