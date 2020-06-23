import React from 'react'
import ActionSheet from 'react-native-actions-sheet'
import { StyleSheet, Dimensions, View } from 'react-native'

import { Colors } from '~/utils/colors'
import InteractionFooter from './InteractionFooter'
import InteractionHeader from './InteractionHeader'
import AbsoluteBottom from '~/components/AbsoluteBottom'
import { FlatList } from 'react-native-gesture-handler'
import Paragraph, { ParagraphSizes } from '~/components/Paragraph'
import { strings } from '~/translations/strings'

interface PropsI {
  ctaText: string
  title: string
  description: string
}

const claims = [{ id: 1 }, { id: 2 }, { id: 3 }]

const height = Dimensions.get('window').height

const Card = () => {
  return (
    <View style={styles.cardContainer}>
      <View style={styles.card}></View>
      <View style={styles.instruction}>
        <Paragraph size={ParagraphSizes.micro} color={Colors.white45}>
          {strings.PULL_TO_CHOOSE}
        </Paragraph>
      </View>
    </View>
  )
}

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
        <FlatList
          contentContainerStyle={{ paddingBottom: 80 }}
          data={claims}
          renderItem={({ item }) => <Card />}
        />
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
  listContainer: {
    flex: 1,
    borderColor: 'green',
    borderWidth: 2,
  },
  cardContainer: {
    flex: 1,
    width: '100%',
    position: 'relative',
    paddingHorizontal: 20,
    marginVertical: 10,
  },
  card: {
    width: 268,
    height: 170,
    borderRadius: 10,
    backgroundColor: Colors.activity,
  },
  instruction: {
    position: 'absolute',
    right: 15,
    top: '45%',
    width: 70,
    paddingHorizontal: 10,
  },
})

export default MultipleCredentials
