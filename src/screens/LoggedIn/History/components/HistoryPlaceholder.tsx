import React from 'react'
import { View, StyleSheet } from 'react-native'
import { debugView } from '~/utils/dev'
import JoloText, { JoloTextKind, JoloTextWeight } from '~/components/JoloText'
import { strings } from '~/translations'
import { JoloTextSizes } from '~/utils/fonts'
import { Colors } from '~/utils/colors'

const HistoryPlaceholder = () => {
  return (
    <View style={styles.container}>
      <JoloText kind={JoloTextKind.title}>{strings.NO_HISTORY_YET}</JoloText>
      <JoloText
        size={JoloTextSizes.mini}
        color={Colors.white50}
        weight={JoloTextWeight.regular}
        customStyles={{ marginTop: 12, paddingHorizontal: 32 }}
      >
        {strings.YOU_DONT_HAVE_ANY_COMPLETED_INTERACTIIONS_YET_MAKE_ONE_TODAY}
      </JoloText>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: '20%',
  },
})

export default HistoryPlaceholder
