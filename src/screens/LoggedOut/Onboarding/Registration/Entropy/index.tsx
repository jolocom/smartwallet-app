import React, { useRef, useState, useEffect, useCallback } from 'react'
import { View, StyleSheet } from 'react-native'

import ScreenContainer from '~/components/ScreenContainer'

import { useReplaceWith } from '~/hooks/navigation'
import { ScreenNames } from '~/types/screens'
import { generateSecureRandomBytes } from '~/utils/generateBytes'

import { EntropyIntro } from './EntropyIntro'
import { EntropyGenerator } from './EntropyGenerator'
import { EntropyCanvas } from './EntropyCanvas'
import { Colors } from '~/utils/colors'
import JoloText, { JoloTextKind } from '~/components/JoloText'
import { JoloTextSizes } from '~/utils/fonts'
import { useGenerateSeed } from '~/hooks/sdk'
import { useLoader } from '~/hooks/loader'

//NOTE: Determines the duration of entropy collection
const ENOUGH_ENTROPY_PROGRESS = 0.3

const Entropy: React.FC = () => {
  const replaceWith = useReplaceWith()
  const generateSeed = useGenerateSeed()
  const loader = useLoader()

  //NOTE: not using the user generated entropy
  const submitEntropy = async (entropy: string) => {
    const handleDone = (error: any) => {
      if (!error) {
        return replaceWith(ScreenNames.SeedPhraseWrite)
      }
      return replaceWith(ScreenNames.Entropy)
    }
    await loader(generateSeed, { showSuccess: false }, handleDone)
  }

  const { entropyProgress, addPoint } = useEntropyProgress(submitEntropy)

  return (
    <ScreenContainer>
      {!!entropyProgress ? (
        <View style={styles.percentage}>
          <JoloText
            kind={JoloTextKind.title}
            size={JoloTextSizes.middle}
            color={Colors.white85}
          >{`${Math.trunc(entropyProgress * 100)} %`}</JoloText>
        </View>
      ) : (
        <EntropyIntro />
      )}
      <EntropyCanvas disabled={entropyProgress === 1} addPoint={addPoint} />
    </ScreenContainer>
  )
}

export const useEntropyProgress = (submit: (entropy: string) => void) => {
  const [entropyProgress, setProgress] = useState(0)

  let entropyGenerator = useRef(new EntropyGenerator())

  useEffect(() => {
    if (entropyProgress === 1) {
      ;(async () => {
        await supplementEntropyProgress()
        submit(entropyGenerator.current.generateRandomString(4))
      })()
    }
  }, [entropyProgress])

  const supplementEntropyProgress = async () => {
    while (entropyGenerator.current.getProgress() < 1) {
      const moreEntropy = await generateSecureRandomBytes(512)
      // NOTE do not use moreEntropy.forEach, Buffer API is inconsistent, it
      // doesn't work in some envirtonments
      for (let i = 0; i < moreEntropy.length; i++) {
        entropyGenerator.current.addFromDelta(moreEntropy[i])
      }
    }
  }

  const updateProgress = () => {
    const progress =
      entropyGenerator.current.getProgress() / ENOUGH_ENTROPY_PROGRESS
    setProgress(progress >= 1 ? 1 : progress)
  }

  const addPoint = useCallback((x: number, y: number) => {
    entropyGenerator.current.addFromDelta(x)
    entropyGenerator.current.addFromDelta(y)

    updateProgress()
  }, [])

  return { entropyProgress, addPoint, entropyGenerator }
}

const styles = StyleSheet.create({
  percentage: {
    position: 'absolute',
    bottom: '10%',
    alignItems: 'center',
    paddingHorizontal: '5%',
  },
})

export default Entropy
