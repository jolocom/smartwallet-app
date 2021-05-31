import React, { Children } from 'react'
import { StyleSheet, View } from 'react-native'

import { Colors } from '~/utils/colors'
import JoloText, { JoloTextKind, JoloTextWeight } from '~/components/JoloText'
import { JoloTextSizes } from '~/utils/fonts'
import BP from '~/utils/breakpoints'
import ScreenContainer from '~/components/ScreenContainer'
import { debugView } from '~/utils/dev'

interface Props {
  title: string
  isPaddedTitle?: boolean
}

const InteractionSection: React.FC<Props> = ({
  title,
  children,
  isPaddedTitle = false,
}) => {
  if (!Children.count(children)) return null
  return (
    <View style={styles.sectionContainer}>
      <View style={{ paddingHorizontal: isPaddedTitle ? 24 : 0 }}>
        <JoloText
          kind={JoloTextKind.title}
          size={JoloTextSizes.middle}
          color={Colors.white35}
          weight={JoloTextWeight.regular}
          customStyles={{
            textAlign: 'left',
            marginBottom: 12,
          }}
        >
          {title}
        </JoloText>
      </View>
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginBottom: BP({ large: 36, medium: 36, default: 24 }),
  },
})

export default InteractionSection
