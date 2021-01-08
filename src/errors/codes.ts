import { strings } from '~/translations'

export enum SWErrorCodes {
  SWUnknown = 'SWUnknown',
  SWAgentNotFound = 'SWAgentNotFound',
  SWFailedLoadIdentity = 'SWFailedLoadIdentity',
  SWSeedNotFound = 'SWSeedNotFound',
  SWInteractioNotFound = 'InteractionNotFound',
}

export const UIErrors: Partial<
  Record<SWErrorCodes, { title: string; message: string }>
> = {
  [SWErrorCodes.SWUnknown]: {
    title: strings.UNKNOWN_ERROR,
    message:
      strings.AND_IF_THIS_IS_NOT_THE_FIRST_TIME_WE_STRONGLY_RECOMMEND_LETTING_US_KNOW,
  },
}
