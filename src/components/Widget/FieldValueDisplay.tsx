import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Colors } from '~/utils/colors'
import { JoloTextSizes } from '~/utils/fonts'
import JoloText, { JoloTextKind } from '../JoloText'

const FieldValueDisplay: React.FC = ({ children }) => {
  return (
    <View style={styles.field}>
      <JoloText
        kind={JoloTextKind.subtitle}
        size={JoloTextSizes.middle}
        color={Colors.white90}
      >
        {children}
      </JoloText>
    </View>
  )
}

const styles = StyleSheet.create({
  field: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: 23,
    backgroundColor: Colors.black,
    borderRadius: 8,
    height: 50,
    marginVertical: 2,
  },
})

export default FieldValueDisplay
