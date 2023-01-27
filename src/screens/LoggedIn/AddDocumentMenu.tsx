import React from 'react'
import { TouchableOpacity, View, StyleSheet } from 'react-native'
import { Colors } from '~/utils/colors'
import JoloText, { JoloTextKind, JoloTextWeight } from '~/components/JoloText'
import { RouteProp, useRoute } from '@react-navigation/core'
import { ScreenNames } from '~/types/screens'
import ScreenContainer from '~/components/ScreenContainer'
import { useGoBack, useReplaceWith } from '~/hooks/navigation'
import { MainStackParamList } from '~/screens/LoggedIn/Main'
import useTranslation from '~/hooks/useTranslation'
import { JoloTextSizes } from '~/utils/fonts'

export interface IAddDocumentOption {
  title: string
  navigation?: {
    screen: ScreenNames
    params?: Record<string, unknown>
  }
  onPress?: () => void
}

export interface AddDocumentMenuProps {
  options: IAddDocumentOption[]
}

const MenuButton: React.FC<{ onPress: () => void }> = ({
  onPress,
  children,
}) => (
  <TouchableOpacity
    style={styles.button}
    activeOpacity={0.5}
    onPress={onPress}
    testID="add-document-menu-button"
  >
    <JoloText size={JoloTextSizes.middle} color={Colors.white}>
      {children}
    </JoloText>
  </TouchableOpacity>
)

const AddDocumentMenu = () => {
  const { t } = useTranslation()
  const goBack = useGoBack()
  const replaceWith = useReplaceWith()
  const { options } =
    useRoute<RouteProp<MainStackParamList, ScreenNames.AddDocumentMenu>>()
      .params

  const onOptionBtnPress = ({
    navigation,
    onPress,
  }: {
    navigation: IAddDocumentOption['navigation']
    onPress: IAddDocumentOption['onPress']
  }) => {
    if (onPress) {
      onPress()
      return
    }
    if (navigation) {
      replaceWith(navigation.screen, navigation.params)
      return
    }
    goBack()
  }
  return (
    <ScreenContainer
      backgroundColor={Colors.black65}
      hasHeaderClose
      customStyles={styles.container}
    >
      <View style={styles.headerContainer}>
        <JoloText testID="title" kind={JoloTextKind.title}>
          {t('AddDocument.header')}
        </JoloText>
        <JoloText
          testID="description"
          size={JoloTextSizes.mini}
          color={Colors.white50}
          weight={JoloTextWeight.regular}
          customStyles={{ marginTop: 12, paddingHorizontal: 32 }}
        >
          {t('AddDocument.description')}
        </JoloText>
      </View>

      <View style={styles.menuContainer}>
        {options.map(({ title, navigation, onPress }, i) => (
          <React.Fragment key={i}>
            <MenuButton
              onPress={() => onOptionBtnPress({ navigation, onPress })}
            >
              {title}
            </MenuButton>
          </React.Fragment>
        ))}
      </View>
    </ScreenContainer>
  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
  },
  headerContainer: {
    paddingHorizontal: 12,
    marginBottom: 25,
    width: '100%',
  },
  menuContainer: {
    marginTop: 10,
    paddingHorizontal: 12,
    width: '100%',
  },
  button: {
    width: '100%',
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(143, 146, 161, 0.2)',
    marginBottom: 20,
  },
})

export default AddDocumentMenu
