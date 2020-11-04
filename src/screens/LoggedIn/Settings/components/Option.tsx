import React from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { CaretRight } from '~/assets/svg'
import JoloText, { JoloTextKind } from '~/components/JoloText'
import { Colors } from '~/utils/colors'
import { JoloTextSizes } from '~/utils/fonts'

interface TitlePropsI {
  title: string
}
const Title: React.FC<TitlePropsI> = ({ title }) => (
  <JoloText kind={JoloTextKind.subtitle} size={JoloTextSizes.middle}>
    {title}
  </JoloText>
)

const RightIcon: React.FC = () => (
  <View style={styles.rightIcon}>
    <CaretRight />
  </View>
)

interface PropsI {
  onPress?: () => void
}

const Option: React.FC<PropsI> & {
  Title: React.FC<TitlePropsI>
  RightIcon: React.FC
} = ({ onPress, children }) => {
  return (
    <View style={{ borderBottomColor: Colors.mainBlack, borderBottomWidth: 1 }}>
      <TouchableOpacity onPress={onPress} style={styles.sectionOption}>
        {children}
      </TouchableOpacity>
    </View>
  )
}

Option.Title = Title
Option.RightIcon = RightIcon

const styles = StyleSheet.create({
  sectionOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 13,
    paddingVertical: 11,
    width: '100%',
    alignItems: 'center',
  },
  rightIcon: {
    position: 'absolute',
    right: 16,
  },
})

export default Option
