import { useNavigation } from '@react-navigation/core'
import React from 'react'
import { Linking } from 'react-native'

import JoloText, { JoloTextKind } from '~/components/JoloText'
import { useToasts } from '~/hooks/toasts'
import useTranslation from '~/hooks/useTranslation'
import InteractionTitle from '~/screens/Modals/Interaction/InteractionFlow/components/InteractionTitle'
import { LogoContainerBAS } from '~/screens/Modals/Interaction/InteractionFlow/components/styled'
import { Colors } from '~/utils/colors'
import { JoloTextSizes } from '~/utils/fonts'
import { eIDScreens } from '../types'
import {
  useCheckNFC,
  useAusweisContext,
  useAusweisInteraction,
  useAusweisSkipCompatibility,
} from '../hooks'
import { AusweisBottomSheet, AusweisButtons, AusweisLogo } from '../styled'
import { SWErrorCodes } from '~/errors/codes'
import { useRedirect } from '~/hooks/navigation'

export const AusweisRequest = () => {
  const { t } = useTranslation()
  const redirect = useRedirect()
  const { checkNfcSupport, goToNfcSettings } = useCheckNFC()
  //TODO: not sure whether we need the provider or certificate issuer's URL/name
  const { providerUrl, providerName, resetRequest } = useAusweisContext()
  const { cancelFlow } = useAusweisInteraction()
  const { scheduleErrorInfo, scheduleInfo, scheduleErrorWarning } = useToasts()
  const { shouldSkip: shouldSkipCompatibility } = useAusweisSkipCompatibility()

  const handleProceed = async () => {
    checkNfcSupport()
      .then(async () => {
        if (shouldSkipCompatibility) {
          // @ts-ignore
          redirect(eIDScreens.RequestDetails)
        } else {
          // @ts-ignore
          redirect(eIDScreens.ReadinessCheck)
        }
      })
      .catch((e) => {
        if (e.message === SWErrorCodes.SWNfcNotSupported) {
          scheduleErrorInfo(e, {
            title: 'NFC Compatibility problem',
            message:
              'We have to inform you that your phone does not support the required NFC functionality',
          })
        } else if (e.message === SWErrorCodes.SWNfcNotEnabled) {
          scheduleInfo({
            title: 'Please turn on NFC',
            message: 'Please go to the settings and enable NFC',
            interact: {
              label: 'Settings',
              onInteract: () => {
                goToNfcSettings()
              },
            },
          })
        } else {
          console.warn(e)
          scheduleErrorWarning(e)
        }
      })
  }

  const handleIgnore = () => {
    cancelFlow()
    resetRequest()
  }

  return (
    <AusweisBottomSheet onDismiss={handleIgnore}>
      <LogoContainerBAS>
        <AusweisLogo />
      </LogoContainerBAS>
      <InteractionTitle label={t('CredentialRequest.header')} />
      <JoloText
        kind={JoloTextKind.subtitle}
        size={JoloTextSizes.mini}
        color={Colors.white70}
        customStyles={{ paddingHorizontal: 10 }}
      >
        {`To complete your hotel check-in ${providerName} is requesting specific set of data.`}
      </JoloText>
      <JoloText
        kind={JoloTextKind.subtitle}
        size={JoloTextSizes.mini}
        color={Colors.white70}
        customStyles={{
          textDecorationLine: 'underline',
          marginVertical: 40,
        }}
        onPress={() => Linking.openURL(providerUrl)}
      >
        {providerUrl}
      </JoloText>
      <AusweisButtons
        submitLabel="Review the request"
        cancelLabel="Ignore"
        onSubmit={handleProceed}
        onCancel={handleIgnore}
      />
    </AusweisBottomSheet>
  )
}
