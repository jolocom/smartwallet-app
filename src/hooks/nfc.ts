import NfcManager from 'react-native-nfc-manager'
import { SWErrorCodes } from '~/errors/codes'

import { useToasts } from './toasts'
import useTranslation from './useTranslation'

export const useCheckNFC = () => {
  const { t } = useTranslation()
  const { scheduleErrorInfo, scheduleInfo } = useToasts()

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

  return (onSuccess: () => void | Promise<void>) =>
    nfcCheck()
      .then(onSuccess)
      .catch((e) => {
        if (e.message === SWErrorCodes.SWNfcNotSupported) {
          scheduleErrorInfo(e, {
            title: t('Toasts.nfcCompatibilityTitle'),
            message: t('Toasts.nfcCompatibilityMsg'),
          })
        } else if (e.message === SWErrorCodes.SWNfcNotEnabled) {
          scheduleInfo({
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
          throw new Error(e)
        }
      })
}
