import { RecordAssembler } from '~/middleware/records/recordAssembler'
import { FlowType } from '@jolocom/sdk'
// import { recordConfig } from '~/config/records'
import { IRecordStatus } from '~/types/records'
import { InteractionType } from 'jolocom-lib/js/interactionTokens/types'
import truncateDid from '~/utils/truncateDid'
import { capitalizeWord } from '~/utils/stringUtils'
import { recordConfig } from '~/hooks/history/utils'

const mockedConfig = recordConfig

const addDays = (days: number) => {
  const result = new Date()
  result.setDate(result.getDate() + days)
  return result.getTime()
}

const subDays = (days: number) => {
  const result = new Date()
  result.setDate(result.getDate() - days)
  return result.getTime()
}

const buildSummary = <T>(state: T) => ({
  summary: { initiator: { did: 'test' }, state },
})

const genericArgs = {
  lastMessageDate: Date.now(),
  expirationDate: addDays(1),
  config: mockedConfig,
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
    offerSummary: [{ type: 'test-type', credential: { name: 'test-name' } }],
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
    constraints: [{ requestedCredentialTypes: [{ name: 'test-cred-type' }] }],
  }),
  flowType: FlowType.CredentialShare,
  messageTypes: [
    InteractionType.CredentialRequest,
    InteractionType.CredentialResponse,
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
          })
          expect(assembler.getRecordDetails().status).toEqual(
            IRecordStatus.finished,
          )
        })
      })

      describe('credential request', () => {
        it('pending', () => {
          const assembler = new RecordAssembler({
            ...genericRequestArgs,
            messageTypes: [InteractionType.CredentialRequest],
          })
          expect(assembler.getRecordDetails().status).toEqual(
            IRecordStatus.pending,
          )
        })
        it('finished', () => {
          const assembler = new RecordAssembler({
            ...genericRequestArgs,
          })
          expect(assembler.getRecordDetails().status).toEqual(
            IRecordStatus.finished,
          )
        })
      })
    })
  })

  describe('Steps', () => {
    it('should add an additional step if the record was un-finished', () => {
      const assembler = new RecordAssembler({
        ...genericAuthArgs,
        messageTypes: [InteractionType.Authentication],
        expirationDate: subDays(1),
      })
      const steps = assembler.getRecordDetails().steps

      expect(steps[steps.length - 1]).toStrictEqual({
        title: mockedConfig.flows.Authentication?.steps.unfinished[1],
        description: 'History.expiredState',
      })
    })

    it('should return the correct authentication steps', () => {
      const assembler = new RecordAssembler(genericAuthArgs)

      const expectedSteps =
        mockedConfig.flows.Authentication?.steps.finished.map((title) => ({
          title,
          description: truncateDid(genericAuthArgs.summary.initiator.did),
        }))

      expect(assembler.getRecordDetails().steps).toEqual(expectedSteps)
    })

    it('should return the correct authorization steps', () => {
      const assembler = new RecordAssembler(genericAuthzArgs)

      const expectedSteps =
        mockedConfig.flows.Authorization?.steps.finished.map((title) => ({
          title,
          description: capitalizeWord(genericAuthzArgs.summary.state.action),
        }))

      expect(assembler.getRecordDetails().steps).toEqual(expectedSteps)
    })

    it('should return the correct offer steps', () => {
      const assembler = new RecordAssembler(genericOfferArgs)

      const expectedSteps =
        mockedConfig.flows.CredentialOffer?.steps.finished.map((title, i) => ({
          title,
          description:
            i !== 2
              ? genericOfferArgs.summary.state.offerSummary
                  .map((s) => s.credential.name)
                  .join(', ')
              : genericOfferArgs.summary.state.issued
                  .map((s) => s.name)
                  .join(', '),
        }))

      expect(assembler.getRecordDetails().steps).toEqual(expectedSteps)
    })

    it('should return the correct share steps', () => {
      const assembler = new RecordAssembler(genericRequestArgs)

      const expectedSteps =
        mockedConfig.flows.CredentialShare?.steps.finished.map((title) => ({
          title,
          description:
            genericRequestArgs.summary.state.providedCredentials[0].suppliedCredentials
              .map((c) => c.name)
              .join(', '),
        }))

      expect(assembler.getRecordDetails().steps).toEqual(expectedSteps)
    })
  })
})
