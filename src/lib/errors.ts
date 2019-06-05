import strings from '../locales/strings'
import ErrorCode from './errorCodes'

export class AppError extends Error {
  // private code: ErrorCode
  public origError: any

  public constructor(code = ErrorCode.Unknown, origError?: any) {
    super(strings[code] || strings[ErrorCode.Unknown])
    // this.code = code
    this.origError = origError
  }
}

export const errorTitleMessages = [strings.DAMN, strings.OH_NO, strings.UH_OH]
