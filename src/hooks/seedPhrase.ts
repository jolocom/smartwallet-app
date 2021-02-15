import { entropyToMnemonic } from 'bip39'
import { useState, useEffect } from 'react'
import { StorageKeys, useAgent } from './sdk'

export const useGetSeedPhrase = () => {
  const [seedphrase, setSeedphrase] = useState('')
  const agent = useAgent()

  const getMnemonic = async () => {
    const encryptedSeed = await agent.storage.get.setting(
      StorageKeys.encryptedSeed,
    )

    if (!encryptedSeed) {
      throw new Error('Can not retrieve Seed from database')
    }

    const decrypted = await agent.idw.asymDecrypt(
      Buffer.from(encryptedSeed.b64Encoded, 'base64'),
      await agent.passwordStore.getPassword(),
    )

    return entropyToMnemonic(decrypted)
  }

  useEffect(() => {
    getMnemonic().then(setSeedphrase)
  }, [])

  return seedphrase
}
