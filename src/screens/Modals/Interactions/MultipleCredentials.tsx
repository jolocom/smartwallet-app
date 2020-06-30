import React, { useState } from 'react'
import { StyleSheet, Dimensions, View, ScrollView } from 'react-native'

import { Colors } from '~/utils/colors'
import InteractionFooter from './InteractionFooter'
import InteractionHeader from './InteractionHeader'
import AbsoluteBottom from '~/components/AbsoluteBottom'

interface PropsI {
  ctaText: string
  title: string
  description: string
  children: (handletoggleScroll: (value: boolean) => void) => React.ReactNode
}

const WINDOW = Dimensions.get('window')
const SCREEN_HEIGHT = WINDOW.height

const MultipleCredentials: React.FC<PropsI> = ({
  ctaText,
  title,
  description,
  children,
}) => {
  const [isScrollEnabled, setIsScrollEnabled] = useState(true)

  const handletoggleScroll = (value: boolean) => {
    setIsScrollEnabled(value)
  }

  return (
    <>
      <View style={styles.headerWrapper}>
        <InteractionHeader title={title} description={description} />
      </View>
      <ScrollView
        directionalLockEnabled
        scrollEnabled={isScrollEnabled}
        contentContainerStyle={styles.listContainer}
      >
        {children(handletoggleScroll)}
      </ScrollView>
      <AbsoluteBottom customStyles={styles.btns}>
        <InteractionFooter onSubmit={() => {}} ctaText={ctaText} />
      </AbsoluteBottom>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: SCREEN_HEIGHT,
    paddingTop: 32,
    paddingBottom: 0,
    backgroundColor: Colors.mainBlack,
  },
  headerWrapper: {
    paddingHorizontal: 39,
  },
  btns: {
    width: '100%',
    backgroundColor: Colors.black,
    paddingHorizontal: 20,
    paddingVertical: 26,
    bottom: 0,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 80,
  },
})

export default MultipleCredentials
