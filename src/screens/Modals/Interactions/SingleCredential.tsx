import React from 'react'
import { StyleSheet, View } from 'react-native'
import ActionSheet from 'react-native-actions-sheet'

import Header from '~/components/Header'
import { Colors } from '~/utils/colors'
import InteractionFooter from './InteractionFooter'
import InteractionHeader from './InteractionHeader'

interface PropsI {
  title: string
  description: string
  ctaText: string
}

const ReceiveSingleCredential: React.FC<PropsI> = React.forwardRef(
  ({ title, description, ctaText }, ref) => {
    const hideActionSheet = () => {
      ref.current?.setModalVisible(false)
    }

    return (
      <ActionSheet
        ref={ref}
        containerStyle={styles.container}
        initialOffsetFromBottom={0}
        closeOnTouchBackdrop={false}
      >
        <InteractionHeader title={title} description={description} />
        <View style={styles.body}>
          <Header color={Colors.activity}>Body</Header>
        </View>
        <InteractionFooter
          hideActionSheet={hideActionSheet}
          ctaText={ctaText}
        />
      </ActionSheet>
    )
  },
)

const styles = StyleSheet.create({
  container: {
    paddingVertical: 32,
    paddingHorizontal: 20,
    backgroundColor: Colors.black,
  },
  body: {
    paddingVertical: 20,
  },
})

export default ReceiveSingleCredential
