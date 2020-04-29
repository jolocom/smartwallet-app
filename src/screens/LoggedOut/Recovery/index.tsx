import React from 'react'
import { View, StyleSheet } from 'react-native'

import ScreenContainer from '~/components/ScreenContainer'
import Header from '~/components/Header'
import Btn, { BtnTypes } from '~/components/Btn'
import BtnGroup from '~/components/BtnGroup'

import useRedirectTo from '~/hooks/useRedirectTo'
import { ScreenNames } from '~/types/screens'
import Paragraph from '~/components/Paragraph'
import Input from './Input'

const Recovery: React.FC = ({ navigation }) => {
  const redirectToSeedPhrase = useRedirectTo(ScreenNames.SeedPhrase)

  return (
    <ScreenContainer>
      <View style={styles.body}>
        <View style={styles.header}>
          <Header>Recovery</Header>
          <Paragraph>
            Start entering your seed-phrase word by word and it will appear here{' '}
          </Paragraph>
        </View>
        <Input />
      </View>
      <BtnGroup>
        <Btn onPress={redirectToSeedPhrase}>Create Identity</Btn>
        <Btn type={BtnTypes.secondary} onPress={redirectToSeedPhrase}>
          Back to walkthrough
        </Btn>
      </BtnGroup>
    </ScreenContainer>
  )
}

const styles = StyleSheet.create({
  body: {
    flex: 0.5,
    width: '100%',
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
  },
})

export default Recovery
