import { strings } from '~/translations'

export enum SWErrorCodes {
  SWUnknown = 'SWUnknown',
  SWAgentNotFound = 'SWAgentNotFound',
  SWFailedLoadIdentity = 'SWFailedLoadIdentity',
  SWSeedNotFound = 'SWSeedNotFound',
  SWInteractioNotFound = 'InteractionNotFound',
  SWInteractionRequestMissingDocuments = 'SWInteractionRequestMissingDocuments',
  SWInteractionUnknownError = 'SWInteractionUnknownError'
}

export const UIErrors: Partial<
  Record<SWErrorCodes, { title: string; message: string }>
> = {
  [SWErrorCodes.SWUnknown]: {
    title: strings.UNKNOWN_ERROR,
    message:
      strings.AND_IF_THIS_IS_NOT_THE_FIRST_TIME_WE_STRONGLY_RECOMMEND_LETTING_US_KNOW,
  },
  [SWErrorCodes.SWInteractionRequestMissingDocuments]: {
    title: strings.SHARE_MISSING_DOCS_TITLE,
    message: strings.SHARE_MISSING_DOCS_MSG,
  },
  [SWErrorCodes.SWInteractionUnknownError]: {
    title: strings.INTERACTION_ERROR_TITLE,
    message: strings.INTERACTION_ERROR_MESSAGE,
  }
}

interface IUIError extends Error {
  message: SWErrorCodes
} 

export function isUIError(error: Error): error is IUIError {
  return Object.values(SWErrorCodes).includes(error.message)
}


export function isError(error: any): error is Error {
  return error instanceof Error;
}
