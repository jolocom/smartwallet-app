import React from 'react'
import {
  View,
  Image,
  StyleSheet,
  Linking,
  TouchableOpacity,
  ViewStyle,
} from 'react-native'
import { Colors } from '~/utils/colors'
import { InitiatorPlaceholderIcon } from '~/assets/svg'
import { InteractionSummary } from '@jolocom/sdk/js/src/lib/interactionManager/types'
import { useSelector } from 'react-redux'
import { getInteractionSummary } from '~/modules/interaction/selectors'

// NOTE: There is an inconsistency around where the @InteractionIcon is rendered for FAS and BAS.
// For BAS it has to be as the @CustomHeaderComponent prop inside the @ActionSheet because the button
// is not pressible after it crosses the @ActionSheet border (???). In contrast, for FAS it has to be
// inside the @FASWrapper because the icon has to be animated when the interaction screen is scrollable.

export const IconWrapper: React.FC<{ customStyle?: ViewStyle }> = ({
  children,
  customStyle,
}) => <View style={[styles.iconWrapper, customStyle]}>{children}</View>

const InteractionIcon: React.FC = () => {
  const { initiator }: InteractionSummary = useSelector(getInteractionSummary)
  const initiatorIcon = initiator?.publicProfile?.image
  const initiatorUrl = initiator?.publicProfile?.url

  return (
    <TouchableOpacity
      style={styles.wrapper}
      onPress={() => {
        initiatorUrl &&
          Linking.canOpenURL(initiatorUrl).then(
            (can) => can && Linking.openURL(initiatorUrl),
          )
      }}
      activeOpacity={initiatorUrl ? 0.8 : 1}
    >
      {initiatorIcon ? (
        <Image style={styles.image} source={{ uri: initiatorIcon }} />
      ) : (
        <View pointerEvents="none">
          <InitiatorPlaceholderIcon />
        </View>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: Colors.white,
    borderRadius: 35,
    width: 70,
    height: 70,
  },
  image: {
    width: 70,
    height: 70,
  },
  iconWrapper: {
    width: '100%',
    alignItems: 'center',
    height: 70,
  },
})

export default InteractionIcon
