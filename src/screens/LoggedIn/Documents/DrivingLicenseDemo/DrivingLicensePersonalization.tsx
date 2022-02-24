import React from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { ORIGINAL_DOCUMENT_CARD_HEIGHT, ORIGINAL_DOCUMENT_CARD_WIDTH, ORIGINAL_DOCUMENT_SCREEN_WIDTH } from '~/components/Cards/DocumentSectionCards/consts'
import ScaledCard from '~/components/Cards/ScaledCard'
import JoloText from '~/components/JoloText'
import ScreenContainer from '~/components/ScreenContainer'
import { useRedirect } from '~/hooks/navigation'
import { ScreenNames } from '~/types/screens'
import { Colors } from '~/utils/colors'
import { useDrivingLicense } from './hooks'

export const DrivingLicensePersonalization = () => {
    const {personalizeLicense} = useDrivingLicense()
    const redirect = useRedirect()

    const handlePress = () => {
        personalizeLicense((requests) => {
            redirect(ScreenNames.DrivingLicenseForm, {requests})
        })
    }

    return (
        <TouchableOpacity activeOpacity={0.7} onPress={handlePress}>
            <ScaledCard
                originalHeight={ORIGINAL_DOCUMENT_CARD_HEIGHT}
                originalWidth={ORIGINAL_DOCUMENT_CARD_WIDTH}
                originalScreenWidth={ORIGINAL_DOCUMENT_SCREEN_WIDTH}
                style={{ position: 'relative', overflow: 'hidden', alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.white85 }}
                scaleStyle={{ borderRadius: 15 }}
                testID="documentCard"
                >
                    <JoloText color={Colors.black}>Add Driving License</JoloText>
            </ScaledCard>
        </TouchableOpacity>
    )
}