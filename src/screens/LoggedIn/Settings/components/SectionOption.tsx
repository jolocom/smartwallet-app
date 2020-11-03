import React from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import JoloText, { JoloTextKind } from '~/components/JoloText'
import { Colors } from '~/utils/colors'
import { JoloTextSizes } from '~/utils/fonts'

interface SectionOptionPropsI {
  label: string
  onPress?: () => void
}

const SectionOption: React.FC<SectionOptionPropsI> = ({
  label,
  onPress,
  children: rightSideComponent,
}) => {
  return (
    <View
      style={{
        borderBottomColor: Colors.mainBlack,
        borderBottomWidth: 1,
        elevation: 20,
      }}
    >
      <TouchableOpacity onPress={onPress} style={styles.sectionOption}>
        <JoloText kind={JoloTextKind.subtitle} size={JoloTextSizes.middle}>
          {label}
        </JoloText>
        {rightSideComponent}
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  sectionOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 18,
    width: '100%',
  },
})

export default SectionOption
