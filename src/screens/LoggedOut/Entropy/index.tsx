import React, { useRef, useState, useEffect, useCallback } from 'react'
import { View, StyleSheet } from 'react-native'

import ScreenContainer from '~/components/ScreenContainer'
import Header from '~/components/Header'

import useRedirectTo from '~/hooks/useRedirectTo'
import { useLoader } from '~/hooks/useLoader'
import { ScreenNames } from '~/types/screens'
import { generateSecureRandomBytes } from '~/utils/generateBytes'
import { strings } from '~/translations/strings'

import { EntropyIntro } from './EntropyIntro'
import { EntropyGenerator } from './EntropyGenerator'
import { EntropyCanvas } from './EntropyCanvas'
import { useSDK } from '~/utils/sdk/context'
import { useDispatch } from 'react-redux'
import { setDid } from '~/modules/account/actions'

const ENOUGH_ENTROPY_PROGRESS = 0.3

const Entropy: React.FC = () => {
  const redirectToSeedPhrase = useRedirectTo(ScreenNames.SeedPhrase)
  const SDK = useSDK()
  const loader = useLoader()
  const dispatch = useDispatch()

  const submitEntropy = async (entropy: string, onError: () => void) => {
    const entropyBuffer = new Buffer(entropy, 'hex')

    const success = await loader(
      async () => {
        const iw = await SDK.bemw.createNewIdentity(entropyBuffer)
        console.log({ iw })

        dispatch(setDid(iw.did))
      },
      {
        showStatus: true,
        loading: strings.CREATING,
      },
    )

    if (success) redirectToSeedPhrase()
    else onError()
  }

  const { entropyProgress, addPoint, isCanvasReady } = useEntropyProgress(
    submitEntropy,
  )

  return (
    <ScreenContainer>
      {!!entropyProgress ? (
        <View style={styles.percentage}>
          <Header>{`${Math.trunc(entropyProgress * 100)} %`}</Header>
        </View>
      ) : (
        <EntropyIntro />
      )}
      {isCanvasReady && (
        <EntropyCanvas disabled={entropyProgress === 1} addPoint={addPoint} />
      )}
    </ScreenContainer>
  )
}

export const useEntropyProgress = (
  submit: (entropy: string, onError: () => void) => void,
) => {
  const [entropyProgress, setProgress] = useState(0)
  const [isCanvasReady, setIsCanvasRready] = useState(true)

  let entropyGenerator = useRef(new EntropyGenerator())

  useEffect(() => {
    if (entropyProgress === 1) {
      ;(async () => {
        await supplementEntropyProgress()
        submit(entropyGenerator.current.generateRandomString(4), resetProgress)
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

  const resetProgress = () => {
    setIsCanvasRready(false)
    setProgress(0)
    setIsCanvasRready(true)
    entropyGenerator.current = new EntropyGenerator()
  }

  const addPoint = useCallback((x: number, y: number) => {
    entropyGenerator.current.addFromDelta(x)
    entropyGenerator.current.addFromDelta(y)

    updateProgress()
  }, [])

  return { entropyProgress, addPoint, entropyGenerator, isCanvasReady }
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
