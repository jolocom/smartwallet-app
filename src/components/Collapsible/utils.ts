import { TTitle } from './types'

export const compare = (a: TTitle, b: TTitle): number => {
  if (a.startY < b.startY) {
    return -1
  }
  if (a.startY > b.startY) {
    return 1
  }
  return 0
}
