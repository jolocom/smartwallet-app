export const utf8ToBase64Image = (utf8: number[]): string => {
  return `${Buffer.from(utf8).toString('base64')}`
}
