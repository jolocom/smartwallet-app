import React from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'
import JoloText, { JoloTextKind } from '~/components/JoloText'
import { useRedirectTo } from '~/hooks/navigation'
import { ScreenNames } from '~/types/screens'
import { Colors } from '~/utils/colors'
import { JoloTextSizes } from '~/utils/fonts'

interface SectionOptionPropsI {
  label: string
  screenRedirectTo?: ScreenNames
  onPress?: () => void
}

const SectionOption: React.FC<SectionOptionPropsI> = ({
  label,
  screenRedirectTo,
  onPress,
}) => {
  const redirectTo = screenRedirectTo && useRedirectTo(screenRedirectTo)
  const handlePress = () => {
    if (screenRedirectTo) {
      redirectTo && redirectTo()
    } else {
      onPress && onPress()
    }
  }
  return (
    <TouchableOpacity onPress={handlePress} style={styles.sectionOption}>
      <JoloText kind={JoloTextKind.subtitle} size={JoloTextSizes.middle}>
        {label}
      </JoloText>
      <JoloText kind={JoloTextKind.subtitle} size={JoloTextSizes.middle}>
        arrow
      </JoloText>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  sectionContainer: {
    justifyContent: 'flex-start',
    marginBottom: 44,
    alignItems: 'flex-start',
    width: '100%',
  },
  sectionOptionContainer: {
    backgroundColor: Colors.black,
    width: '100%',
    borderRadius: 8,
  },
  sectionOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 18,
    width: '100%',
    borderBottomColor: Colors.mainBlack,
    borderBottomWidth: 1,
  },
})

export default SectionOption
