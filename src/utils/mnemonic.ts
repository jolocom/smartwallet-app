const bip39 = require('bip39')

export const getSuggestedSeedKeys = (chars: string) => {
  return bip39.wordlists.EN.filter((word: string): boolean => {
    return word.startsWith(chars.trim())
  })
}
