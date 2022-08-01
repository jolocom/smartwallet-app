import React from 'react'
import { TouchableOpacity, View, StyleSheet } from 'react-native'
import { useSafeArea } from 'react-native-safe-area-context'
import Block from '~/components/Block'
import { Colors } from '~/utils/colors'
import JoloText from '~/components/JoloText'
import { RouteProp, useRoute } from '@react-navigation/core'
import { ScreenNames } from '~/types/screens'
import ScreenContainer from '~/components/ScreenContainer'
import { useGoBack, useRedirect } from '~/hooks/navigation'
import ScreenDismissArea from '~/components/ScreenDismissArea'
import { TransparentModalsParamsList } from '~/screens/LoggedIn/Main'
import { IWithCustomStyle } from '~/types/props'
import useTranslation from '~/hooks/useTranslation'

export interface IPopupOption {
  title: string
  navigation?: {
    screen: ScreenNames
    params?: Record<string, unknown>
  }
  onPress?: () => void
}

export interface PopupMenuProps {
  options: IPopupOption[]
}

const SolidBlock: React.FC<IWithCustomStyle> = ({ children, customStyles }) => (
  <Block customStyles={[styles.block, customStyles]}>{children}</Block>
)

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
  const { t } = useTranslation()
  const goBack = useGoBack()
  const redirect = useRedirect()
  const { bottom } = useSafeArea()
  const { options } =
    useRoute<RouteProp<TransparentModalsParamsList, ScreenNames.PopupMenu>>()
      .params

  const onOptionBtnPress = ({
    navigation,
    onPress,
  }: {
    navigation: IPopupOption['navigation']
    onPress: IPopupOption['onPress']
  }) => {
    if (onPress) {
      onPress()
    }
    if (navigation) {
      redirect(ScreenNames.Main, {
        screen: navigation.screen,
        params: navigation.params,
      })
    }
    goBack()
  }
  return (
    <ScreenContainer isFullscreen backgroundColor={Colors.black65}>
      <ScreenDismissArea onDismiss={goBack} />
      <View style={[styles.container, { paddingBottom: bottom + 24 }]}>
        <SolidBlock>
          {options.map(({ title, navigation, onPress }, i) => (
            <React.Fragment key={i}>
              <PopupButton
                onPress={() => onOptionBtnPress({ navigation, onPress })}
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
          <PopupButton onPress={goBack}>
            {t('Documents.cancelCardOption')}
          </PopupButton>
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
