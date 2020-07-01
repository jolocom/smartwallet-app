import React, { useState } from 'react'
import { StyleSheet, Dimensions, View, ScrollView } from 'react-native'

import { Colors } from '~/utils/colors'
import InteractionFooter from './InteractionFooter'
import InteractionHeader from './InteractionHeader'
import AbsoluteBottom from '~/components/AbsoluteBottom'
import { useSelector } from 'react-redux'
import { getInteractionSheet } from '~/modules/interaction/selectors'

import getCTAText from './utils/getCTAText'

interface PropsI {
  title: string
  description: string
  onSubmit: () => void
  children: (handletoggleScroll: (value: boolean) => void) => React.ReactNode
}

const WINDOW = Dimensions.get('window')
const SCREEN_HEIGHT = WINDOW.height

const MultipleCredentials: React.FC<PropsI> = ({
  title,
  description,
  children,
  onSubmit,
}) => {
  const [isScrollEnabled, setIsScrollEnabled] = useState(true)

  const interactionType = useSelector(getInteractionSheet)

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
        <InteractionFooter
          onSubmit={onSubmit}
          ctaText={getCTAText(interactionType)}
        />
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
