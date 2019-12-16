import { ThunkAction } from '../../store'
import { accountActions } from '../index'
import { createStickyNotification } from '../../lib/notifications'
import { scheduleNotification } from './index'

export const checkRecoverySetup: ThunkAction = async (dispatch, getState) => {
  await dispatch(accountActions.hasExternalCredentials)

  const {
    settings: { seedPhraseSaved },
    account: {
      claims: { hasExternalCredentials },
    },
  } = getState()

  if (!seedPhraseSaved && hasExternalCredentials) {
    const notification = createStickyNotification({
      title: 'Confirmation is not complete',
      message:
        'Your data may be lost because you did not confirm the seed phrase. We advise you to complete the registration.',
    })
    return dispatch(scheduleNotification(notification))
  }
}
