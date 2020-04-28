import React, { useRef, useState } from 'react'
import { View, StyleSheet } from 'react-native'

import ScreenContainer from '~/components/ScreenContainer'
import useRedirectTo from '~/hooks/useRedirectTo'
import { ScreenNames } from '~/types/screens'
import { EntropyIntro } from './EntropyIntro'
import { EntropyGenerator } from './EntropyGenerator'
import { generateSecureRandomBytes } from '~/utils/generateBytes'
import { EntropyGestures } from './EntropyGestures'
import Header from '~/components/Header'
import { useDispatch } from 'react-redux'
import { setLoader, dismissLoader } from '~/modules/loader/actions'
import { LoaderTypes } from '~/types/loader'
import { LoaderMsgs } from '~/translations/strings'

const ENOUGH_ENTROPY_PROGRESS = 0.3
const POST_COLLECTION_WAIT_TIME = 300

export const Entropy: React.FC = () => {
  const redirectToSeedPhrase = useRedirectTo(ScreenNames.SeedPhrase)
  const dispatch = useDispatch()

  const [entropyProgress, setProgress] = useState(0)
  const [sufficientEntropy, setSufficient] = useState(false)

  const entropyGenerator = useRef(new EntropyGenerator()).current

  const submitEntropy = async (entropy: string) => {
    console.log(entropy)
    dispatch(setLoader({ type: LoaderTypes.default, msg: LoaderMsgs.CREATING }))
    await new Promise((resolve) => setTimeout(resolve, 5000))
    dispatch(setLoader({ type: LoaderTypes.success, msg: LoaderMsgs.SUCCESS }))
    await new Promise((resolve) => setTimeout(resolve, 1000))
    dispatch(dismissLoader())
    redirectToSeedPhrase()
  }

  const updateEntropyProgress = async () => {
    if (entropyProgress >= 1) {
      setSufficient(true)
      setProgress(1)
      while (entropyGenerator.getProgress() < 1) {
        const moreEntropy = await generateSecureRandomBytes(512)
        // NOTE do not use moreEntropy.forEach, Buffer API is inconsistent, it
        // doesn't work in some envirtonments
        for (let i = 0; i < moreEntropy.length; i++) {
          entropyGenerator.addFromDelta(moreEntropy[i])
        }
      }
      setTimeout(
        () => submitEntropy(entropyGenerator.generateRandomString(4)),
        POST_COLLECTION_WAIT_TIME,
      )
    }
  }

  const addPoint = async (x: number, y: number) => {
    if (sufficientEntropy) return

    entropyGenerator.addFromDelta(x)
    entropyGenerator.addFromDelta(y)
    const entropyProgress =
      entropyGenerator.getProgress() / ENOUGH_ENTROPY_PROGRESS
    setProgress(entropyProgress)
    await updateEntropyProgress()
  }

  return (
    <ScreenContainer>
      {entropyProgress === 0 ? (
        <EntropyIntro />
      ) : (
        <View style={styles.percentage}>
          <Header>{`${Math.trunc(entropyProgress * 100)} %`}</Header>
        </View>
      )}
      <EntropyGestures disabled={entropyProgress === 1} addPoint={addPoint} />
    </ScreenContainer>
  )
}

const styles = StyleSheet.create({
  percentage: {
    position: 'absolute',
    bottom: '10%',
    alignItems: 'center',
    paddingHorizontal: '5%',
  },
})
