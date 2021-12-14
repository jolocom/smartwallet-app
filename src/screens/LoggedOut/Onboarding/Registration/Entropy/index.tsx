import React, { useEffect } from 'react'

import { useReplaceWith } from '~/hooks/navigation'
import { ScreenNames } from '~/types/screens'

import { useGenerateSeed } from '~/hooks/sdk'
import { useLoader } from '~/hooks/loader'
import useTranslation from '~/hooks/useTranslation'

const Entropy: React.FC = () => {
  const replaceWith = useReplaceWith()
  const generateSeed = useGenerateSeed()
  const loader = useLoader()
  const { t } = useTranslation()

  const submitEntropy = async () => {
    const handleDone = (error: any) => {
      if (!error) {
        return replaceWith(ScreenNames.SeedPhraseWrite)
      }
      return replaceWith(ScreenNames.Entropy)
    }
    await loader(
      generateSeed,
      { showSuccess: false, loading: t('Entropy.loader') },
      handleDone,
    )
  }

  useEffect(() => {
    submitEntropy()
  }, [])

  return null
}

export default Entropy
