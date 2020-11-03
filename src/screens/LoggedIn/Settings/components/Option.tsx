import React from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
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

interface PropsI {
  onPress?: () => void
}
const Option: React.FC<PropsI> & { Title: React.FC<TitlePropsI> } = ({
  onPress,
  children,
}) => {
  return (
    <View style={{ borderBottomColor: Colors.mainBlack, borderBottomWidth: 1 }}>
      <TouchableOpacity onPress={onPress} style={styles.sectionOption}>
        {children}
      </TouchableOpacity>
    </View>
  )
}

Option.Title = Title

const styles = StyleSheet.create({
  sectionOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 12,
    width: '100%',
    alignItems: 'center',
  },
})

export default Option
