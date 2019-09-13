import { routeList } from '../routeList'
import strings from '../locales/strings'
import ErrorCode from './errorCodes'
export { ErrorCode }

export class AppError extends Error {
  // private code: ErrorCode
  public origError: any
  navigateTo: routeList

  public constructor(
    code = ErrorCode.Unknown,
    origError?: any,
    navigateTo: routeList = routeList.AppInit,
  ) {
    super(strings[code] || strings[ErrorCode.Unknown])
    // this.code = code
    this.origError = origError
    this.navigateTo = navigateTo
  }
}

export const errorTitleMessages = [strings.DAMN, strings.OH_NO, strings.UH_OH]
