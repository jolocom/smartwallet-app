import React from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'
import JoloText, { JoloTextKind } from '~/components/JoloText'
import { useRedirect } from '~/hooks/navigation'
import { ScreenNames } from '~/types/screens'
import { Colors } from '~/utils/colors'
import { JoloTextSizes } from '~/utils/fonts'
import { useDrivingLicense } from './hooks'

export const DrivingLicensePersonalization = () => {
  const { personalizeLicense } = useDrivingLicense()
  const redirect = useRedirect()

  const handlePress = () => {
    personalizeLicense((requests) => {
      redirect(ScreenNames.DrivingLicenseForm, { requests })
    })
  }

  return (
    <TouchableOpacity
      style={{
        height: 35,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: Colors.white60,
        paddingHorizontal: 20,
        marginVertical: 20,
        alignItems: 'center',
        justifyContent: 'center',
      }}
      activeOpacity={0.5}
      onPress={handlePress}
    >
      <JoloText
        kind={JoloTextKind.subtitle}
        color={Colors.white60}
        size={JoloTextSizes.mini}
      >
        Add Driving License
      </JoloText>
    </TouchableOpacity>
  )
}
