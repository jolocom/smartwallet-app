import React, { useRef, useState, useEffect } from 'react'
import { View, StyleSheet } from 'react-native'
import { useDispatch } from 'react-redux'

import ScreenContainer from '~/components/ScreenContainer'
import Header from '~/components/Header'

import useRedirectTo from '~/hooks/useRedirectTo'
import { ScreenNames } from '~/types/screens'
import { LoaderTypes } from '~/types/loader'
import { generateSecureRandomBytes } from '~/utils/generateBytes'
import { setLoader, dismissLoader } from '~/modules/loader/actions'
import { LoaderMsgs } from '~/translations/strings'
import SDK from '~/utils/SDK'

import { EntropyIntro } from './EntropyIntro'
import { EntropyGenerator } from './EntropyGenerator'
import { EntropyCanvas } from './EntropyCanvas'

const ENOUGH_ENTROPY_PROGRESS = 0.3

export const Entropy: React.FC = () => {
  const redirectToSeedPhrase = useRedirectTo(ScreenNames.SeedPhrase)
  const dispatch = useDispatch()

  const [entropyProgress, setProgress] = useState(0)
  const [isTouched, setTouched] = useState(false)

  const entropyGenerator = useRef(new EntropyGenerator()).current

  const submitEntropy = async (entropy: string) => {
    dispatch(setLoader({ type: LoaderTypes.default, msg: LoaderMsgs.CREATING }))
    try {
      await SDK.createIdentity(entropy)

      dispatch(
        setLoader({ type: LoaderTypes.success, msg: LoaderMsgs.SUCCESS }),
      )

      setTimeout(() => {
        dispatch(dismissLoader())
        redirectToSeedPhrase()
      }, 0)
    } catch (err) {
      dispatch(setLoader({ type: LoaderTypes.error, msg: LoaderMsgs.FAILED }))
    }
  }

  const supplementEntropyProgress = async () => {
    while (entropyGenerator.getProgress() < 1) {
      const moreEntropy = await generateSecureRandomBytes(512)
      // NOTE do not use moreEntropy.forEach, Buffer API is inconsistent, it
      // doesn't work in some envirtonments
      for (let i = 0; i < moreEntropy.length; i++) {
        entropyGenerator.addFromDelta(moreEntropy[i])
      }
    }
  }

  const updateProgress = () => {
    const progress = entropyGenerator.getProgress() / ENOUGH_ENTROPY_PROGRESS
    setProgress(progress >= 1 ? 1 : progress)
  }

  useEffect(() => {
    if (entropyProgress === 1) {
      ;(async () => {
        await supplementEntropyProgress()
        submitEntropy(entropyGenerator.generateRandomString(4))
      })()
    }

    // don't forget to cleanup
  }, [entropyProgress])

  const addPoint = async (x: number, y: number) => {
    if (!isTouched) setTouched(true)

    entropyGenerator.addFromDelta(x)
    entropyGenerator.addFromDelta(y)

    updateProgress()
  }

  return (
    <ScreenContainer>
      {isTouched ? (
        <View style={styles.percentage}>
          <Header>{`${Math.trunc(entropyProgress * 100)} %`}</Header>
        </View>
      ) : (
        <EntropyIntro />
      )}
      <EntropyCanvas disabled={entropyProgress === 1} addPoint={addPoint} />
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
