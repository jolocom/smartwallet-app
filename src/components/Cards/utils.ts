export const getTrimmedHighlight = (highlight?: string) => {
  if (highlight) {
    return highlight?.length > 14 ? highlight?.slice(0, 14) + '...' : highlight
  } else {
    return undefined
  }
}
