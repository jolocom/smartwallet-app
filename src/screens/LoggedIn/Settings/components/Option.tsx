import React from 'react'
import { StyleSheet, TouchableOpacity, View, Platform } from 'react-native'
import { CaretRight } from '~/assets/svg'
import JoloText, { JoloTextKind } from '~/components/JoloText'
import { Colors } from '~/utils/colors'
import { JoloTextSizes } from '~/utils/fonts'

interface TitlePropsI {
  title: string | number
  color?: Colors
}
const Title: React.FC<TitlePropsI> = ({ title, color }) => (
  <JoloText
    kind={JoloTextKind.subtitle}
    size={JoloTextSizes.middle}
    color={color}
  >
    {title}
  </JoloText>
)

const IconContainer: React.FC = ({ children }) => (
  <View style={styles.rightIcon}>{children}</View>
)

const RightIcon: React.FC = () => (
  <IconContainer>
    <CaretRight />
  </IconContainer>
)

interface PropsI {
  onPress?: () => void
}

const Option: React.FC<PropsI> & {
  Title: React.FC<TitlePropsI>
  RightIcon: React.FC
  IconContainer: React.FC
} = ({ onPress, children }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={onPress ? 0.2 : 1}
        onPress={onPress}
        style={styles.sectionOption}
      >
        {children}
      </TouchableOpacity>
    </View>
  )
}

Option.Title = Title
Option.IconContainer = IconContainer
Option.RightIcon = RightIcon

const styles = StyleSheet.create({
  container: {
    borderBottomColor: Colors.mainBlack,
    borderBottomWidth: 1,
    width: '100%',
  },
  sectionOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 13,
    paddingVertical: Platform.select({
      ios: 11,
      android: 16,
    }),
    width: '100%',
    alignItems: 'center',
  },
  rightIcon: {
    position: 'absolute',
    right: 16,
  },
})

export default Option
