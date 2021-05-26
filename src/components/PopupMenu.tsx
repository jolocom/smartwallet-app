import React from 'react'
import { TouchableOpacity, View, StyleSheet } from 'react-native'
import { useSafeArea } from 'react-native-safe-area-context'

import Block from './Block'
import { Colors } from '~/utils/colors'
import JoloText from './JoloText'
import { RouteProp, useRoute } from '@react-navigation/core'
import { ScreenNames } from '~/types/screens'
import ScreenContainer from './ScreenContainer'
import { useGoBack, useRedirect } from '~/hooks/navigation'
import { IWithCustomStyle } from './Card/types'
import ScreenDismissArea from './ScreenDismissArea'
import { TransparentModalsParamsList } from '~/screens/LoggedIn/Main'

export interface IPopupOption {
  title: string
  navigation?: {
    screen: ScreenNames
    params?: Record<string, any>
  }
  onPress?: () => void
}

export interface PopupMenuProps {
  options: IPopupOption[]
}

// FIXME: ugly hack. Due to the Navigation Stack's transparency, the blocks appear to be transparent, together
// with the screen. Stacking them up seems to decrease the opacity, but it's still not a solid color.
const SolidBlock: React.FC<IWithCustomStyle> = ({ children, customStyles }) => {
  return (
    <Block customStyle={[styles.block, customStyles]}>
      <Block customStyle={styles.block}>
        <Block customStyle={styles.block}>{children}</Block>
      </Block>
    </Block>
  )
}

const PopupButton: React.FC<{ onPress: () => void }> = ({
  onPress,
  children,
}) => (
  <TouchableOpacity
    style={styles.button}
    activeOpacity={0.8}
    onPress={onPress}
    testID="popup-menu-button"
  >
    <JoloText>{children}</JoloText>
  </TouchableOpacity>
)

const PopupMenu = () => {
  const goBack = useGoBack()
  const redirect = useRedirect()
  const { bottom } = useSafeArea()
  const { options } =
    useRoute<RouteProp<TransparentModalsParamsList, ScreenNames.PopupMenu>>()
      .params

  return (
    <ScreenContainer isFullscreen backgroundColor={Colors.black65}>
      <ScreenDismissArea onDismiss={goBack} />
      <View style={[styles.container, { paddingBottom: bottom + 24 }]}>
        <SolidBlock>
          {options.map(({ title, navigation, onPress }, i) => (
            <React.Fragment key={i}>
              <PopupButton
                onPress={() => {
                  onPress && onPress()
                  navigation &&
                    redirect(ScreenNames.Main, {
                      screen: navigation.screen,
                      params: navigation.params,
                    })
                  goBack()
                }}
              >
                {title}
              </PopupButton>
              {i !== options.length - 1 && <View style={styles.divider} />}
            </React.Fragment>
          ))}
        </SolidBlock>
        <SolidBlock
          customStyles={{
            marginTop: 16,
          }}
        >
          <PopupButton onPress={goBack}>Close</PopupButton>
        </SolidBlock>
      </View>
    </ScreenContainer>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    width: '100%',
  },
  block: {
    borderRadius: 10,
    backgroundColor: Colors.mainBlack,
  },
  divider: {
    height: 1,
    width: '100%',
    backgroundColor: Colors.darkGray,
    opacity: 0.08,
  },
  button: {
    width: '100%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
})

export default PopupMenu
