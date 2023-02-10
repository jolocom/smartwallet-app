import React from 'react'
import { View, StyleSheet } from 'react-native'
import { Colors } from '~/utils/colors'
import JoloText, { JoloTextKind, JoloTextWeight } from '~/components/JoloText'
import { RouteProp, useRoute } from '@react-navigation/core'
import { ScreenNames } from '~/types/screens'
import ScreenContainer from '~/components/ScreenContainer'
import { useGoBack, useReplaceWith } from '~/hooks/navigation'
import { MainStackParamList } from '~/screens/LoggedIn/Main'
import useTranslation from '~/hooks/useTranslation'
import { JoloTextSizes } from '~/utils/fonts'
import Btn, { BtnTypes } from '~/components/Btn'

export interface AddDocumentOption {
  title: string
  navigation?: {
    screen: ScreenNames
    params?: Record<string, unknown>
  }
  onPress?: () => void
}

export interface AddDocumentMenuProps {
  options: AddDocumentOption[]
}

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
    navigation: AddDocumentOption['navigation']
    onPress: AddDocumentOption['onPress']
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
          {t('Documents.addDocumentHeader')}
        </JoloText>
        <JoloText
          testID="description"
          size={JoloTextSizes.mini}
          color={Colors.white50}
          weight={JoloTextWeight.regular}
          customStyles={{ marginTop: 12, paddingHorizontal: 32 }}
        >
          {t('Documents.addDocumentDescription')}
        </JoloText>
      </View>

      <View style={styles.menuContainer}>
        {options.map(({ title, navigation, onPress }, i) => (
          <React.Fragment key={i}>
            <Btn
              type={BtnTypes.secondary}
              customContainerStyles={styles.button}
              onPress={() => onOptionBtnPress({ navigation, onPress })}
            >
              {title}
            </Btn>
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
    marginBottom: 15,
    width: '100%',
  },
  menuContainer: {
    marginTop: 5,
    paddingHorizontal: 12,
    width: '100%',
  },
  button: {
    width: '100%',
    height: 45,
    borderColor: Colors.borderGray20,
    borderWidth: 2,
  },
})

export default AddDocumentMenu
