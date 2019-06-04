import en from '../locales/en'
import ErrorCode from './errorCodes'

export class AppError extends Error {
  // private code: ErrorCode
  public origError: any

  public constructor(code = ErrorCode.Unknown, origError?: any) {
    super(en[code] || en[ErrorCode.Unknown])
    // this.code = code
    this.origError = origError
  }
}

export const errorTitleMessages = [en.DAMN, en.OH_NO, en.UH_OH]
