import { useEffect } from 'react'
import { Platform } from 'react-native'
import NfcManager, { NfcTech } from 'react-native-nfc-manager'
import { SWErrorCodes } from '~/errors/codes'

import { useToasts } from './toasts'
import useTranslation from './useTranslation'

//NOTE: only works on Android
export const useNFC = () => {
  const { scheduleErrorWarning } = useToasts()

  useEffect(() => {
    if (Platform.OS === 'android') {
      NfcManager.requestTechnology(NfcTech.Ndef).catch(console.warn)

      return () => {
        NfcManager.cancelTechnologyRequest().catch(scheduleErrorWarning)
      }
    }
  }, [])
}

export const useCheckNFC = () => {
  const { t } = useTranslation()
  const { scheduleErrorInfo, scheduleWarning } = useToasts()

  const nfcCheck = async () => {
    const supported = await NfcManager.isSupported()

    if (!supported) {
      throw new Error(SWErrorCodes.SWNfcNotSupported)
    }

    await NfcManager.start()
    const isEnabled = await NfcManager.isEnabled()

    if (!isEnabled) {
      throw new Error(SWErrorCodes.SWNfcNotEnabled)
    }
  }

  return (onSuccess: () => void | Promise<void>) => {
    nfcCheck()
      .then(onSuccess)
      .catch((e) => {
        if (e instanceof Error) {
          if (e.message === SWErrorCodes.SWNfcNotSupported) {
            scheduleErrorInfo(e, {
              title: t('Toasts.nfcCompatibilityTitle'),
              message: t('Toasts.nfcCompatibilityMsg'),
            })
          } else if (e.message === SWErrorCodes.SWNfcNotEnabled) {
            scheduleWarning({
              title: t('Toasts.nfcOffTitle'),
              message: t('Toasts.nfcOffMsg'),
              interact: {
                label: t('Toasts.nfcOffBtn'),
                onInteract: () => {
                  NfcManager.goToNfcSetting()
                },
              },
            })
          } else {
            throw new Error(e.message)
          }
        }
      })
  }
}
