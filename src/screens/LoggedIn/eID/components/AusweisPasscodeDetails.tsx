import { useNavigation } from '@react-navigation/core'
import React from 'react'
import { View } from 'react-native'
import { useSafeArea } from 'react-native-safe-area-context'
import Btn, { BtnTypes } from '~/components/Btn'
import Collapsible from '~/components/Collapsible'
import JoloText, { JoloTextKind, JoloTextWeight } from '~/components/JoloText'
import { NavHeaderType } from '~/components/NavigationHeader'
import useTranslation from '~/hooks/useTranslation'
import { ScreenNames } from '~/types/screens'
import { Colors } from '~/utils/colors'

export const AusweisPasscodeDetails = () => {
  const { top } = useSafeArea()
  const { t } = useTranslation()
  const navigation = useNavigation()

  const handlePasscodeSettings = () => {
    // NOTE: This will cancel the flow right now. Maybe AusweisChangePin should
    // be in the eID stack. This will also fix the navigation issue with the scanner
    navigation.navigate(ScreenNames.AusweisChangePin)
  }

  return (
    <View
      style={{ flex: 1, paddingTop: top, backgroundColor: Colors.mainDark }}
    >
      <Collapsible
        renderScroll={() => (
          <Collapsible.Scroll
            containerStyles={{ paddingHorizontal: 20, paddingBottom: '30%' }}
          >
            <Collapsible.Title text={t('AusweisPinInfo.header')}>
              <JoloText
                kind={JoloTextKind.title}
                weight={JoloTextWeight.regular}
              >
                {t('AusweisPinInfo.header')}
              </JoloText>
            </Collapsible.Title>
            <JoloText customStyles={{ textAlign: 'left', marginTop: 28 }}>
              {t('AusweisPinInfo.description')}
            </JoloText>
          </Collapsible.Scroll>
        )}
        renderHeader={() => (
          <Collapsible.Header
            customStyles={{ backgroundColor: Colors.mainDark }}
            type={NavHeaderType.Back}
          />
        )}
      >
        <View
          style={{
            position: 'absolute',
            bottom: 16,
            width: '100%',
            paddingVertical: 10,
            backgroundColor: Colors.mainDark,
          }}
        >
          <Btn onPress={handlePasscodeSettings} type={BtnTypes.quaternary}>
            {t('AusweisPinInfo.btn')}
          </Btn>
        </View>
      </Collapsible>
    </View>
  )
}
