export const getTrimmedHighlight = (highlight?: string, nrChar = 14) => {
  if (highlight) {
    return highlight?.length > nrChar
      ? highlight?.slice(0, nrChar) + '...'
      : highlight
  } else {
    return undefined
  }
}
