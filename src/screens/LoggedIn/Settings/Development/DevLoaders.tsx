import React from 'react'

import { useLoader, LoaderConfig } from '~/hooks/loader'
import ScreenContainer from '~/components/ScreenContainer'
import Btn, { BtnTypes } from '~/components/Btn'
import Section from '../components/Section'
import { View } from 'react-native'

const LoaderTest = () => {
  const loader = useLoader()

  const showLoader = (config: LoaderConfig = {}) =>
    loader(
      async () => {
        return new Promise((res, rej) => {
          setTimeout(() => {
            if (config.showFailed) {
              rej('oops')
            } else {
              res('done')
            }
          }, 8000)
        })
      },
      { showSuccess: false, showFailed: false, ...config },
    )

  return (
    <ScreenContainer hasHeaderBack>
      <Section.Title>Loaders</Section.Title>
      <View style={{ flex: 1, marginTop: 30, width: '100%' }}>
        <Btn
          type={BtnTypes.quinary}
          onPress={() => showLoader({ showSuccess: true })}
        >
          Success
        </Btn>
        <Btn
          type={BtnTypes.quaternary}
          onPress={() => showLoader({ showFailed: true })}
        >
          Failed
        </Btn>
        <Btn type={BtnTypes.senary} onPress={() => showLoader()}>
          Loading
        </Btn>
      </View>
    </ScreenContainer>
  )
}

export default LoaderTest
