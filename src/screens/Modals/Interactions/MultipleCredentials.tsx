import React from 'react'
import ActionSheet from 'react-native-actions-sheet'
import { StyleSheet, Dimensions, View } from 'react-native'

import { Colors } from '~/utils/colors'
import InteractionFooter from './InteractionFooter'
import InteractionHeader from './InteractionHeader'
import AbsoluteBottom from '~/components/AbsoluteBottom'

interface PropsI {
  ctaText: string
  title: string
  description: string
}

const height = Dimensions.get('window').height

const MultipleCredentials: React.FC<PropsI> = React.forwardRef(
  ({ ctaText, title, description }, ref) => {
    const hideActionSheet = () => {
      ref.current?.setModalVisible(false)
    }

    return (
      <ActionSheet
        ref={ref}
        containerStyle={styles.container}
        footerAlwaysVisible
      >
        <View style={styles.headerWrapper}>
          <InteractionHeader title={title} description={description} />
        </View>
        <AbsoluteBottom customStyles={styles.btns}>
          <InteractionFooter
            hideActionSheet={hideActionSheet}
            ctaText={ctaText}
          />
        </AbsoluteBottom>
      </ActionSheet>
    )
  },
)

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    height: height,
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
})

export default MultipleCredentials
