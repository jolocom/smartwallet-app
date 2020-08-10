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
import { useSelector } from 'react-redux'
import { getInteractionCounterparty } from '~/modules/interaction/selectors'

// NOTE: There is an inconsistency around where the @InteractionIcon is rendered for FAS and BAS.
// For BAS it has to be as the @CustomHeaderComponent prop inside the @ActionSheet because the button
// is not pressible after it crosses the @ActionSheet border (???). In contrast, for FAS it has to be
// inside the @FASWrapper because the icon has to be animated when the interaction screen is scrollable.

// NOTE: When the action sheet is shown from e.g. the @Claims screen and the user taps on the icon
// to navigate to the url, when coming back, the @Claims screen is not tappable anymore, even though the
// @ActionSheet can be interacted with. The issue does not appear when the @ActionSheet is shown from
// the @Scanner screen, hence the issue has to be fixed when implementing DeepLinking.

export const IconWrapper: React.FC<{ customStyle?: ViewStyle }> = ({
  children,
  customStyle,
}) => <View style={[styles.iconWrapper, customStyle]}>{children}</View>

const InteractionIcon: React.FC = () => {
  const counterparty = useSelector(getInteractionCounterparty)
  const initiatorIcon = counterparty?.publicProfile?.image
  const initiatorUrl = counterparty?.publicProfile?.url

  const handlePress = () => {
    initiatorUrl &&
      Linking.canOpenURL(initiatorUrl)
        .then((can) => can && Linking.openURL(initiatorUrl))
        .catch(() => {
          //TODO: show "can't open url" toast
        })
  }

  return (
    <TouchableOpacity
      style={styles.wrapper}
      onPress={handlePress}
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
    zIndex: 2,
  },
})

export default InteractionIcon
