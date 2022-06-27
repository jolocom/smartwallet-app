import React from 'react'
import {
  StyleSheet,
  View,
  Platform,
  TouchableOpacity,
  TextStyle,
} from 'react-native'
import { CaretRight } from '~/assets/svg'
import { IWithCustomStyle } from '~/types/props'
import JoloText, { JoloTextKind } from '~/components/JoloText'
import { Colors } from '~/utils/colors'
import { JoloTextSizes } from '~/utils/fonts'

interface TitlePropsI extends IWithCustomStyle<TextStyle> {
  title: string | number
  color?: Colors
}
const Title: React.FC<TitlePropsI> = ({ title, color, customStyles }) => (
  <JoloText
    kind={JoloTextKind.subtitle}
    size={JoloTextSizes.middle}
    color={color}
    customStyles={[{ textAlign: 'left' }, customStyles]}
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

interface PropsI extends IWithCustomStyle<TextStyle> {
  onPress?: () => void
  hasBorder?: boolean
  disabled?: boolean
}

const Option: React.FC<PropsI> & {
  Title: React.FC<TitlePropsI>
  RightIcon: React.FC
  IconContainer: React.FC
} = ({
  onPress,
  hasBorder = true,
  disabled = false,
  customStyles,
  children,
}) => {
  return (
    <View style={[styles.container, hasBorder && styles.border, customStyles]}>
      <TouchableOpacity
        activeOpacity={onPress ? 0.2 : 1}
        onPress={onPress}
        style={[styles.sectionOption, disabled && styles.disabled]}
        disabled={disabled}
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
    width: '100%',
  },
  border: {
    borderBottomColor: Colors.mainBlack,
    borderBottomWidth: 1,
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
  disabled: {
    opacity: 0.1,
  },
})

export default Option
